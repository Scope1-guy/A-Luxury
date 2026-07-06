// In-memory fake user store for the fake authentication system.
// This is intentionally a plain array living in memory (not localStorage),
// so it resets on every page refresh — that's fine for learning purposes.
// authService.js is the only file that should read/write this array.
let fakeUsers = [
  {
    id: "u1",
    firstName: "Samuel",
    lastName: "Scope",
    email: "ghost@scope.com",
    password: "Ayanfe123", // Plain text on purpose — this is fake, local-only auth.
  },
];

export default fakeUsers;
