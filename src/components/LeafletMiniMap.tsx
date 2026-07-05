import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons (Leaflet's default assets reference broken URLs
// when bundled). Use inline data URIs from unpkg CDN.
const pickupIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Coord = { lat: number; lon: number };

function FitBounds({ a, b }: { a: Coord; b: Coord }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([
      [a.lat, a.lon],
      [b.lat, b.lon],
    ]);
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [a, b, map]);
  return null;
}

export default function LeafletMiniMap({
  pickup,
  destination,
}: {
  pickup: Coord;
  destination: Coord;
}) {
  const center = useMemo<[number, number]>(
    () => [(pickup.lat + destination.lat) / 2, (pickup.lon + destination.lon) / 2],
    [pickup, destination],
  );
  return (
    <MapContainer
      center={center}
      zoom={9}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[pickup.lat, pickup.lon]} icon={pickupIcon} />
      <Marker position={[destination.lat, destination.lon]} icon={pickupIcon} />
      <Polyline
        positions={[
          [pickup.lat, pickup.lon],
          [destination.lat, destination.lon],
        ]}
        pathOptions={{ color: "#d4a24c", weight: 3, dashArray: "6 6" }}
      />
      <FitBounds a={pickup} b={destination} />
    </MapContainer>
  );
}