// Auth service.
//
// AuthContext calls the four functions below and never touches
// `data/fakeUsers.js` directly. That means that later, replacing fake
// auth with Shopify Customer Authentication is a matter of rewriting
// the INSIDE of these four functions — login, register, logout,
// getCurrentUser — while AuthContext and every component that uses it
// stay untouched.
//
// Each fake function below is commented with the Shopify Customer API
// call that should eventually replace it.

import fakeUsers from "../data/fakeUsers";

const SESSION_KEY = "fold_fake_session"; // sessionStorage key, cleared on logout
const FAKE_DELAY_MS = 250;

function delay(value) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value), FAKE_DELAY_MS)
  );
}

// REPLACE LATER: Shopify `customerAccessTokenCreate` mutation.
export async function login(email, password) {
  const user = fakeUsers.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    return delay({ success: false, error: "Incorrect email or password." });
  }
  const { password: _pw, ...safeUser } = user;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  return delay({ success: true, user: safeUser });
}

// REPLACE LATER: Shopify `customerCreate` mutation.
export async function register({ firstName, lastName, email, password }) {
  const exists = fakeUsers.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return delay({
      success: false,
      error: "An account with that email already exists.",
    });
  }
  const newUser = {
    id: `u${fakeUsers.length + 1}`,
    firstName,
    lastName,
    email,
    password,
  };
  fakeUsers.push(newUser);
  const { password: _pw, ...safeUser } = newUser;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  return delay({ success: true, user: safeUser });
}

// REPLACE LATER: Shopify `customerAccessTokenDelete` mutation.
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

// REPLACE LATER: Shopify `customer` query using the stored access token.
export function getCurrentUser() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}
