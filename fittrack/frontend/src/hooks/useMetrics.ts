import { useState, useEffect } from 'react';
import type { MetricsSummary } from './useWebSocket';

export function useMetrics(wsMetrics: MetricsSummary | null) {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);

  // Fetch initial metrics via REST
  useEffect(() => {
    fetch('/api/metrics/summary')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) setMetrics(data);
      })
      .catch(() => {
        // Backend not available — stay in waiting state
      });
  }, []);

  // Update when WebSocket pushes new data
  useEffect(() => {
    if (wsMetrics) {
      setMetrics(wsMetrics);
    }
  }, [wsMetrics]);

  return metrics;
}
