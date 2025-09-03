import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../utils/auth";
import toast from "react-hot-toast";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register, setUser } = useAuth();

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
    if (!formData.role) tempErrors.role = "Please select a role";


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      });


      //       if (result.success) {
      //   toast.success("Registration successful!");

      //   // Redirect based on role
      //   if (formData.role === "admin") {
      //     navigate("/admin-dashboard");
      //   } else if (formData.role === "staff") {
      //     navigate("/staff-dashboard");
      //   } else {
      //     navigate("/dashboard"); // fallback
      //   }
      // }

      if (result.success) {
        toast.success("Registration successful! Please log in.");
        navigate("/login");

        // Save logged-in user in context
        setUser(result.user);  // ✅ now it's defined

        const role = result.user?.role?.toLowerCase();
        console.log("User role:", role);

        if (role === "admin") navigate("/admin");
        else if (role === "doctor") navigate("/doctor");
        else if (role === "nurse") navigate("/nurse");
        else if (role === "patient") navigate("/patient");
        else if (role === "receptionist") navigate("/receptionist");
        else navigate("/dashboard"); // fallback
      }
      //  else {
      //   toast.error(result.error || "Login failed");
      // }
    }
    catch (err) {
      console.error("Registration error:", err);
      if (err.response?.status === 409) {
        toast.error("Email already registered, please login instead.");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
      }
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

        <form onSubmit={handleSubmit} noValidate>

          <div className="relative mb-6">
            <select
              id="role"
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
              disabled={loading}
              className="w-full border-2 rounded-xl px-4 py-3 text-gray-900
      focus:outline-none focus:ring-2 focus:ring-indigo-600
      border-gray-300"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="patient">Patient</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>


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
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Link to login page */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}