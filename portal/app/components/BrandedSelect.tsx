"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

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
    <Select.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange}>
      <Select.Trigger className={`ui-select-trigger ${className}`} aria-label={ariaLabel}>
        <Select.Value />
        <Select.Icon className="ui-select-chevron"><ChevronDown size={14} strokeWidth={2} aria-hidden="true" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="ui-select-content" position="popper" sideOffset={6} collisionPadding={10}>
          <Select.Viewport className="ui-select-viewport">
            {options.map((option) => (
              <Select.Item className="ui-select-item" key={option.value} value={option.value}>
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="ui-select-check"><Check size={15} strokeWidth={2.5} aria-hidden="true" /></Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
