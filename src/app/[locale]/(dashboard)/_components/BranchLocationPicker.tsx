"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const defaultCenter = { lat: 23.588, lng: 58.3829 }; // Oman

export type BranchLocation = {
  address: string;
  latitude: number;
  longitude: number;
};

type BranchLocationPickerProps = {
  value: BranchLocation;
  onChange: (loc: BranchLocation) => void;
  className?: string;
  readOnly?: boolean;
};

export default function BranchLocationPicker({
  value,
  onChange,
  className = "",
  readOnly = false,
}: BranchLocationPickerProps) {
  const t = useTranslations("manageBranches");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const hasValidCoords =
    value.latitude !== 0 &&
    value.longitude !== 0 &&
    !Number.isNaN(value.latitude);
  const markerPosition = useMemo(
    () =>
      hasValidCoords
        ? { lat: value.latitude, lng: value.longitude }
        : defaultCenter,
    [hasValidCoords, value.latitude, value.longitude]
  );

  useEffect(() => {
    if (!isLoaded || !inputRef.current || typeof google === "undefined") return;
    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      fields: ["geometry", "formatted_address"],
    });
    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      const loc = place.geometry?.location;
      if (loc) {
        const lat = Number(typeof loc.lat === "function" ? loc.lat() : loc.lat);
        const lng = Number(typeof loc.lng === "function" ? loc.lng() : loc.lng);
        const address = place.formatted_address ?? place.name ?? "";
        onChangeRef.current({ address, latitude: lat, longitude: lng });
        mapRef.current?.panTo({ lat, lng });
      }
    });
    autocompleteRef.current = ac;
    return () => {
      google.maps.event.clearInstanceListeners(ac);
      autocompleteRef.current = null;
    };
  }, [isLoaded]);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
  }, []);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
    setMap(null);
  }, []);

  const onMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat == null || lng == null) return;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          const address =
            status === "OK" && results?.[0]
              ? results[0].formatted_address ?? ""
              : "";
          onChange({ address, latitude: lat, longitude: lng });
        }
      );
    },
    [onChange]
  );

  if (!apiKey) {
    return (
      <div
        className={`w-full h-[560px] rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 text-sm ${className}`}
      >
        <p className="text-center px-4">{t("mapApiKeyMissing")}</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={`w-full h-[560px] rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 text-sm ${className}`}
      >
        {t("mapLoadError")}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`w-full h-[560px] rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 text-sm ${className}`}
      >
        {t("mapLoading")}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {!readOnly && (
        <input
          ref={inputRef}
          type="text"
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
          placeholder={t("searchPlaceholder")}
          className="form-input"
        />
      )}
      {readOnly && value.address && (
        <p className="text-sm text-slate-600">{value.address}</p>
      )}
      <div className="w-full h-[560px] rounded-lg overflow-hidden border border-slate-200">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={markerPosition}
          zoom={hasValidCoords ? 15 : 10}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          options={{
            fullscreenControl: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
          }}
          onClick={
            readOnly
              ? undefined
              : (e) => {
                  const lat = e.latLng?.lat();
                  const lng = e.latLng?.lng();
                  if (lat != null && lng != null) {
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode(
                      { location: { lat, lng } },
                      (results, status) => {
                        const address =
                          status === "OK" && results?.[0]
                            ? results[0].formatted_address ?? ""
                            : "";
                        onChange({ address, latitude: lat, longitude: lng });
                      }
                    );
                  }
                }
          }
        >
          <Marker
            position={markerPosition}
            draggable={!readOnly}
            onDragEnd={readOnly ? undefined : onMarkerDragEnd}
            title={t("markerTitle")}
          />
        </GoogleMap>
      </div>
    </div>
  );
}
