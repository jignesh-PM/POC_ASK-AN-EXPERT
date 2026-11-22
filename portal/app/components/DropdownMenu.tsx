"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";

type OpenContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

type RadioContext = { value?: string; onValueChange?: (value: string) => void };
const RootContext = createContext<OpenContext | null>(null);
const SubContext = createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);
const RadioContext = createContext<RadioContext | null>(null);

export function Root({ children, onOpenChange }: { children: ReactNode; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpenState] = useState(false);
  const id = useId().replaceAll(":", "");
  const contentId = `portal-menu-${id}`;
  const contentRef = useRef<HTMLDivElement>(null);
  const setOpen = (value: boolean) => {
    setOpenState(value);
    onOpenChange?.(value);
  };

  useEffect(() => {
    if (!open) return;
    const closeFromOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || contentRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest(`[data-dropdown-trigger="${contentId}"]`)) return;
      setOpen(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      document.querySelector<HTMLElement>(`[data-dropdown-trigger="${contentId}"]`)?.focus();
    };
    document.addEventListener("pointerdown", closeFromOutside, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [contentId, open]);

  return <RootContext.Provider value={{ open, setOpen, contentId, contentRef }}>{children}</RootContext.Provider>;
}

export function Trigger({ children, asChild }: { children: ReactNode; asChild?: boolean }) {
  const context = useContext(RootContext);
  if (!context) return <>{children}</>;

  const toggle = () => context.setOpen(!context.open);
  if (!asChild) {
    return <button type="button" aria-haspopup="menu" aria-expanded={context.open} aria-controls={context.contentId} data-dropdown-trigger={context.contentId} data-state={context.open ? "open" : "closed"} onClick={toggle}>{children}</button>;
  }
  if (!isValidElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void; [key: string]: unknown }>(children)) return <>{children}</>;

  const child = children as ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void; [key: string]: unknown }>;
  return cloneElement(child, {
    "aria-haspopup": "menu",
    "aria-expanded": context.open,
    "aria-controls": context.contentId,
    "data-dropdown-trigger": context.contentId,
    "data-state": context.open ? "open" : "closed",
    onClick: (event: MouseEvent<HTMLElement>) => {
      child.props.onClick?.(event);
      if (!event.defaultPrevented) toggle();
    },
  });
}

export function Portal({ children }: { children: ReactNode }) { return <>{children}</>; }

const menuItemSelector = '[role="menuitem"], [role="menuitemradio"], a[href], button:not(:disabled)';

export function Content({ children, className, align: _align, side: _side, sideOffset: _sideOffset, collisionPadding: _collisionPadding, onKeyDown, ...props }: React.HTMLAttributes<HTMLDivElement> & { align?: string; side?: string; sideOffset?: number; collisionPadding?: number }) {
  const context = useContext(RootContext);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstItem = contentRef.current?.querySelector<HTMLElement>(menuItemSelector);
    (firstItem ?? contentRef.current)?.focus();
  }, []);

  if (!context?.open) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const items = Array.from(contentRef.current?.querySelectorAll<HTMLElement>(menuItemSelector) ?? []).filter((item) => !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true");
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      context.setOpen(false);
      document.querySelector<HTMLElement>(`[data-dropdown-trigger="${context.contentId}"]`)?.focus();
    } else if (event.key === "ArrowDown" && items.length) {
      event.preventDefault();
      items[(currentIndex + 1) % items.length].focus();
    } else if (event.key === "ArrowUp" && items.length) {
      event.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length].focus();
    } else if (event.key === "Home" && items.length) {
      event.preventDefault();
      items[0].focus();
    } else if (event.key === "End" && items.length) {
      event.preventDefault();
      items[items.length - 1].focus();
    } else if (event.key === "Tab") {
      context.setOpen(false);
    }
  };

  return <div {...props} ref={(node) => { contentRef.current = node; context.contentRef.current = node; }} id={context.contentId} className={className} role="menu" aria-orientation="vertical" tabIndex={-1} onKeyDown={handleKeyDown}>{children}</div>;
}

export function Sub({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <SubContext.Provider value={{ open, setOpen }}>{children}</SubContext.Provider>;
}

export function SubTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const context = useContext(SubContext);
  return <button type="button" className={className} aria-haspopup="menu" aria-expanded={Boolean(context?.open)} onClick={() => context?.setOpen(!context.open)}>{children}</button>;
}

export function SubContent({ children, className, sideOffset: _sideOffset, collisionPadding: _collisionPadding, ...props }: React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number; collisionPadding?: number }) {
  const context = useContext(SubContext);
  if (!context?.open) return null;
  return <div className={className} role="menu" aria-orientation="vertical" {...props}>{children}</div>;
}

export function Label({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}

export function Separator({ className }: { className?: string }) { return <hr className={className} role="separator" />; }

export function Item({ children, asChild, className, onSelect, ...props }: React.HTMLAttributes<HTMLElement> & { asChild?: boolean; onSelect?: () => void }) {
  const context = useContext(RootContext);
  const close = () => {
    onSelect?.();
    context?.setOpen(false);
  };
  if (asChild && isValidElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void; className?: string; [key: string]: unknown }>(children)) {
    const child = children as ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void; className?: string; [key: string]: unknown }>;
    return cloneElement(child, {
      ...props,
      role: "menuitem",
      tabIndex: -1,
      className: [child.props.className, className].filter(Boolean).join(" "),
      onClick: (event: MouseEvent<HTMLElement>) => {
        child.props.onClick?.(event);
        if (!event.defaultPrevented) close();
      },
    });
  }
  return <button type="button" role="menuitem" tabIndex={-1} className={className} onClick={close} {...props}>{children}</button>;
}

export function RadioGroup({ children, value, onValueChange }: { children: ReactNode; value?: string; onValueChange?: (value: string) => void }) {
  return <RadioContext.Provider value={{ value, onValueChange }}><div role="group">{children}</div></RadioContext.Provider>;
}

export function RadioItem({ children, className, value, onClick }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const radio = useContext(RadioContext);
  const root = useContext(RootContext);
  const selected = radio?.value === value;
  return <button type="button" role="menuitemradio" aria-checked={selected} tabIndex={-1} className={`${className ?? ""}${selected ? " is-selected" : ""}`} onClick={(event) => { onClick?.(event); radio?.onValueChange?.(value); root?.setOpen(false); }}>{children}</button>;
}

export function ItemIndicator({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={className} aria-hidden="true">{children}</span>;
}
