"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Base } from "@repo/apis";
import {
  Input,
  Label,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Command,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@repo/ui";
import { searchAddress } from "../actions";
import type { AddressSuggestion } from "../mapbox";

const MIN_QUERY_LENGTH = 5;

function formatAddress(address: Base.Address | undefined) {
  if (!address) return "";
  return [
    [address.streetNumber, address.streetAddress].filter(Boolean).join(" "),
    address.postalCode,
    address.addressLocality,
    address.addressCountry,
  ]
    .filter(Boolean)
    .join(", ");
}

// Keeps the input focused when the user interacts with the popover (selecting a
// suggestion, or just clicking the map) — preventing the mousedown default stops
// the browser from shifting focus away, without blocking the click that follows.
function preventFocusSteal(e: React.MouseEvent) {
  e.preventDefault();
}

export function AddressField({
  id = "address",
  value,
  onChange,
  disabled,
}: {
  id?: string;
  value: Base.Address | undefined;
  onChange: (address: Base.Address | undefined) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("organization");
  const [query, setQuery] = useState(formatAddress(value));
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setQuery(formatAddress(value));
    setCoordinates(
      value?.latitude != null && value?.longitude != null
        ? { lat: value.latitude, lng: value.longitude }
        : null,
    );
  }, [value]);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const handleQueryChange = (next: string) => {
    setQuery(next);
    setCoordinates(null);
    // Any edit invalidates the previously committed selection — otherwise the
    // parent could still hold a stale address whose text no longer matches
    // what's displayed, and silently submit it.
    onChange(undefined);
    clearTimeout(debounceRef.current);

    if (next.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchAddress(next);
        if (requestIdRef.current !== requestId) return;
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } finally {
        if (requestIdRef.current === requestId) setIsSearching(false);
      }
    }, 300);
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    setQuery(suggestion.placeName);
    setSuggestions([]);
    setIsOpen(false);
    setCoordinates({ lat: suggestion.latitude, lng: suggestion.longitude });
    onChange(suggestion.address);
  };

  const showMap = isFocused && !isOpen && !!coordinates;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{t("address")}</Label>
      <Popover
        open={isOpen || showMap}
        onOpenChange={(open) => {
          if (!open) setIsOpen(false);
        }}
      >
        <PopoverAnchor asChild>
          <Input
            id={id}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setIsOpen(suggestions.length > 0);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={t("addressSearchPlaceholder")}
            disabled={disabled}
            autoComplete="off"
          />
        </PopoverAnchor>
        <PopoverContent
          className={isOpen ? "w-80 p-0" : "w-72 p-2"}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onMouseDown={preventFocusSteal}
        >
          {isOpen ? (
            <Command shouldFilter={false}>
              <CommandList>
                <CommandEmpty>
                  {isSearching ? t("searchingAddress") : t("noAddressResults")}
                </CommandEmpty>
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion.id}
                    value={suggestion.id}
                    onSelect={() => handleSelect(suggestion)}
                  >
                    {suggestion.placeName}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          ) : (
            coordinates && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/mapbox/static-map?lat=${coordinates.lat}&lng=${coordinates.lng}`}
                alt={query}
                className="w-full rounded-md"
              />
            )
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
