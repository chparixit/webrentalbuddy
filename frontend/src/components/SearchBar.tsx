import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { colors, borderRadius, typography, transitions } from "../styles/designTokens";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
}

const RECENT_SEARCHES_KEY = "rentalBuddy_recentSearches";
const MAX_RECENT = 5;

const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur"];
const PROPERTY_TYPES = ["Apartment", "House", "Studio", "Penthouse"];

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search by city, location, or property type...",
  onSearch,
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const saveRecentSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeRecentSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const suggestions = useMemo(() => {
    if (!value.trim()) return [];
    const q = value.toLowerCase();
    const results: { text: string; type: "city" | "type" }[] = [];

    CITIES.forEach((c) => {
      if (c.toLowerCase().includes(q)) results.push({ text: c, type: "city" });
    });
    PROPERTY_TYPES.forEach((t) => {
      if (t.toLowerCase().includes(q)) results.push({ text: t, type: "type" });
    });
    return results.slice(0, 6);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveRecentSearch(value);
      setShowDropdown(false);
      onSearch?.();
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (text: string) => {
    onChange(text);
    saveRecentSearch(text);
    setShowDropdown(false);
    onSearch?.();
  };

  const showDropdownMenu = showDropdown && isFocused && (suggestions.length > 0 || recentSearches.length > 0 || !value);

  return (
    <div ref={wrapperRef} style={{ position: "relative", flex: 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "white",
          border: `2px solid ${isFocused ? colors.primary : colors.border}`,
          borderRadius: borderRadius.xl,
          padding: "0 16px",
          gap: 10,
          transition: transitions.normal,
          height: 48,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isFocused ? colors.primary : colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "stroke 0.2s" }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => { setIsFocused(true); setShowDropdown(true); }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 14,
            color: colors.textPrimary,
            background: "transparent",
            fontFamily: "inherit",
            width: "100%",
          }}
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: colors.textMuted,
              padding: 0,
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {showDropdownMenu && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 6,
            background: "white",
            borderRadius: borderRadius.xl,
            boxShadow: colors.shadowXl,
            border: `1px solid ${colors.border}`,
            overflow: "hidden",
            zIndex: 200,
            animation: "dropdownFadeIn 0.15s ease",
          }}
        >
          {!value && recentSearches.length > 0 && (
            <div style={{ padding: "12px 16px 8px" }}>
              <span style={{ ...typography.label, color: colors.textMuted, fontSize: 10 }}>RECENT SEARCHES</span>
              {recentSearches.map((term) => (
                <div
                  key={term}
                  onMouseDown={() => handleSelect(term)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    cursor: "pointer",
                    borderBottom: `1px solid ${colors.borderLight}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span style={{ fontSize: 14, color: colors.textSecondary }}>{term}</span>
                  </div>
                  <button
                    onMouseDown={(e) => { e.stopPropagation(); removeRecentSearch(term); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: colors.textMuted, padding: 4 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {suggestions.length > 0 && (
            <div style={{ padding: value ? "8px 0" : "0", maxHeight: 240, overflowY: "auto" }}>
              {value && <div style={{ padding: "4px 16px 6px" }}><span style={{ ...typography.label, color: colors.textMuted, fontSize: 10 }}>SUGGESTIONS</span></div>}
              {suggestions.map((s) => (
                <div
                  key={s.text}
                  onMouseDown={() => handleSelect(s.text)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px",
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = colors.bgSecondary)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.type === "city" ? colors.primary : colors.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {s.type === "city" ? (
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    ) : (
                      <path d="M3 22V8l9-6 9 6v14" />
                    )}
                  </svg>
                  <span style={{ fontSize: 14, color: colors.textPrimary }}>{s.text}</span>
                  <span style={{ marginLeft: "auto", ...typography.small, color: colors.textMuted, textTransform: "capitalize" }}>
                    {s.type}
                  </span>
                </div>
              ))}
            </div>
          )}

          {!value && recentSearches.length === 0 && (
            <div style={{ padding: "20px 16px", textAlign: "center" }}>
              <span style={{ fontSize: 13, color: colors.textMuted }}>Start typing to search properties</span>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes dropdownFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
