const SHOPIFY_STORE = process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const ENDPOINT = `https://${SHOPIFY_STORE}/api/2025-07/graphql.json`;

export async function shopifyFetch(query, variables = {}) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}
