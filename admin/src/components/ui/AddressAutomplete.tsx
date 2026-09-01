import { useEffect, useRef, useState } from "react";

import {
  autocompleteAddresses,
  type AddressSuggestion,
} from "../../api/places";

type Props = {
  value: string;
  onChange: (address: string) => void;
};

export default function AddressAutocomplete({ value, onChange }: Props) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOpen = value.trim().length >= 3 && suggestions.length > 0;

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.trim().length < 3) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setIsLoading(true);

      void autocompleteAddresses(value)
        .then((results) => {
          setSuggestions(results);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  const handleChange = (address: string) => {
    if (address.trim().length < 3) {
      setSuggestions([]);
    }

    onChange(address);
  };

  const selectAddress = (suggestion: AddressSuggestion) => {
    setSuggestions([]);
    onChange(suggestion.label);
  };

  return (
    <div className="relative mt-2">
      <input
        type="text"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        className="admin-input w-full"
        placeholder="Search address"
        autoComplete="off"
      />

      {isLoading && (
        <p className="mt-2 text-xs text-white/60">Searching addresses...</p>
      )}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-vintage border border-white/15 bg-surface shadow-xl">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.placeId}
              type="button"
              onClick={() => selectAddress(suggestion)}
              className="block w-full border-b border-white/10 px-4 py-3 text-left text-sm text-white last:border-b-0 hover:bg-white/10"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
