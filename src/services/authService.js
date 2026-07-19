// Auth service — real Shopify Customer Account API (OAuth 2.0 + PKCE).

import { generateRandomString, generateCodeChallenge } from "../utils/pkce";

const SHOP_DOMAIN = process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
const CLIENT_ID = process.env.REACT_APP_SHOPIFY_CUSTOMER_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SHOPIFY_CUSTOMER_REDIRECT_URI;

const SESSION_KEY = "shopify_customer_session";
const PKCE_KEY = "shopify_customer_pkce";

async function getDiscoveryDocument() {
  const res = await fetch(
    `https://${SHOP_DOMAIN}/.well-known/openid-configuration`
  );
  return res.json();
}

async function getGraphqlEndpoint() {
  const res = await fetch(
    `https://${SHOP_DOMAIN}/.well-known/customer-account-api`
  );
  const { graphql_api } = await res.json();
  return graphql_api;
}

function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function startLogin() {
  const discovery = await getDiscoveryDocument();

  const verifier = generateRandomString(64);
  const challenge = await generateCodeChallenge(verifier);
  const state = generateRandomString(32);
  const nonce = generateRandomString(32);

  sessionStorage.setItem(PKCE_KEY, JSON.stringify({ verifier, state }));

  const url = new URL(discovery.authorization_endpoint);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email customer-account-api:full");
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);

  window.location.href = url.toString();
}

export async function handleCallback(searchParams) {
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  if (errorParam) {
    throw new Error(`Login failed: ${errorParam}`);
  }

  const stored = JSON.parse(sessionStorage.getItem(PKCE_KEY) || "null");
  sessionStorage.removeItem(PKCE_KEY);

  if (!stored || state !== stored.state) {
    throw new Error("Login could not be verified. Please try again.");
  }

  const discovery = await getDiscoveryDocument();

  const tokenRes = await fetch(discovery.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code,
      code_verifier: stored.verifier,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    throw new Error(tokenData.error_description || "Could not sign you in.");
  }

  const user = await fetchCustomer(tokenData.access_token);

  const session = {
    user,
    accessToken: tokenData.access_token,
    idToken: tokenData.id_token,
    expiresAt: Date.now() + tokenData.expires_in * 1000,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return user;
}

async function fetchCustomer(accessToken) {
  const graphqlEndpoint = await getGraphqlEndpoint();

  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({
      query: `
        query CustomerDetails {
          customer {
            firstName
            lastName
            emailAddress { emailAddress }
          }
        }
      `,
    }),
  });
  const { data } = await res.json();
  return {
    firstName: data.customer.firstName,
    lastName: data.customer.lastName,
    email: data.customer.emailAddress?.emailAddress,
  };
}

export async function updateCustomerName(firstName, lastName) {
  const session = getSession();
  if (!session) throw new Error("You need to be logged in to do this.");

  const graphqlEndpoint = await getGraphqlEndpoint();

  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: session.accessToken,
    },
    body: JSON.stringify({
      query: `
        mutation UpdateCustomerName($input: CustomerUpdateInput!) {
          customerUpdate(input: $input) {
            customer {
              firstName
              lastName
            }
            userErrors { field message }
          }
        }
      `,
      variables: { input: { firstName, lastName } },
    }),
  });

  const { data } = await res.json();
  const userErrors = data.customerUpdate.userErrors;
  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join(", "));
  }

  const updatedUser = {
    ...session.user,
    firstName: data.customerUpdate.customer.firstName,
    lastName: data.customerUpdate.customer.lastName,
  };

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ ...session, user: updatedUser })
  );

  return updatedUser;
}

