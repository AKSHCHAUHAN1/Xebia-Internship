import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'http://localhost:8081/ws';

export function connectWebSocket(onAlertReceived) {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: () => {},  // suppress debug logs
  });

  client.onConnect = () => {
    console.log('🔌 WebSocket connected');
    client.subscribe('/topic/alerts', (message) => {
      const alert = JSON.parse(message.body);
      console.log('🚨 Real-time alert received:', alert);
      onAlertReceived(alert);
    });
  };

  client.onStompError = (frame) => {
    console.error('STOMP error:', frame.headers['message']);
  };

  client.activate();

  return () => {
    if (client.active) {
      client.deactivate();
    }
  };
}
