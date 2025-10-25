// src/components/simple-location-map.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapCoordinates } from '@/types/MapCoordinates';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Fix for default markers
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SimpleLocationMapProps {
  onLocationSelect: (coords: MapCoordinates) => void;
  initialPosition?: MapCoordinates;
  className?: string;
}

const defaultPosition: MapCoordinates = {
  lat: 33.5138,
  lng: 36.2765,
};

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (coords: MapCoordinates) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
}

export function SimpleLocationMap({
  onLocationSelect,
  initialPosition = defaultPosition,
  className = 'h-64 w-full',
}: SimpleLocationMapProps) {
  const [position, setPosition] = useState<MapCoordinates>(initialPosition);
  const [searchAddress, setSearchAddress] = useState('');

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const handleLocationSelect = (coords: MapCoordinates) => {
    setPosition(coords);
    onLocationSelect(coords);
  };

  const handleSearch = async () => {
    if (!searchAddress.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchAddress,
        )}&limit=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition = {
          lat: parseFloat(lat),
          lng: parseFloat(lon),
        };
        setPosition(newPosition);
        onLocationSelect(newPosition);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Search for an address..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <Button onClick={handleSearch} type="button">
            Search
          </Button>
        </div>
      </div>

      <div className="h-64 w-full rounded-lg border mb-4">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[position.lat, position.lng]} />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </div>

      <div className="p-3 bg-muted rounded-lg border">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground block mb-1">Latitude:</span>
            <div className="font-mono text-xs bg-background p-2 rounded border">
              {position.lat.toFixed(6)}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground block mb-1">Longitude:</span>
            <div className="font-mono text-xs bg-background p-2 rounded border">
              {position.lng.toFixed(6)}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Click on the map or search for an address to select the facility location
      </p>
    </div>
  );
}