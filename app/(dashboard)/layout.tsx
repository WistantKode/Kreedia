"use client";

import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useWalletCheck } from "@/hooks/useWalletCheck";
import { isContributor } from "@/lib/utils/user";
import {
  faCircleNotch,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, error, isAuthenticated, signOut } = useAuth();
  const { needsWalletConnection, connectWallet } = useWalletCheck();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    console.log(
      "🔍 Layout useEffect - isAuthenticated:",
      isAuthenticated,
      "isLoading:",
      isLoading,
      "user:",
      user
    );

    if (isLoading) return;

    if (
      !isAuthenticated &&
      !isRedirecting &&
      localStorage.getItem("token") == null
    ) {
      console.log("✅ User localstorage token:", localStorage.getItem("token"));
      console.log("❌ User not authenticated, redirecting to sign-in");
      setIsRedirecting(true);
      router.push("/auth/signin");
    } else if (user && !isContributor(user) && !isRedirecting) {
      // Si l'utilisateur est connecté mais n'est pas un contributeur (ex: NGO)
      console.log("🔄 User is not contributor, redirecting to NGO dashboard");
      setIsRedirecting(true);
      router.push("/ngo/dashboard");
    } else if (isAuthenticated && user) {
      console.log(
        "✅ User is authenticated and is contributor, staying on dashboard"
      );
    }
  }, [isAuthenticated, isLoading, router, isRedirecting, user]);

  // Main loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <img
            src="/logo_green.png"
            alt="Kreedia Logo"
            className="h-16 mx-auto mb-4"
          />
          <div className="flex items-center justify-center space-x-2">
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="h-6 w-6 animate-spin text-green-500"
            />
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="h-6 w-6 animate-spin text-green-500"
            />
            <FontAwesomeIcon
              icon={faSpinner}
              className="h-6 w-6 animate-spin text-green-500"
            />
            <span className="text-gray-300">Loading your session...</span>
          </div>
          {/* Debug information in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-left text-gray-400">
              <p>Loading: {isLoading.toString()}</p>
              <p>User: {user ? "Present" : "None"}</p>
              <p>UserData: {user ? "Present" : "None"}</p>
              <p>Authenticated: {isAuthenticated.toString()}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Wallet connection required
  // if (needsWalletConnection) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
  //       <div className="text-center space-y-6 max-w-md">
  //         <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
  //           <FontAwesomeIcon
  //             icon={faCircleNotch}
  //             className="h-10 w-10 text-white"
  //           />
  //         </div>
  //         <h1 className="text-2xl font-semibold text-gray-100">
  //           Wallet Connection Required
  //         </h1>
  //         <p className="text-gray-400">
  //           Please connect your wallet to continue using the platform.
  //         </p>
  //         <button
  //           onClick={connectWallet}
  //           className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
  //         >
  //           Connect Wallet
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // Error screen
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="h-6 w-6 animate-spin text-green-500"
          />
          <FontAwesomeIcon
            icon={faTimes}
            className="h-16 w-16 text-red-500 mx-auto"
          />
          <h1 className="text-xl font-semibold text-gray-100">
            Authentication Error
          </h1>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={async () => {
              try {
                console.log("Signing out due to authentication error...");
                await signOut();
                // signOut already handles the redirection to /auth/signin
              } catch (err) {
                console.error("Error during sign out:", err);
                // Fallback: direct navigation if signOut fails
                router.push("/auth/signin");
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Sign Out & Return
          </button>
        </div>
      </div>
    );
  }

  // Redirection screen
  if (isRedirecting || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <img
            src="/logo_green.png"
            alt="Kreedia Logo"
            className="h-16 mx-auto mb-4"
          />
          <div className="flex items-center justify-center space-x-2">
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="h-6 w-6 animate-spin text-green-500"
            />
            <FontAwesomeIcon
              icon={faSpinner}
              className="h-6 w-6 animate-spin text-green-500"
            />
            <span className="text-gray-300">Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  // Main layout for authenticated users
  return (
    <div className="min-h-screen bg-background max-w-5xl mx-auto">
      <Header />
      <NavBar />
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>

      {/* User status indicator (debug) */}
      {process.env.NODE_ENV === "development" && user && (
        <div className="fixed bottom-4 left-4 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-80">
          <p>✅ {user.name}</p>
          <p>📧 {user.email}</p>
          <p>🆔 {user.uid?.slice(0, 8)}...</p>
          <p>👤 {user.role}</p>
        </div>
      )}
    </div>
  );
}
