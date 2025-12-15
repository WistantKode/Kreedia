"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useMissionActions, useMissionById } from "@/hooks/useApiMissions";
import { AlertCircle, Award, CheckCircle, DollarSign, X } from "lucide-react";
import React, { useState } from "react";

interface AcceptMissionModalProps {
  missionId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AcceptMissionModal: React.FC<AcceptMissionModalProps> = ({
  missionId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { mission, loading: missionLoading } = useMissionById(missionId);
  const {
    acceptMission,
    rewardMission,
    loading: actionLoading,
  } = useMissionActions();

  const [formData, setFormData] = useState({
    reward_amount: "",
    reward_currency: "USDT",
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  if (!isOpen) return null;

  const isCompleted = mission?.status === "completed";
  const isPending = mission?.status === "pending";

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (isPending) {
      if (!formData.reward_amount) {
        errors.reward_amount = "Le montant de la récompense est requis";
      } else if (
        isNaN(Number(formData.reward_amount)) ||
        Number(formData.reward_amount) <= 0
      ) {
        errors.reward_amount = "Le montant doit être un nombre positif";
      }

      if (!formData.reward_currency) {
        errors.reward_currency = "La devise est requise";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isPending && !validateForm()) {
      return;
    }

    try {
      let result;

      if (isPending) {
        // Accepter la mission avec récompense
        result = await acceptMission(missionId, {
          reward_amount: Number(formData.reward_amount),
          reward_currency: formData.reward_currency,
        });
      } else if (isCompleted) {
        // Récompenser la mission terminée
        result = await rewardMission(missionId);
      }

      if (result) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error processing mission:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getModalTitle = () => {
    if (isPending) return "Accepter la Mission";
    if (isCompleted) return "Récompenser la Mission";
    return "Action sur la Mission";
  };

  const getModalIcon = () => {
    if (isPending) return <CheckCircle className="h-6 w-6 text-blue-600" />;
    if (isCompleted) return <Award className="h-6 w-6 text-purple-600" />;
    return <AlertCircle className="h-6 w-6 text-gray-600" />;
  };

  const getSubmitButtonText = () => {
    if (isPending)
      return actionLoading
        ? "Acceptation..."
        : "Accepter et Définir la Récompense";
    if (isCompleted)
      return actionLoading ? "Récompense..." : "Confirmer la Récompense";
    return "Confirmer";
  };

  const getSubmitButtonColor = () => {
    if (isPending) return "";
    if (isCompleted) return "bg-purple-600 hover:bg-purple-700";
    return "";
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                {getModalIcon()}
                <h2 className="text-xl font-bold text-foreground">
                  {getModalTitle()}
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {missionLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Chargement...</p>
                </div>
              ) : mission ? (
                <div className="space-y-6">
                  {/* Mission Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {mission.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {mission.address}
                    </p>
                    <Badge className="text-xs">
                      Durée: {mission.duration}h
                    </Badge>
                  </div>

                  {/* Current Reward (if exists) */}
                  {mission.reward_amount && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-700 dark:text-green-300">
                          Récompense actuelle: {mission.reward_amount}{" "}
                          {mission.reward_currency}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isPending && (
                      <>
                        {/* Reward Amount */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Montant de la récompense *
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              name="reward_amount"
                              value={formData.reward_amount}
                              onChange={handleInputChange}
                              placeholder="50"
                              min="0"
                              step="0.01"
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                validationErrors.reward_amount
                                  ? "border-red-300 dark:border-red-600"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                              disabled={actionLoading}
                            />
                            <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                          </div>
                          {validationErrors.reward_amount && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {validationErrors.reward_amount}
                            </p>
                          )}
                        </div>

                        {/* Currency */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Devise *
                          </label>
                          <select
                            name="reward_currency"
                            value={formData.reward_currency}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              validationErrors.reward_currency
                                ? "border-red-300 dark:border-red-600"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                            disabled={actionLoading}
                          >
                            <option value="USDT">USDT</option>
                            <option value="ETH">ETH</option>
                            <option value="BTC">BTC</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                          </select>
                          {validationErrors.reward_currency && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {validationErrors.reward_currency}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {isCompleted && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                              Confirmer la récompense
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              Cette action enverra la récompense de{" "}
                              {mission.reward_amount} {mission.reward_currency}{" "}
                              au contributeur et marquera la mission comme
                              terminée.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={actionLoading}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={actionLoading}
                        className={`flex-1 ${getSubmitButtonColor()}`}
                      >
                        {actionLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Traitement...</span>
                          </div>
                        ) : (
                          getSubmitButtonText()
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-600 dark:text-red-400">
                    Erreur lors du chargement de la mission
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AcceptMissionModal;
