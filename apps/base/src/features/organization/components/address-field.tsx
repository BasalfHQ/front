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
} from "@repo/ui";
import { Loader2, MapPin } from "@repo/ui/icons";
import { MIN_QUERY_LENGTH, type AddressSuggestion } from "../mapbox";

// Keeps the input focused when the user interacts with the popover (selecting a
// suggestion, or just clicking the map) — preventing the mousedown default stops
// the browser from shifting focus away, without blocking the click that follows.
function preventFocusSteal(e: React.MouseEvent) {
  e.preventDefault();
}

type Mode = "search" | "resolved";

export function AddressField({
  id = "address",
  value,
  onChange,
  onSearch,
  disabled,
  mapPreview = true,
  onCountryCode,
}: {
  id?: string;
  value: Base.Address | undefined;
  onChange: (address: Base.Address | undefined) => void;
  onSearch: (query: string) => Promise<AddressSuggestion[]>;
  disabled?: boolean;
  // Shows a static-map pin once an address is picked, so the user can
  // confirm it's the right spot rather than trusting the text alone.
  mapPreview?: boolean;
  // Fired with the resolved suggestion's ISO country code (when Mapbox
  // provides one) - lets a caller (checkout) infer currency/timezone.
  // Ignored by callers that don't pass it (admin).
  onCountryCode?: (code: string | undefined) => void;
}) {
  const t = useTranslations("organization");
  const [mode, setMode] = useState<Mode>(value ? "resolved" : "search");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    value?.latitude != null && value?.longitude != null
      ? { lat: value.latitude, lng: value.longitude }
      : null,
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const requestIdRef = useRef(0);

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
    onCountryCode?.(undefined);
    clearTimeout(debounceRef.current);

    if (next.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await onSearch(next);
        if (requestIdRef.current !== requestId) return;
        setSuggestions(results);
        setIsOpen(true);
      } finally {
        if (requestIdRef.current === requestId) setIsSearching(false);
      }
    }, 300);
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    setSuggestions([]);
    setIsOpen(false);
    setCoordinates({ lat: suggestion.latitude, lng: suggestion.longitude });
    onChange(suggestion.address);
    onCountryCode?.(suggestion.countryCode);
    setMode("resolved");
  };

  const backToSearch = () => {
    setMode("search");
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    setCoordinates(null);
    onChange(undefined);
    onCountryCode?.(undefined);
  };

  if (mode === "resolved" && value) {
    return (
      <div className="space-y-2">
        <Label>{t("address")}</Label>
        <div className="rounded-md border bg-gray-50 px-3 py-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              <div>
                <p className="font-medium text-gray-900">
                  {[value.streetNumber, value.streetAddress].filter(Boolean).join(" ")}
                </p>
                <p className="text-gray-500">
                  {[value.postalCode, value.addressLocality].filter(Boolean).join(" ")}
                  {value.addressCountry ? `, ${value.addressCountry}` : ""}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={backToSearch}
              disabled={disabled}
              className="shrink-0 text-sm text-gray-500 underline-offset-2 hover:underline disabled:opacity-50"
            >
              {t("addressChange")}
            </button>
          </div>
        </div>
        {mapPreview && coordinates && (
          <>
            <p className="text-xs text-gray-500">{t("addressMapConfirm")}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/mapbox/static-map?lat=${coordinates.lat}&lng=${coordinates.lng}`}
              alt={t("addressMapAlt")}
              width={600}
              height={400}
              className="w-full h-auto rounded-md border"
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{t("address")}</Label>
      <Popover open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
        <PopoverAnchor asChild>
          <div className="relative">
            <Input
              id={id}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => setIsOpen(suggestions.length > 0)}
              placeholder={t("addressSearchPlaceholder")}
              disabled={disabled}
              autoComplete="off"
            />
            {isSearching && (
              <Loader2
                className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400"
                aria-hidden="true"
              />
            )}
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-80 p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onMouseDown={preventFocusSteal}
        >
          <Command shouldFilter={false}>
            <CommandList>
              <p aria-live="polite" className="sr-only">
                {isSearching ? "" : t("addressResultsCount", { count: suggestions.length })}
              </p>
              {!isSearching && suggestions.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  {t("noAddressResults", { query })}
                </div>
              )}
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.id}
                  value={suggestion.id}
                  onSelect={() => handleSelect(suggestion)}
                  className="flex flex-col items-start gap-0 py-2"
                >
                  <span className="font-medium">{suggestion.line1}</span>
                  <span className="text-xs text-gray-500">{suggestion.line2}</span>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
