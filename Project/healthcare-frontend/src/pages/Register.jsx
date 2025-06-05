import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Don't forget to import Link if you have it in your JSX

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // Always parse response as JSON, even for errors

      if (!res.ok) {
        // Check for specific error message from the backend
        if (data.msg === "Email already exists") { // This checks the 'msg' from Flask
          alert("You already have an account. Please sign in.");
          navigate("/login"); // Redirect to login page
        } else {
          // Display other backend errors
          setGeneralError(data.msg || "Registration failed. Please try again.");
        }
      } else {
        alert("Registration successful!");
        // Optionally store token if returned (your backend currently doesn't return one for register)
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
        }
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setGeneralError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-500 to-blue-600 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Create Account
        </h2>

        {generalError && (
          <p className="text-center text-red-600 mb-6 font-semibold">
            {generalError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="mb-5">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="Full Name"
              className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-green-500
              ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="Email Address"
              className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-green-500
              ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-5 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Password"
              className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-green-500
              ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-3 text-green-600 hover:text-green-800 focus:outline-none font-semibold"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              placeholder="Confirm Password"
              className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-green-500
              ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 rounded-xl shadow-lg transition-colors"
            aria-busy={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        {/* Link to login page */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          {/* Ensure you import Link from 'react-router-dom' */}
          <a onClick={() => navigate("/login")} className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}