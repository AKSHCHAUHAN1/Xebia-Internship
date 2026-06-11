import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const RISK_COLORS = {
  HIGH: '#ef4444',
  MEDIUM: '#f59e0b',
  LOW: '#22c55e',
};

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  REVIEWED: '#3b82f6',
  RESOLVED: '#22c55e',
};

export function Charts({ stats }) {
  const riskData = [
    { name: 'High', value: stats.highRisk || 0, color: RISK_COLORS.HIGH },
    { name: 'Medium', value: stats.mediumRisk || 0, color: RISK_COLORS.MEDIUM },
    { name: 'Low', value: stats.lowRisk || 0, color: RISK_COLORS.LOW },
  ].filter(d => d.value > 0);

  const statusData = [
    { name: 'Pending', value: stats.pending || 0, color: STATUS_COLORS.PENDING },
    { name: 'Reviewed', value: stats.reviewed || 0, color: STATUS_COLORS.REVIEWED },
    { name: 'Resolved', value: stats.resolved || 0, color: STATUS_COLORS.RESOLVED },
  ].filter(d => d.value > 0);

  const renderCustomLabel = ({ name, percent }) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="charts-row">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">📊 Risk Distribution</span>
        </div>
        <div className="chart-container">
          {riskData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-text">No data yet</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {riskData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '13px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">📈 Status Overview</span>
        </div>
        <div className="chart-container">
          {statusData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📈</div>
              <div className="empty-state-text">No data yet</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '13px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
