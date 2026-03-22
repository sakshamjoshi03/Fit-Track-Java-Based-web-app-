import { useEffect, useRef } from 'react';

interface RouteCanvasProps {
  points: number[][]; // [lat, lng][]
  destination?: number[] | null;
}

export default function RouteCanvas({ points, destination }: RouteCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    // Clear previous
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // If no points, draw a sample animated route path
    const displayPoints =
      points.length >= 2
        ? points
        : [
            // Idle state: show a gentle curve placeholder
          ];

    if (displayPoints.length < 2) {
      // Draw idle state with animated dots
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '50%');
      text.setAttribute('y', '50%');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#6b7280');
      text.setAttribute('font-size', '13');
      text.setAttribute('font-family', 'Inter, sans-serif');
      text.textContent = 'Waiting for GPS data...';
      svg.appendChild(text);
      return;
    }

    // Compute bounds
    const lats = displayPoints.map((p) => p[0]);
    const lngs = displayPoints.map((p) => p[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const padding = 30;
    const w = svg.clientWidth || 500;
    const h = svg.clientHeight || 180;

    const scaleX = (lng: number) =>
      padding + ((lng - minLng) / (maxLng - minLng || 1)) * (w - 2 * padding);
    const scaleY = (lat: number) =>
      h - padding - ((lat - minLat) / (maxLat - minLat || 1)) * (h - 2 * padding);

    // Create gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.id = 'route-grad';
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '0%');
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#f5a623');
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#d97706');
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    svg.appendChild(defs);

    // Draw route polyline
    const pathPoints = displayPoints.map((p) => `${scaleX(p[1])},${scaleY(p[0])}`).join(' ');
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', pathPoints);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', 'url(#route-grad)');
    polyline.setAttribute('stroke-width', '3');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');

    // Animate drawing
    const totalLength = polyline.getTotalLength?.() || 1000;
    polyline.setAttribute('stroke-dasharray', String(totalLength));
    polyline.setAttribute('stroke-dashoffset', String(totalLength));
    polyline.style.animation = 'route-draw 2s ease forwards';
    svg.appendChild(polyline);

    // Start dot (green)
    const startDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    startDot.setAttribute('cx', String(scaleX(displayPoints[0][1])));
    startDot.setAttribute('cy', String(scaleY(displayPoints[0][0])));
    startDot.setAttribute('r', '5');
    startDot.setAttribute('fill', '#22c55e');
    svg.appendChild(startDot);

    // Current position (pulsing amber)
    const last = displayPoints[displayPoints.length - 1];
    const currentDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    currentDot.setAttribute('cx', String(scaleX(last[1])));
    currentDot.setAttribute('cy', String(scaleY(last[0])));
    currentDot.setAttribute('r', '6');
    currentDot.setAttribute('fill', '#f5a623');
    currentDot.style.animation = 'live-pulse 1.5s ease-in-out infinite';
    svg.appendChild(currentDot);

    // Destination dot (red) + dashed line
    if (destination && destination.length === 2) {
      const destX = scaleX(destination[1]);
      const destY = scaleY(destination[0]);

      const dashLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      dashLine.setAttribute('x1', String(scaleX(last[1])));
      dashLine.setAttribute('y1', String(scaleY(last[0])));
      dashLine.setAttribute('x2', String(destX));
      dashLine.setAttribute('y2', String(destY));
      dashLine.setAttribute('stroke', '#f5a623');
      dashLine.setAttribute('stroke-width', '2');
      dashLine.setAttribute('stroke-dasharray', '6,4');
      dashLine.setAttribute('opacity', '0.5');
      svg.appendChild(dashLine);

      const destDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      destDot.setAttribute('cx', String(destX));
      destDot.setAttribute('cy', String(destY));
      destDot.setAttribute('r', '5');
      destDot.setAttribute('fill', '#ef4444');
      svg.appendChild(destDot);
    }

    // Add labels along route
    if (displayPoints.length > 3) {
      const midIdx = Math.floor(displayPoints.length / 2);
      const midPoint = displayPoints[midIdx];
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', String(scaleX(midPoint[1])));
      label.setAttribute('y', String(scaleY(midPoint[0]) - 12));
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', '#9ca3af');
      label.setAttribute('font-size', '10');
      label.setAttribute('font-family', 'Inter, sans-serif');
      const elapsed = displayPoints.length > 5 ? `${Math.floor(displayPoints.length * 0.3)}' Pace` : '';
      label.textContent = elapsed;
      svg.appendChild(label);
    }
  }, [points, destination]);

  return (
    <div className="route-canvas-wrapper">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      />
      <style>{`
        @keyframes route-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
