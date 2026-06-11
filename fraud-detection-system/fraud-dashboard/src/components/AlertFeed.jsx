function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function timeAgo(timestamp) {
  if (!timestamp) return '';
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function AlertFeed({ alerts }) {
  // Show the 20 most recent alerts
  const recentAlerts = alerts.slice(0, 20);

  return (
    <div className="panel" style={{maxHeight: '600px'}}>
      <div className="panel-header">
        <span className="panel-title">
          ⚡ Live Alert Feed
        </span>
        <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>
          {alerts.length} total
        </span>
      </div>
      <div className="panel-body">
        {recentAlerts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📡</div>
            <div className="empty-state-text">Waiting for alerts...</div>
          </div>
        ) : (
          <div className="feed-list">
            {recentAlerts.map((alert) => (
              <div key={alert.alertId} className="feed-item">
                <div className="feed-item-header">
                  <span className="feed-item-id">{alert.alertId}</span>
                  <span className={`badge badge-${(alert.riskLevel || '').toLowerCase()}`}>
                    {alert.riskLevel}
                  </span>
                </div>
                <div className="feed-item-body">
                  <span className="feed-item-amount">{formatAmount(alert.amount)}</span>
                  <span className="feed-item-reason">{alert.reason}</span>
                  <div className="feed-item-meta">
                    <span>👤 {alert.userId}</span>
                    <span>📍 {alert.location}</span>
                    <span>🕐 {timeAgo(alert.detectedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
