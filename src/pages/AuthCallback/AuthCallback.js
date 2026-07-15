import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AuthCallback() {
  const { completeLogin } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    completeLogin(searchParams)
      .then(() => {
        navigate("/profile", { replace: true });
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Something went wrong signing you in.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container section">
      {error ? (
        <div>
          <p>{error}</p>
          <p>
            <Link to="/login">Try again</Link>
          </p>
        </div>
      ) : (
        <p>Signing you in…</p>
      )}
    </div>
  );
}

export default AuthCallback;
