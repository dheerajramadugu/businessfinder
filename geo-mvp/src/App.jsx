import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import TopBar from './components/TopBar';
import RadiusControl from './components/RadiusControl';
import ViewToggle from './components/ViewToggle';
import ResultCard from './components/ResultCard';
import MapView from './components/MapView';

export default function App() {
  // --- location + permission state ---
  const [pos, setPos] = useState(null);                 // { lat, lon }
  const [geoState, setGeoState] = useState('idle');     // 'idle'|'prompt'|'granted'|'denied'|'error'
  const [err, setErr] = useState(null);

  // --- search controls ---
  const [units, setUnits] = useState('km');             // 'km' | 'mi'
  const [radius, setRadius] = useState(5);              // slider value (km by default)
  const [query, setQuery] = useState('');               // search bar text
  const [category, setCategory] = useState('restaurant');
  const [minRating, setMinRating] = useState(0);

  // --- place fallback ---
  const [place, setPlace] = useState('Frisco, TX');     // simple fallback place

  // --- results / view ---
  const [view, setView] = useState('list');             // 'list' | 'map'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // optional: read current permission status (not required)
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((status) => {
          setGeoState(status.state); // 'granted' | 'prompt' | 'denied'
          status.onchange = () => setGeoState(status.state);
        })
        .catch(() => {});
    }
  }, []);

  // Ask for location on a user gesture (button click)
  async function requestLocation() {
    setErr(null);
    if (!('geolocation' in navigator)) {
      setGeoState('error');
      setErr('Geolocation is not supported on this device/browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lon: p.coords.longitude });
        setGeoState('granted');
      },
      (e) => {
        setGeoState(e.code === e.PERMISSION_DENIED ? 'denied' : 'error');
        setErr(e.message || 'Failed to get location.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  }

  // Call Supabase RPC with device location
  async function runSearch() {
    if (!pos) return;
    setLoading(true); setErr(null);
    const { data, error } = await supabase.rpc('businesses_within_radius', {
      in_user_lat: pos.lat,
      in_user_lon: pos.lon,
      in_radius: radius,
      in_units: units,
      in_query: query || null,
      in_category: category || null,
      in_min_rating: minRating,
      in_limit: 50,
      in_offset: 0
    });
    if (error) setErr(error.message);
    setResults(data ?? []);
    setLoading(false);
  console.log('RUN SEARCH center:', pos, 'radius:', radius, 'units:', units);
  
  }

  // Simple demo: resolve a few known place centroids locally (no geocoder yet)
  const PLACE_CENTROIDS = {
    'Frisco, TX':  { lat: 33.1507, lon: -96.8236 },
    'Plano, TX':   { lat: 33.0198, lon: -96.6989 },
    'Dallas, TX':  { lat: 32.7767, lon: -96.7970 }
  };

  // Call Supabase RPC using a place centroid (fallback when GPS denied)
  async function searchByPlace() {
    setErr(null);
    const c = PLACE_CENTROIDS[place];
    if (!c) {
      setErr('Unknown place in demo. Add it to PLACE_CENTROIDS or integrate a geocoder.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.rpc('businesses_within_radius', {
      in_user_lat: c.lat,
      in_user_lon: c.lon,
      in_radius: radius,
      in_units: units,
      in_query: query || null,
      in_category: category || null,
      in_min_rating: minRating,
      in_limit: 50,
      in_offset: 0
    });
    if (error) setErr(error.message);
    setResults(data ?? []);
    setLoading(false);
    // also set map center to this place so MapView renders nicely
    setPos({ lat: c.lat, lon: c.lon });
  }

  return (
    <div style={{
      maxWidth: 420, margin: '24px auto', padding: 16,
      background: '#f8fafc', borderRadius: 20, fontFamily: 'system-ui'
    }}>
      {/* Top search bar + unit toggle */}
      <TopBar query={query} setQuery={setQuery} units={units} setUnits={setUnits} />

      {/* Distance slider */}
      <RadiusControl units={units} radius={radius} setRadius={setRadius} min={1} max={units==='km' ? 100 : 60} />

      {/* Category + rating + action buttons */}
      <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: 1 }}>
            <option value="">All</option>
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Cafe</option>
          </select>

          <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} style={{ width: 140 }}>
            <option value={0}>Any rating</option>
            <option value={3}>3★+</option>
            <option value={4}>4★+</option>
            <option value={4.5}>4.5★+</option>
          </select>
        </div>

        {/* Location permission + actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={requestLocation} style={btnSecondary}>
            {geoState === 'granted' ? 'Location Ready ✅' : 'Use My Location'}
          </button>

          <button onClick={runSearch} disabled={!pos || loading} style={btnPrimary}>
            {loading ? 'Searching…' : 'Search near me'}
          </button>

          {/* Place fallback */}
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="City, State (e.g., Frisco, TX)"
            style={{ flex: 1, minWidth: 160, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb' }}
          />
          <button onClick={searchByPlace} disabled={loading} style={btnSecondary}>
            {loading ? 'Searching…' : 'Search by place'}
          </button>
        </div>
      </div>

      {/* Helpful banner when denied */}
      {geoState === 'denied' && (
        <div style={{
          color:'#b45309', background:'#fff7ed', border:'1px solid #fed7aa',
          padding:8, borderRadius:8, marginTop:10, fontSize: 14
        }}>
          Location is blocked. You can search by place above,
          or enable location in your browser settings and try again.
        </div>
      )}

      {/* Errors */}
      {err && <div style={{ color:'crimson', marginTop:8 }}>{err}</div>}

      {/* Toggle + results */}
      <ViewToggle view={view} setView={setView} />

      {view === 'list' ? (
        <>
          <div style={{ marginTop: 12, fontWeight: 700 }}>List View</div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10, marginTop: 8 }}>
            {results.map((r) => (
              <ResultCard key={r.id} item={r} units={units} />
            ))}
          </ul>
          {!loading && results.length === 0 && <div style={{ color: '#6b7280' }}>No results.</div>}
        </>
      ) : (
        <MapView center={pos} items={results} />
      )}
    </div>
  );
}

/* little style helpers */
const btnPrimary = {
  padding: '10px 12px', borderRadius: 10, border: 'none',
  background: '#2563eb', color: 'white', fontWeight: 700
};
const btnSecondary = {
  padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb',
  background: 'white', fontWeight: 600
};
