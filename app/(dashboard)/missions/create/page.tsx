"use client";

import MissionForm from "@/components/MissionForm";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CreateMissionPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Submit Mission Proposal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Propose an environmental cleanup mission and help make the world
            cleaner. Simply upload photos, select the location on the map, and
            submit your proposal.
          </p>
        </div>

        <MissionForm />
      </div>
    </div>
  );
};

export default CreateMissionPage;
