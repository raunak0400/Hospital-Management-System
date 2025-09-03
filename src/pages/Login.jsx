import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../utils/auth";
import toast from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  //Validation
  const validate = () => {
    const tempErrors = {};
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

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  //  Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // Single login handler
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (!validate()) {
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const result = await login(formData);

  //     if (result.success) {
  //       toast.success("Login successful!");

  //       const role = result.user?.role; // role from backend
  //       if (role === "admin") navigate("/AdminDashboard");
  //       else if (role === "doctor") navigate("/doctor-dashboard");
  //       else if (role === "nurse") navigate("/nurse-dashboard");
  //       else if (role === "patient") navigate("/patient-dashboard");
  //       else if (role === "receptionist") navigate("/receptionist-dashboard");
  //       else navigate("/"); // fallback
  //     } else {
  //       toast.error(result.error || "Login failed");
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     toast.error("Something went wrong. Please try again.");
  //   }

  //   setLoading(false);
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (!validate()) {
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const result = await login(formData); // 🔥 using your useAuth()

  //     if (result.success) {
  //       toast.success("Sign In successful!");
  //       // check user role from backend response
  //       // const role = result.user?.role;
  //       // console.log("User role from backend:", role);
  //       const role = result.user?.role || formData.role;
  //       console.log("User role:", role);
  //       if (role === "admin") navigate("/dashboard");
  //       else if (role === "doctor") navigate("/dashboard");
  //       else if (role === "nurse") navigate("/dashboard");
  //       else if (role === "patient") navigate("/dashboard");
  //       else if (role === "receptionist") navigate("/dashboard");
  //       else navigate("/dashboard"); // fallback
  //     } else {
  //       toast.error(result.error || "Login failed");
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     toast.error("Something went wrong. Please try again.");
  //   }

  //   setLoading(false);

  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!validate()) {
    setLoading(false);
    return;
  }

  try {
    const result = await login(formData);

    if (result.success) {
      toast.success("Sign In successful!");
      
      const role = result.user?.role; // ✅ ONLY from backend
      console.log("User role from backend:", role);

      if (role === "admin") navigate("/admin");
      else if (role === "doctor") navigate("/doctor");
      else if (role === "nurse") navigate("/patient");
      else if (role === "patient") navigate("/nurse");
      else if (role === "receptionist") navigate("/receptionist");
      else navigate("/"); // fallback
    } else {
      toast.error(result.error || "signin failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    toast.error("Something went wrong. Please try again.");
  }

  setLoading(false);
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-700 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Role Dropdown */}


          {/* Email Input */}
          <div className="relative mb-8">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900
                focus:outline-none focus:ring-2 focus:ring-indigo-600
                ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
              placeholder={formData.email ? "" : "Email address"}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative mb-6">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900
                focus:outline-none focus:ring-2 focus:ring-indigo-600
                ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
              placeholder={formData.password ? "" : "Password"}
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600 font-medium">
                {errors.password}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-4 text-indigo-600 hover:text-indigo-800 focus:outline-none select-none font-semibold"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl shadow-lg transition-colors"
            aria-busy={loading}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
