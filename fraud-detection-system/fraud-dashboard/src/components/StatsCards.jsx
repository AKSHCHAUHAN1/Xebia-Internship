export function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Alerts', value: stats.totalAlerts || 0, icon: '🚨', className: 'total' },
    { label: 'High Risk', value: stats.highRisk || 0, icon: '🔴', className: 'high' },
    { label: 'Medium Risk', value: stats.mediumRisk || 0, icon: '🟡', className: 'medium' },
    { label: 'Low Risk', value: stats.lowRisk || 0, icon: '🟢', className: 'low' },
    { label: 'Pending', value: stats.pending || 0, icon: '⏳', className: 'pending' },
    { label: 'Reviewed', value: stats.reviewed || 0, icon: '👁️', className: 'reviewed' },
    { label: 'Resolved', value: stats.resolved || 0, icon: '✅', className: 'resolved' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card ${card.className}`}>
          <span className="stat-icon">{card.icon}</span>
          <div className="stat-label">{card.label}</div>
          <div className="stat-value">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
