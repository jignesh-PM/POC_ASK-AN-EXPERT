"use client";

import { ChevronDown } from "@/app/components/Icon";

export type SelectOption = { value: string; label: string };

type BrandedSelectProps = {
  options: SelectOption[];
  ariaLabel: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export default function BrandedSelect({ options, ariaLabel, value, defaultValue, onValueChange, className = "" }: BrandedSelectProps) {
  return (
    <span className={`native-select-wrap ${className}`}>
      <select
        className="ui-native-select"
        aria-label={ariaLabel}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => onValueChange?.(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <ChevronDown className="ui-select-chevron" size={14} strokeWidth={2} aria-hidden="true" />
    </span>
  );
}