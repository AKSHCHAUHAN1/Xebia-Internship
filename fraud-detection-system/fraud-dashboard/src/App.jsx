import { useState, useEffect, useCallback } from 'react';
import { StatsCards } from './components/StatsCards';
import { AlertTable } from './components/AlertTable';
import { AlertFeed } from './components/AlertFeed';
import { Charts } from './components/Charts';
import { api } from './services/api';
import { connectWebSocket } from './services/websocket';
import './index.css';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('ALL');
  const [wsConnected, setWsConnected] = useState(false);

  // Fetch alerts and stats from REST API
  const fetchData = useCallback(async () => {
    try {
      const [alertsRes, statsRes] = await Promise.all([
        api.getAlerts(),
        api.getStats(),
      ]);
      setAlerts(alertsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // WebSocket connection for real-time alerts
  useEffect(() => {
    const disconnect = connectWebSocket((newAlert) => {
      // Add new alert to the top of the list
      setAlerts((prev) => [newAlert, ...prev.filter(a => a.alertId !== newAlert.alertId)]);
      // Refresh stats
      api.getStats().then(res => setStats(res.data)).catch(console.error);
      setWsConnected(true);
    });

    setWsConnected(true);

    return disconnect;
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="header-logo">🛡️</div>
          <div>
            <div className="header-title">Fraud Detection System</div>
            <div className="header-subtitle">Real-time Transaction Monitoring</div>
          </div>
        </div>
        <div className="header-right">
          <div className="live-indicator">
            <span className="live-dot"></span>
            {wsConnected ? 'Live' : 'Connecting...'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts */}
        <Charts stats={stats} />

        {/* Alert Table + Live Feed */}
        <div className="content-grid">
          <AlertTable
            alerts={alerts}
            onStatusUpdate={fetchData}
            filter={filter}
            onFilterChange={setFilter}
          />
          <AlertFeed alerts={alerts} />
        </div>
      </main>
    </div>
  );
}

export default App;
