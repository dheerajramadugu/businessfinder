export default function ViewToggle({ view, setView }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
      <button
        onClick={() => setView('list')}
        style={{
          flex: 1, padding: '10px 12px', borderRadius: 10,
          border: '1px solid #e5e7eb', background: view==='list' ? '#1d4ed8' : 'white',
          color: view==='list' ? 'white' : '#111827', fontWeight: 700
        }}
      >List View</button>
      <button
        onClick={() => setView('map')}
        style={{
          flex: 1, padding: '10px 12px', borderRadius: 10,
          border: '1px solid #e5e7eb', background: view==='map' ? '#1d4ed8' : 'white',
          color: view==='map' ? 'white' : '#111827', fontWeight: 700
        }}
      >Map View</button>
    </div>
  );
}
