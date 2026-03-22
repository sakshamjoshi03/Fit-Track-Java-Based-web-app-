import { useState, useCallback, useRef } from 'react';
import { X, MapPin } from 'lucide-react';

interface PlaceSuggestion {
  placeId: string;
  name: string;
  address: string;
}

interface ManualLocationSearchProps {
  onDestinationSet: (lat: number, lng: number, address: string) => void;
  onDestinationClear: () => void;
  destination: string | null;
}

export default function ManualLocationSearch({
  onDestinationSet,
  onDestinationClear,
  destination,
}: ManualLocationSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchPlaces = useCallback((q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    fetch('/api/location/manual/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q }),
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setSuggestions(data);
        setShowDropdown(data.length > 0);
      })
      .catch(() => setSuggestions([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(val), 300);
  };

  const handleSelect = (suggestion: PlaceSuggestion) => {
    fetch('/api/location/manual/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId: suggestion.placeId }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          onDestinationSet(data.lat, data.lng, data.address || suggestion.address);
        }
      })
      .catch(() => {});

    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  if (destination) {
    return (
      <div className="destination-badge">
        <MapPin size={14} />
        <span>{destination}</span>
        <span className="destination-clear" onClick={onDestinationClear}>
          <X size={14} />
        </span>
      </div>
    );
  }

  return (
    <div className="manual-search-wrapper">
      <input
        type="text"
        className="manual-search-input"
        placeholder="Search destination..."
        value={query}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
      />
      {showDropdown && (
        <div className="manual-search-dropdown">
          {suggestions.map((s) => (
            <div
              key={s.placeId}
              className="manual-search-item"
              onMouseDown={() => handleSelect(s)}
            >
              <div className="manual-search-item-name">{s.name}</div>
              <div className="manual-search-item-address">{s.address}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
