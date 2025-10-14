export default function RadiusControl({ units='km', radius, setRadius, min=1, max=100 }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 14, color: '#374151', marginBottom: 6 }}>Distance Radius</div>
      <input
        type="range"
        min={min}
        max={max}
        value={radius}
        onChange={(e) => setRadius(parseInt(e.target.value))}
        style={{ width: '100%' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' }}>
        <span>{min} {units}</span>
        <b>{radius} {units}</b>
        <span>{max} {units}</span>
      </div>
    </div>
  );
}
