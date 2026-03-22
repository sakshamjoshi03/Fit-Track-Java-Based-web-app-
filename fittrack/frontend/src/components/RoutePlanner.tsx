import { useState, useCallback, useRef } from 'react';
import { X, MapPin, Navigation, ArrowRight } from 'lucide-react';

interface PlaceSuggestion {
  placeId: string;
  name: string;
  address: string;
}

interface LocationPoint {
  lat: number;
  lng: number;
  address: string;
}

interface RoutePlannerProps {
  onRouteSet: (start: LocationPoint, end: LocationPoint, distanceKm: number) => void;
  onRouteClear: () => void;
  routeInfo: { start: LocationPoint; end: LocationPoint; distanceKm: number } | null;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function LocationInput({
  label,
  placeholder,
  icon: Icon,
  value,
  onSelect,
  onClear,
}: {
  label: string;
  placeholder: string;
  icon: typeof MapPin;
  value: LocationPoint | null;
  onSelect: (loc: LocationPoint) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [useGeo, setUseGeo] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchPlaces = useCallback((q: string) => {
    if (q.length < 2) { setSuggestions([]); setShowDropdown(false); return; }
    fetch('/api/location/manual/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q }),
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setSuggestions(data); setShowDropdown(data.length > 0); })
      .catch(() => setSuggestions([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(val), 300);
  };

  const handleSelect = (s: PlaceSuggestion) => {
    fetch('/api/location/manual/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId: s.placeId }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) onSelect({ lat: data.lat, lng: data.lng, address: data.address || s.address });
      })
      .catch(() => {});
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleUseCurrentLocation = () => {
    setUseGeo(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Reverse geocode via backend
          fetch(`/api/location/reverse?lat=${latitude}&lng=${longitude}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
              onSelect({ lat: latitude, lng: longitude, address: data?.address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
              setUseGeo(false);
            })
            .catch(() => {
              onSelect({ lat: latitude, lng: longitude, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
              setUseGeo(false);
            });
        },
        () => setUseGeo(false)
      );
    }
  };

  if (value) {
    return (
      <div className="route-point-set">
        <Icon size={14} className="route-point-icon" />
        <span className="route-point-address">{value.address}</span>
        <X size={14} className="route-point-clear" onClick={onClear} />
      </div>
    );
  }

  return (
    <div className="route-input-group">
      <div className="route-input-label">{label}</div>
      <div className="route-input-row">
        <div className="route-search-wrapper">
          <Icon size={14} className="route-search-icon" />
          <input
            type="text"
            className="route-search-input"
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          />
          {showDropdown && (
            <div className="manual-search-dropdown">
              {suggestions.map(s => (
                <div key={s.placeId} className="manual-search-item" onMouseDown={() => handleSelect(s)}>
                  <div className="manual-search-item-name">{s.name}</div>
                  <div className="manual-search-item-address">{s.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="geo-btn" onClick={handleUseCurrentLocation} disabled={useGeo} title="Use current location">
          <Navigation size={14} />
        </button>
      </div>
    </div>
  );
}

export default function RoutePlanner({ onRouteSet, onRouteClear, routeInfo }: RoutePlannerProps) {
  const [start, setStart] = useState<LocationPoint | null>(null);
  const [end, setEnd] = useState<LocationPoint | null>(null);

  const handleStartSet = (loc: LocationPoint) => {
    setStart(loc);
    if (end) {
      const dist = haversineDistance(loc.lat, loc.lng, end.lat, end.lng);
      onRouteSet(loc, end, Math.round(dist * 100) / 100);
    }
  };

  const handleEndSet = (loc: LocationPoint) => {
    setEnd(loc);
    if (start) {
      const dist = haversineDistance(start.lat, start.lng, loc.lat, loc.lng);
      onRouteSet(start, loc, Math.round(dist * 100) / 100);
    }
  };

  const clearAll = () => {
    setStart(null);
    setEnd(null);
    onRouteClear();
  };

  return (
    <div className="route-planner">
      <div className="route-planner-header">
        <span className="route-planner-title">📍 Route Planner</span>
        {routeInfo && (
          <button className="route-clear-all" onClick={clearAll}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      <div className="route-inputs">
        <LocationInput
          label="FROM"
          placeholder="Starting point..."
          icon={Navigation}
          value={start}
          onSelect={handleStartSet}
          onClear={() => { setStart(null); onRouteClear(); }}
        />

        <div className="route-connector">
          <div className="route-connector-line" />
          <ArrowRight size={14} className="route-connector-arrow" />
          <div className="route-connector-line" />
        </div>

        <LocationInput
          label="TO"
          placeholder="Destination..."
          icon={MapPin}
          value={end}
          onSelect={handleEndSet}
          onClear={() => { setEnd(null); onRouteClear(); }}
        />
      </div>

      {routeInfo && (
        <div className="route-result">
          <div className="route-result-distance">
            <span className="route-result-value">{routeInfo.distanceKm.toFixed(2)}</span>
            <span className="route-result-unit">km</span>
          </div>
          <div className="route-result-label">Straight-line distance</div>
          <div className="route-result-points">
            {routeInfo.start.address.split(',')[0]} → {routeInfo.end.address.split(',')[0]}
          </div>
        </div>
      )}
    </div>
  );
}
