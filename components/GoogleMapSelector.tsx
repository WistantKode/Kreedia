"use client";

import { faMapMarkerAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface GoogleMapSelectorProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
}

const GoogleMapSelector: React.FC<GoogleMapSelectorProps> = ({
  onLocationSelect,
  initialLocation,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Simuler la géolocalisation
  const getCurrentLocation = () => {
    setIsLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const address = `Location: ${latitude.toFixed(
            6
          )}, ${longitude.toFixed(6)}`;

          const location: LocationData = {
            latitude,
            longitude,
            address,
          };

          setSelectedLocation(location);
          onLocationSelect(location);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocation not supported");
      setIsLoading(false);
    }
  };

  // Simuler la sélection d'un point sur la carte
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Simuler des coordonnées basées sur la position du clic
      const latitude = 40.7829 + (y - rect.height / 2) * 0.001;
      const longitude = -73.9654 + (x - rect.width / 2) * 0.001;
      const address = `Selected Location: ${latitude.toFixed(
        6
      )}, ${longitude.toFixed(6)}`;

      const location: LocationData = {
        latitude,
        longitude,
        address,
      };

      setSelectedLocation(location);
      onLocationSelect(location);
    }
  };

  return (
    <div className="space-y-4">
      {/* Contrôles */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faSearch} />
          {isLoading ? "Getting Location..." : "Use Current Location"}
        </button>
      </div>

      {/* Carte placeholder */}
      <div
        ref={mapRef}
        className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg relative cursor-crosshair border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 transition-colors"
        onClick={handleMapClick}
      >
        {selectedLocation ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-4xl text-red-500 mb-2"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Location Selected
              </p>
              <p className="text-xs text-gray-500">Click to change location</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-4xl text-gray-400 mb-2"
              />
              <p className="text-gray-600 dark:text-gray-400">
                Click on the map to select location
              </p>
              <p className="text-sm text-gray-500">
                Or use "Use Current Location" button
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Informations de localisation sélectionnée */}
      {selectedLocation && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200 font-medium">
            Selected Location:
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Latitude: {selectedLocation.latitude.toFixed(6)}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Longitude: {selectedLocation.longitude.toFixed(6)}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Address: {selectedLocation.address}
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleMapSelector;
