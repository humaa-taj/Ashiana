"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // Store JWT token
      localStorage.setItem("access_token", data.access_token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles["login-root"]}>
      {/* Decorative circles */}
      <div className={`${Styles["circle"]} ${Styles["circle-top-left"]}`} />
      <div className={`${Styles["circle"]} ${Styles["circle-top-right"]}`} />
      <div className={`${Styles["circle"]} ${Styles["circle-bottom-right"]}`} />
      <div className={`${Styles["circle"]} ${Styles["circle-bottom-left"]}`} />

      {/* Back button */}
      <button
        className={Styles["back-btn"]}
        onClick={() => router.back()}
        aria-label="Go back"
      >
        ←
      </button>

      {/* Leaf illustration */}
      <div className={Styles["leaf-wrap"]} aria-hidden="true">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <ellipse
            cx="40"
            cy="15"
            rx="8"
            ry="15"
            fill="#4CAF50"
            opacity="0.7"
            transform="rotate(45 40 15)"
          />
          <ellipse
            cx="50"
            cy="25"
            rx="8"
            ry="15"
            fill="#66BB6A"
            opacity="0.6"
            transform="rotate(30 50 25)"
          />
          <ellipse
            cx="35"
            cy="30"
            rx="8"
            ry="15"
            fill="#81C784"
            opacity="0.6"
            transform="rotate(60 35 30)"
          />
        </svg>
      </div>

      {/* Login Card */}
      <div className={Styles["card"]}>
        {/* Header */}
        <div className={Styles["card-header"]}>
          <h1 className={Styles["card-title"]}>Welcome Back! 👋</h1>
          <p className={Styles["card-subtitle"]}>Log in to continue</p>
        </div>

        {/* Form */}
        <form className={Styles["card-form"]} onSubmit={handleLogin} noValidate>
          <div className={Styles["field-group"]}>
            <label htmlFor="email" className={Styles["field-label"]}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={Styles["field-input"]}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={Styles["field-group"]}>
            <label htmlFor="password" className={Styles["field-label"]}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={Styles["field-input"]}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className={Styles["error-msg"]}>{error}</p>}

          <button
            type="submit"
            className={Styles["login-btn"]}
            disabled={loading}
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
