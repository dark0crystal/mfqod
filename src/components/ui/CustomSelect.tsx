"use client";

import React, { useRef, useEffect, useState, useId } from "react";

export type CustomSelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  label?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
  /** Optional: align dropdown to start (left in LTR, right in RTL) */
  align?: "start" | "end";
};

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  label,
  id: idProp,
  className = "",
  disabled = false,
  "aria-label": ariaLabel,
  align = "start",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  const close = () => {
    setOpen(false);
    setFocusedIndex(-1);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open || focusedIndex < 0) return;
    listRef.current?.querySelector(`[data-index="${focusedIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, focusedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        const idx = value ? options.findIndex((o) => o.value === value) : 0;
        setFocusedIndex(idx >= 0 ? idx : 0);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => (i < options.length - 1 ? i + 1 : i));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => (i > 0 ? i - 1 : 0));
    } else if (e.key === "Enter" && focusedIndex >= 0 && options[focusedIndex]) {
      e.preventDefault();
      onChange(options[focusedIndex].value);
      close();
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? label ?? undefined}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className="form-input w-full text-left flex items-center justify-between gap-2 min-h-[48px] cursor-pointer"
        style={{ paddingRight: "2.5rem" }}
      >
        <span className={!selectedOption ? "text-[var(--color-form-label)]" : ""}>
          {displayLabel}
        </span>
        <span
          className="pointer-events-none shrink-0 w-5 h-5 flex items-center justify-center text-[var(--color-form-label)]"
          aria-hidden
        >
          <svg
            className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-activedescendant={focusedIndex >= 0 ? `${id}-option-${focusedIndex}` : undefined}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-2xl border border-gray-200 bg-white shadow-lg py-1 focus:outline-none"
          style={{
            [align === "end" ? "right" : "left"]: 0,
            minWidth: "max-content",
          }}
        >
          {options.map((opt, index) => (
            <li
              key={opt.value || "__empty__"}
              role="option"
              data-index={index}
              id={`${id}-option-${index}`}
              aria-selected={value === opt.value}
              className={`cursor-pointer py-3 px-4 transition-colors ${
                value === opt.value ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium" : "hover:bg-gray-100"
              } ${focusedIndex === index ? "bg-gray-50" : ""}`}
              onClick={() => {
                onChange(opt.value);
                close();
              }}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