export async function getOrders(first = 10) {
  const session = getSession();
  if (!session) throw new Error("You need to be logged in to view orders.");

  const graphqlEndpoint = await getGraphqlEndpoint();

  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: session.accessToken,
    },
    body: JSON.stringify({
      query: `
        query CustomerOrders($first: Int!) {
          customer {
            orders(first: $first) {
              nodes {
                id
                name
                processedAt
                financialStatus
                fulfillmentStatus
                statusPageUrl
                totalPrice { amount currencyCode }
                lineItems(first: 5) {
                  nodes {
                    title
                    quantity
                    image { url altText }
                    totalPrice { amount currencyCode }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { first },
    }),
  });

  const { data, errors } = await res.json();
  if (errors && errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }

  return data.customer.orders.nodes.map((order) => ({
    id: order.id,
    name: order.name,
    processedAt: order.processedAt,
    financialStatus: order.financialStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    statusPageUrl: order.statusPageUrl,
    totalPrice: parseFloat(order.totalPrice.amount),
    currencyCode: order.totalPrice.currencyCode,
    lineItems: order.lineItems.nodes.map((li) => ({
      title: li.title,
      quantity: li.quantity,
      image: li.image?.url || null,
      totalPrice: parseFloat(li.totalPrice?.amount || 0),
    })),
  }));
}

export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
  return session.user;
}

export async function logout() {
  const session = getSession();
  const idToken = session ? session.idToken : null;
  sessionStorage.removeItem(SESSION_KEY);

  try {
    const discovery = await getDiscoveryDocument();
    if (discovery.end_session_endpoint && idToken) {
      const url = new URL(discovery.end_session_endpoint);
      url.searchParams.set("id_token_hint", idToken);
      window.location.href = url.toString();
    }
  } catch (err) {
    console.error("Failed to reach Shopify's logout endpoint:", err);
  }
}

// // Auth service.
// //
// // AuthContext calls the four functions below and never touches
// // `data/fakeUsers.js` directly. That means that later, replacing fake
// // auth with Shopify Customer Authentication is a matter of rewriting
// // the INSIDE of these four functions — login, register, logout,
// // getCurrentUser — while AuthContext and every component that uses it
// // stay untouched.
// //
// // Each fake function below is commented with the Shopify Customer API
// // call that should eventually replace it.

// import fakeUsers from "../data/fakeUsers";

// const SESSION_KEY = "fold_fake_session"; // sessionStorage key, cleared on logout
// const FAKE_DELAY_MS = 250;

// function delay(value) {
//   return new Promise((resolve) =>
//     setTimeout(() => resolve(value), FAKE_DELAY_MS)
//   );
// }

// // REPLACE LATER: Shopify `customerAccessTokenCreate` mutation.
// export async function login(email, password) {
//   const user = fakeUsers.find(
//     (u) =>
//       u.email.toLowerCase() === email.toLowerCase() && u.password === password
//   );
//   if (!user) {
//     return delay({ success: false, error: "Incorrect email or password." });
//   }
//   const { password: _pw, ...safeUser } = user;
//   sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
//   return delay({ success: true, user: safeUser });
// }

// // REPLACE LATER: Shopify `customerCreate` mutation.
// export async function register({ firstName, lastName, email, password }) {
//   const exists = fakeUsers.some(
//     (u) => u.email.toLowerCase() === email.toLowerCase()
//   );
//   if (exists) {
//     return delay({
//       success: false,
//       error: "An account with that email already exists.",
//     });
//   }
//   const newUser = {
//     id: `u${fakeUsers.length + 1}`,
//     firstName,
//     lastName,
//     email,
//     password,
//   };
//   fakeUsers.push(newUser);
//   const { password: _pw, ...safeUser } = newUser;
//   sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
//   return delay({ success: true, user: safeUser });
// }

// // REPLACE LATER: Shopify `customerAccessTokenDelete` mutation.
// export function logout() {
//   sessionStorage.removeItem(SESSION_KEY);
// }

// // REPLACE LATER: Shopify `customer` query using the stored access token.
// export function getCurrentUser() {
//   const raw = sessionStorage.getItem(SESSION_KEY);
//   return raw ? JSON.parse(raw) : null;
// }
