import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import AdminCard from "../components/ui/AdminCard";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (auth.isLoading) {
    return null;
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await auth.signIn(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-start justify-start overflow-hidden bg-white px-6 pt-8 md:px-12 md:pt-12">
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-[url('/images/bb-sketch.png')]
          bg-contain
          bg-bottom-right
          bg-no-repeat
          opacity-10
        "
      />

      <div className="relative z-10 w-full max-w-md">
        <AdminCard className="bg-white/95 shadow-[0_22px_60px_-14px_rgba(43,84,126,0.7)]">
          <p className="admin-eyebrow">Team Bayou</p>

          <h1 className="mt-2 text-3xl">Welcome back.</h1>

          <p className="mt-2 text-sm text-muted">
            Sign in to manage Bayou Boy Exotics.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="admin-field">
              <label htmlFor="email" className="admin-label">
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="admin-input"
                placeholder="you@bayouboy.com"
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="password" className="admin-label">
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="admin-input"
                required
              />
            </div>

            {error && <p className="admin-error-text">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
