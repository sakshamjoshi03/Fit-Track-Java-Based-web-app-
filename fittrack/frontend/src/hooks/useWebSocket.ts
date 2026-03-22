import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';

export interface MetricsSummary {
  steps: number;
  dailyStepsTarget: number;
  distanceKm: number;
  weeklyDistanceTargetKm: number;
  activeTimeSeconds: number;
  caloriesKcal: number;
  heartRateBpm: number;
  elevationMeters: number;
  paceMinPerKm: number;
  dailyGoalMet: boolean;
  timestamp: number;
}

export interface RouteUpdate {
  points: number[][];
  active: boolean;
  timestamp: number;
}

export function useWebSocket() {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [route, setRoute] = useState<RouteUpdate | null>(null);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  const connect = useCallback(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws/fittrack/websocket',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);
        client.subscribe('/topic/metrics', (message) => {
          try {
            const data: MetricsSummary = JSON.parse(message.body);
            setMetrics(data);
          } catch (e) {
            console.error('Failed to parse metrics message:', e);
          }
        });
        client.subscribe('/topic/route', (message) => {
          try {
            const data: RouteUpdate = JSON.parse(message.body);
            setRoute(data);
          } catch (e) {
            console.error('Failed to parse route message:', e);
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [connect]);

  return { metrics, route, connected };
}
