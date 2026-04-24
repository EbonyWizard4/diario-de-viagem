// src/components/MapView.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Centralizador automático: faz o mapa "voar" para a posição do usuário quando detectada
function ChangeView({ center }: { center: L.LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

// Ícone personalizado para os Pontos Turísticos
const localIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Ícone para o Usuário (Bolinha azul de GPS)
const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3513/3513412.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

interface MapViewProps {
  rotas: any[];
  userLocation: { lat: number; lng: number } | null;
}

export default function MapView({ rotas, userLocation }: MapViewProps) {
  // Centro inicial (São Paulo) caso não tenha GPS ainda
  const defaultCenter: L.LatLngExpression = [-23.5505, -46.6333];
  const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-inner border border-gray-200">
      <MapContainer 
        center={center as L.LatLngExpression} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center as L.LatLngExpression} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* 👤 LOCALIZAÇÃO DO USUÁRIO */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup className="font-bold">Você está aqui!</Popup>
          </Marker>
        )}

        {/* 📍 LOCALIZAÇÃO DOS LOCAIS DE VISITA */}
        {rotas.map((rota) => {
          // Aqui iteramos sobre as paradas (stops) de cada rota filtrada
          return rota.stopsData?.map((stop: any) => (
            <Marker 
              key={stop.id} 
              position={[stop.lat, stop.lng]} 
              icon={localIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-black uppercase text-[10px] text-orange-600 tracking-tighter">Local de Visita</p>
                  <h3 className="font-bold">{stop.name}</h3>
                  <p className="text-[10px] text-gray-500">Parte da rota: {rota.title}</p>
                </div>
              </Popup>
            </Marker>
          ));
        })}
      </MapContainer>
    </div>
  );
}