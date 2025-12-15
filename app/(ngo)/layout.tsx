"use client";

import NgoSidebar from "@/components/NgoSidebar";
import NgoTopbar from "@/components/NgoTopbar";
import { useApiAuth } from "@/hooks/useApiAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NgoLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useApiAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated && localStorage.getItem("token") == null) {
      router.push("/auth/ngo-signin");
    } else if (!loading && user && user.role !== "ngo") {
      // Si l'utilisateur est connecté mais n'est pas une NGO
      router.push("/dashboard");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "ngo") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <NgoSidebar />

        <div className="flex-1 lg:ml-64">
          <NgoTopbar />

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
