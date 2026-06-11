import { api } from '../services/api';

function getRiskBadgeClass(level) {
  return `badge badge-${(level || '').toLowerCase()}`;
}

function getStatusBadgeClass(status) {
  return `badge badge-${(status || '').toLowerCase()}`;
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTime(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return date.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function AlertTable({ alerts, onStatusUpdate, filter, onFilterChange }) {
  const filteredAlerts = filter === 'ALL'
    ? alerts
    : alerts.filter(a => a.riskLevel === filter);

  async function handleStatusUpdate(alertId, newStatus) {
    try {
      await api.updateAlertStatus(alertId, newStatus);
      onStatusUpdate();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">📋 Fraud Alerts ({filteredAlerts.length})</span>
        <div className="filter-bar">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => onFilterChange(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="panel-body">
        {filteredAlerts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛡️</div>
            <div className="empty-state-text">No alerts found</div>
          </div>
        ) : (
          <table className="alert-table">
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.alertId}>
                  <td style={{fontWeight: 600, color: '#6366f1', fontSize: '12px'}}>{alert.alertId}</td>
                  <td>{alert.userId}</td>
                  <td className={`amount ${alert.amount > 50000 ? 'amount-high' : alert.amount > 10000 ? 'amount-medium' : ''}`}>
                    {formatAmount(alert.amount)}
                  </td>
                  <td><span className={getRiskBadgeClass(alert.riskLevel)}>{alert.riskLevel}</span></td>
                  <td style={{maxWidth: '200px', fontSize: '12px'}}>{alert.reason}</td>
                  <td><span className={getStatusBadgeClass(alert.status)}>{alert.status}</span></td>
                  <td style={{fontSize: '12px', whiteSpace: 'nowrap'}}>{formatTime(alert.detectedAt)}</td>
                  <td>
                    <div className="btn-group">
                      {alert.status === 'PENDING' && (
                        <button className="btn btn-review" onClick={() => handleStatusUpdate(alert.alertId, 'REVIEWED')}>
                          Review
                        </button>
                      )}
                      {(alert.status === 'PENDING' || alert.status === 'REVIEWED') && (
                        <button className="btn btn-resolve" onClick={() => handleStatusUpdate(alert.alertId, 'RESOLVED')}>
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
