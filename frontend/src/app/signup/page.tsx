"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "./signup.module.css";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    role: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.role) {
      setError("Please select a role.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            contact: form.contact,
            role: form.role,
            password: form.password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed. Please try again.");
        return;
      }

      // Redirect to login after successful signup
      router.push("/login");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles["signup-root"]}>
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
          <ellipse
            cx="45"
            cy="40"
            rx="8"
            ry="15"
            fill="#A5D6A7"
            opacity="0.5"
            transform="rotate(15 45 40)"
          />
        </svg>
      </div>

      {/* Signup Card */}
      <div className={Styles["card"]}>
        {/* Header */}
        <div className={Styles["card-header"]}>
          <h1 className={Styles["card-title"]}>Sign Up ✨</h1>
          <p className={Styles["card-subtitle"]}>
            Create an account, it&apos;s free
          </p>
        </div>

        {/* Form */}
        <form
          className={Styles["card-form"]}
          onSubmit={handleSignup}
          noValidate
        >
          {/* Full Name */}
          <div className={Styles["field-group"]}>
            <label htmlFor="name" className={Styles["field-label"]}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={Styles["field-input"]}
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className={Styles["field-group"]}>
            <label htmlFor="email" className={Styles["field-label"]}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={Styles["field-input"]}
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          {/* Contact */}
          <div className={Styles["field-group"]}>
            <label htmlFor="contact" className={Styles["field-label"]}>
              Contact No
            </label>
            <input
              id="contact"
              name="contact"
              type="tel"
              className={Styles["field-input"]}
              placeholder="0xxxxxxxxxx"
              value={form.contact}
              onChange={handleChange}
              required
              autoComplete="tel"
            />
          </div>

          {/* Role + Password row */}
          <div className={Styles["row"]}>
            <div className={`${Styles["field-group"]} ${Styles["flex-1"]}`}>
              <label htmlFor="role" className={Styles["field-label"]}>
                Role
              </label>
              <select
                id="role"
                name="role"
                className={`${Styles["field-input"]} ${Styles["field-select"]}`}
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="Buyer/Renter">Buyer/Renter</option>
                <option value="Owner">Owner</option>
              </select>
            </div>

            <div className={`${Styles["field-group"]} ${Styles["flex-1"]}`}>
              <label htmlFor="password" className={Styles["field-label"]}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={Styles["field-input"]}
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && <p className={Styles["error-msg"]}>{error}</p>}

          {/* Sign Up button */}
          <button
            type="submit"
            className={Styles["signup-btn"]}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>

          {/* Login link */}
          <div className={Styles["login-link-row"]}>
            <span className={Styles["login-link-text"]}>
              Already have an account?
            </span>
            <button
              type="button"
              className={Styles["login-link-btn"]}
              onClick={() => router.push("/login")}
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
