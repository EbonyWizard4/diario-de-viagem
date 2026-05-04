// src/components/MapView.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import 'leaflet-routing-machine';

// --- SUB-COMPONENTE PARA A LINHA AZUL ---
function RoutingMachine({ userLoc, targetLoc }: { userLoc: any, targetLoc: any }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !userLoc || !targetLoc) return;

    const routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(userLoc.lat, userLoc.lng),
        L.latLng(targetLoc.lat, targetLoc.lng)
      ],
      lineOptions: {
        styles: [{ color: '#f97316', weight: 6, opacity: 0.8 }]
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);

    // A MUDANÇA ESTÁ AQUI:
    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLoc, targetLoc]);
  return null;
}

// Centralizador automático: faz o mapa "voar" para a posição do usuário quando detectada
function ChangeView({ center }: { center: L.LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

// Ícone personalizado para os Pontos Turísticos (PARADAS)
const localIcon = new L.Icon({
  // Pin Laranja (Substituindo o vermelho anterior)
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  
  // O link acima usa o estilo padrão do Leaflet, mas em laranja.
  // Se quiser um estilo mais moderno (bolinha), pode usar este:
  // iconUrl: 'https://cdn-icons-png.flaticon.com/512/9131/9131546.png', 

  iconSize: [25, 41], // Tamanho padrão do Leaflet para esse ícone
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Ícone para o Usuário (Mantemos azul para diferenciar bem)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapViewProps {
  rotas: any[];
  userLocation: { lat: number; lng: number } | null;
}


export default function MapView({ rotas, userLocation }: MapViewProps) {
  const [selectedStop, setSelectedStop] = useState<any | null>(null);
  const defaultCenter: L.LatLngExpression = [-23.5505, -46.6333];
  const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  // Função para abrir GPS externo (Deep Link)
  const handleOpenExternalGPS = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full h-[500px] rounded-[32px] overflow-hidden shadow-inner border-4 border-white">
      <MapContainer
        center={center as L.LatLngExpression}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 👤 USUÁRIO */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup className="font-bold">Você está aqui!</Popup>
          </Marker>
        )}

        {/* 🛣️ ROTA (LINHA AZUL) - Só aparece se houver destino e GPS do user */}
        {userLocation && selectedStop && (
          <RoutingMachine userLoc={userLocation} targetLoc={selectedStop} />
        )}

        {/* 📍 PINS DAS VISITAS */}
        {rotas.map((rota) =>
          rota.stopsData?.map((stop: any) => {
            if (typeof stop?.lat !== 'number' || typeof stop?.lng !== 'number') return null;

            return (
              <Marker
                key={stop.id}
                position={[stop.lat, stop.lng]}
                icon={localIcon}
                eventHandlers={{
                  click: () => setSelectedStop(stop) // Define o destino ao clicar no pin
                }}
              >
                <Popup>
                  <div className="text-center p-2 min-w-[120px]">
                    <h3 className="font-black uppercase text-xs text-gray-900 leading-tight mb-2">{stop.name}</h3>

                    <button
                      onClick={() => handleOpenExternalGPS(stop.lat, stop.lng)}
                      className="w-full bg-orange-600 text-white text-[10px] font-black py-2 rounded-xl uppercase tracking-tighter active:scale-95 transition-all flex items-center justify-center gap-1"
                    >
                      🚀 Iniciar GPS
                    </button>

                    <button
                      onClick={() => setSelectedStop(null)}
                      className="mt-2 text-[9px] text-gray-400 font-bold uppercase underline"
                    >
                      Limpar Rota
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })
        )}
      </MapContainer>
    </div>
  );
}