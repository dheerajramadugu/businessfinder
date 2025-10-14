export default function TopBar({ query, setQuery, units, setUnits }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for places…"
        style={{
          height: 44, padding: '0 12px', borderRadius: 12,
          border: '2px solid #3b82f6', outline: 'none', fontSize: 16
        }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setUnits('km')}
          style={{
            flex: 1, padding: '10px 12px',
            borderRadius: 10, border: '1px solid #e5e7eb',
            background: units === 'km' ? '#e0f2fe' : 'white',
            fontWeight: 600
          }}
        >Km</button>
        <button
          onClick={() => setUnits('mi')}
          style={{
            flex: 1, padding: '10px 12px',
            borderRadius: 10, border: '1px solid #e5e7eb',
            background: units === 'mi' ? '#e0f2fe' : 'white',
            fontWeight: 600
          }}
        >Miles</button>
      </div>
    </div>
  );
}
