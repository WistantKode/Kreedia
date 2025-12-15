"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useApiAuth } from "@/hooks/useApiAuth";
import {
  faArrowRight,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const NgoSignInPage: React.FC = () => {
  const router = useRouter();
  const { signInAsNgo, loading } = useApiAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await signInAsNgo(formData.email, formData.password);
      router.push("/ngo/dashboard");
    } catch (err: any) {
      console.error("❌ NGO login error:", err);

      if (err.errors) {
        setValidationErrors(err.errors);
      } else {
        setError(err.message || "Error during login");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear global error
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/icon.png" alt="Kreedia Logo" className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">NGO Login</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your organization account
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Global Error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@your-ngo.org"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      validationErrors.email
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    disabled={loading}
                  />
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      validationErrors.password
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    disabled={loading}
                  />
                  <FontAwesomeIcon
                    icon={faLock}
                    className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEyeSlash} className="h-5 w-5" />
                    ) : (
                      <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you a contributor?{" "}
            <Link
              href="/auth/signin"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center justify-center space-x-1"
            >
              <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
              <span>Contributor Login</span>
              <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NgoSignInPage;
