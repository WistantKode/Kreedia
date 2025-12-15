"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useApiAuth } from "@/hooks/useApiAuth";
import { UserService } from "@/lib/api/services/user";
import { formatDate } from "@/lib/utils";
import {
  faEdit,
  faEnvelope,
  faPhone,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const ProfilePage: React.FC = () => {
  const { user, signOut, setUser } = useApiAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    gender: (user?.gender as "male" | "female" | "other") || "male",
  });

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      console.log("Initiating sign out from profile page...");
      await signOut();
      console.log("Sign out completed");
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  const handleEdit = () => {
    setEditData({
      name: user?.name || "",
      phone: user?.phone || "",
      gender: (user?.gender as "male" | "female" | "other") || "male",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || "",
      phone: user?.phone || "",
      gender: (user?.gender as "male" | "female" | "other") || "male",
    });
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const updatedUser = await UserService.updateProfile(editData);
      setUser(updatedUser);
      setIsEditing(false);
      console.log("✅ Profile updated successfully");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <FontAwesomeIcon icon={faEdit} className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100 py-2">
                  {user.name || "Not provided"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="h-4 w-4 text-gray-400"
                />
                <p className="text-gray-900 dark:text-gray-100 py-2">
                  {user.email}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="h-4 w-4 text-gray-400"
                  />
                  <p className="text-gray-900 dark:text-gray-100 py-2">
                    {user.phone || "Not provided"}
                  </p>
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              {isEditing ? (
                <select
                  value={editData.gender}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      gender: e.target.value as "male" | "female" | "other",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-900 dark:text-gray-100 py-2">
                  {user.gender
                    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                    : "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  User ID:
                </span>
                <span className="ml-2 font-mono text-gray-900 dark:text-gray-100">
                  {user.uid.slice(0, 8)}...
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                <Badge className="ml-2 bg-primary-500 text-white">
                  {user.role}
                </Badge>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Member since:
                </span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {formatDate(new Date(user.created_at))}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Last updated:
                </span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {formatDate(new Date(user.updated_at))}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Address */}
          {user.wallet_address && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Wallet Address
              </h4>
              <p className="text-sm font-mono text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {user.wallet_address}
              </p>
            </div>
          )}

          {/* Sign Out Button */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full"
            >
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
