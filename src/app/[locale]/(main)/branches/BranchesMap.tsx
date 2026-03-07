"use client";

import { useMemo, useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

export type BranchForMap = {
  id: string;
  nameEn: string;
  address: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
};

const defaultCenter = { lat: 23.5880, lng: 58.3829 }; // Oman default

type BranchesMapProps = {
  branches: BranchForMap[];
};

export default function BranchesMap({ branches }: BranchesMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const center = useMemo(() => {
    if (branches.length === 0) return defaultCenter;
    const sum = branches.reduce(
      (acc, b) => ({ lat: acc.lat + b.latitude, lng: acc.lng + b.longitude }),
      { lat: 0, lng: 0 }
    );
    return {
      lat: sum.lat / branches.length,
      lng: sum.lng / branches.length,
    };
  }, [branches]);

  if (!apiKey) {
    return (
      <div className="w-full h-[480px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
        <p className="text-center px-4">
          Add <code className="bg-slate-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your environment to show the map.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-[480px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
        <p>Failed to load the map. Check your API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[480px] rounded-xl bg-slate-100 flex items-center justify-center">
        <span className="text-slate-600">Loading map…</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[480px] rounded-xl overflow-hidden border border-slate-200">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={branches.length === 1 ? 14 : 10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{ fullscreenControl: true, zoomControl: true }}
      >
        {branches.map((branch) => (
          <Marker
            key={branch.id}
            position={{ lat: branch.latitude, lng: branch.longitude }}
            title={branch.nameEn}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
