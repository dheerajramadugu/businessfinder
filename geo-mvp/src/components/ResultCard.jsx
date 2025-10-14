import Stars from './Stars';

export default function ResultCard({ item, units }) {
  return (
    <li style={{
      display: 'flex', gap: 12, alignItems: 'center',
      background: 'white', border: '1px solid #e5e7eb',
      borderRadius: 14, padding: 12
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: '#f3f4f6',
        display: 'grid', placeItems: 'center', fontSize: 18
      }}>🏷️</div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>{item.name}</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          {item.distance} {units} away • {item.category}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          <Stars value={Number(item.rating || 0)} />
        </div>
      </div>
    </li>
  );
}
