"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeTrial, setAgreeTrial] = useState(true);
  const [error, setError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [trialError, setTrialError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTermsError("");
    setTrialError("");

    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setTermsError("You must agree to the Terms and Privacy Policy.");
      return;
    }
    if (!agreeTrial) {
      setTrialError("You must acknowledge the trial terms.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        // Automatically log in the user using the returned user info
        router.push("/checkout"); // redirect to dashboard or protected page
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="As you are accessing for the first time, please fill in all fields below:"
    >
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          placeholder="Full name"
          value={form.fullName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Terms Checkbox */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              className="mt-1"
            />
            <label htmlFor="agreeTerms" className="text-xs text-gray-500">
              By signing up you agree to the <a href="#" className="underline text-blue-500">Terms and Conditions</a> and <a href="#" className="underline text-blue-500">Privacy Policy</a>.
            </label>
          </div>
          {termsError && <p className="text-xs text-red-500">{termsError}</p>}
        </div>

        {/* Trial Checkbox */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="agreeTrial"
              checked={agreeTrial}
              onChange={() => setAgreeTrial(!agreeTrial)}
              className="mt-1"
            />
            <label htmlFor="agreeTrial" className="text-xs text-gray-500">
              I understand I’ll get a 1-day free trial for only €0.0, then enjoy continued access for just €49 per month unless I cancel.
            </label>
          </div>
          {trialError && <p className="text-xs text-red-500">{trialError}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-teal-400 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Already have an account? <a href="/auth/login" className="text-blue-500 underline">Login</a>
        </p>
      </form>
    </AuthLayout>
  );
}
