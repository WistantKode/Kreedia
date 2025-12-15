"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ContributorSignInPage: React.FC = () => {
  const router = useRouter();
  const { signInWithGoogle, isLoading, error, clearError, isGoogleLoaded } =
    useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      clearError(); // Clear any previous errors

      // Use the hook method which handles popup internally and redirects automatically
      await signInWithGoogle();
    } catch (err: any) {
      console.error("❌ Google Auth error:", err);
      // Error is handled by the hook and displayed via the error state
    } finally {
      setIsGoogleLoading(false);
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
          <h2 className="text-3xl font-bold text-foreground">
            Sign in with Google to start contributing
          </h2>
          {/* <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in with Google to start contributing
          </p> */}
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            {/* Global Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  If popups are blocked, try these solutions:
                </p>
                <ul className="text-xs text-gray-500 mt-1 ml-4 list-disc">
                  <li>Allow popups for this site in your browser settings</li>
                  <li>Disable popup blockers temporarily</li>
                  <li>Try in an incognito/private window</li>
                </ul>
              </div>
            )}

            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading || !isGoogleLoaded}
              className="w-full flex items-center justify-center space-x-3 py-3"
            >
              {isGoogleLoading || isLoading ? (
                <>
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : !isGoogleLoaded ? (
                <>
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Loading Google...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </Button>

            {/* Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing in, you agree to our terms of service
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        {/* <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you an organization?{" "}
            <Link
              href="/auth/ngo-signin"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center justify-center space-x-1"
            >
              <Building2 className="h-4 w-4" />
              <span>NGO Sign In</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default ContributorSignInPage;
