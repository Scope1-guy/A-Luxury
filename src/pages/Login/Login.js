import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const { login } = useAuth();

  return (
    <div className="container section auth-page">
      <div className="auth-card">
        <span className="eyebrow">Welcome back</span>
        <h1>Login</h1>

        <p className="form-note">
          You'll be securely signed in through Shopify. Don't have an account
          yet? You can create one on the next screen too.
        </p>

        <button className="btn btn-primary btn-block" onClick={login}>
          Continue with Shopify
        </button>
      </div>
    </div>
  );
}

export default Login;

// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import "./Login.css";

// function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   // ProtectedRoute stashes the page the user was trying to reach in
//   // location.state.from — send them back there after a successful login.
//   const redirectTo = location.state?.from?.pathname || "/profile";

//   // const from = location.state?.from?.pathname || "/";
//   // navigate(from, { replace: true });

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");
//     const result = await login(email, password);
//     setSubmitting(false);
//     if (result.success) {
//       navigate(redirectTo, { replace: true });
//     } else {
//       setError(result.error);
//     }
//   }

//   return (
//     <div className="container section auth-page">
//       <div className="auth-card">
//         <span className="eyebrow">Welcome back</span>
//         <h1>Login</h1>

//         <form onSubmit={handleSubmit} noValidate>
//           <div className="field">
//             <label htmlFor="login-email">Email</label>
//             <input
//               id="login-email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="field">
//             <label htmlFor="login-password">Password</label>
//             <input
//               id="login-password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {error && <p className="field-error">{error}</p>}

//           <button
//             type="submit"
//             className="btn btn-primary btn-block"
//             disabled={submitting}
//           >
//             {submitting ? "Logging in…" : "Login"}
//           </button>
//         </form>

//         <p className="form-note">
//           Don't have an account? <Link to="/register">Register</Link>
//         </p>
//         {/* <p className="form-note">Demo login: alex@example.com / password123</p> */}
//       </div>
//     </div>
//   );
// }

// export default Login;
