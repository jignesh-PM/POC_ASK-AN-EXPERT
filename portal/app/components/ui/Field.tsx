import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { ChevronDown, Search } from "../Icon";
import { cx } from "./cx";
import styles from "./Field.module.css";

type FieldProps = {
  label: ReactNode;
  /** Helper text under the control. */
  hint?: ReactNode;
  /** Validation message; replaces the hint and is announced. */
  error?: ReactNode;
  optional?: boolean;
  /** Visually hide the label (it stays available to screen readers). */
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
};

/** Label + control + hint/error. Wrap any Input, Select or Textarea in it. */
export function Field({ label, hint, error, optional, hideLabel, className, children }: FieldProps) {
  return (
    <label className={cx(styles.field, className)}>
      <span className={cx(styles.label, hideLabel && "visually-hidden")}>
        {label}
        {optional && <span className={styles.optional}>Optional</span>}
      </span>
      {children}
      {error ? (
        <span className={styles.error} role="alert">
          {error}
        </span>
      ) : (
        hint && <span className={styles.hint}>{hint}</span>
      )}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(styles.control, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(styles.control, styles.textarea, className)} {...props} />;
}

export function Select({ className, children, wrapperClassName, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { wrapperClassName?: string }) {
  if (props.multiple) {
    return (
      <select className={cx(styles.control, styles.multi, className)} {...props}>
        {children}
      </select>
    );
  }
  return (
    <span className={cx(styles.selectWrap, wrapperClassName)}>
      <select className={cx(styles.control, styles.select, className)} {...props}>
        {children}
      </select>
      <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
    </span>
  );
}

/** Search box with a leading icon. Pass `aria-label` when there is no visible label. */
export function SearchInput({ className, wrapperClassName, ...props }: InputHTMLAttributes<HTMLInputElement> & { wrapperClassName?: string }) {
  return (
    <span className={cx(styles.searchWrap, wrapperClassName)}>
      <Search className={styles.searchIcon} size={18} aria-hidden="true" />
      <input type="search" className={cx(styles.control, styles.search, className)} {...props} />
    </span>
  );
}

/** Checkbox with an inline label. */
export function Checkbox({ label, description, className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode; description?: ReactNode }) {
  return (
    <label className={cx(styles.check, className)}>
      <input type="checkbox" {...props} />
      <span>
        <span className={styles.checkLabel}>{label}</span>
        {description && <span className={styles.hint}>{description}</span>}
      </span>
    </label>
  );
}

/** On/off toggle row: title and description on the left, switch on the right. */
export function Switch({ label, description, className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode; description?: ReactNode }) {
  return (
    <label className={cx(styles.switchRow, className)}>
      <span className={styles.switchCopy}>
        <span className={styles.checkLabel}>{label}</span>
        {description && <span className={styles.hint}>{description}</span>}
      </span>
      <input type="checkbox" role="switch" className={styles.switch} {...props} />
    </label>
  );
}
