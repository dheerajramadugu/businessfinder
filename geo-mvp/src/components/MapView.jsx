import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// default marker fix for Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

export default function MapView({ center, items }) {
  if (!center) return <div style={{ height: 320, borderRadius: 12, background: '#f3f4f6' }} />;
  const { lat, lon } = center;
  return (
    <div style={{ height: 320, marginTop: 12 }}>
      <MapContainer center={[lat, lon]} zoom={12} style={{ height: '100%', borderRadius: 12 }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>You are here</Popup>
        </Marker>
        {items.map((r) => (
          <Marker key={r.id} position={[r.lat, r.lon]}>
            <Popup>
              <b>{r.name}</b><br />
              {r.distance} away
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
