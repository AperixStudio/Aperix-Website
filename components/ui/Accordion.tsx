"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  type Transition,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   Accordion Component
   PRD §4.2.7 — FAQ accordion with smooth height transition
   using Framer Motion AnimatePresence + motion.div height:"auto"
   Respects prefers-reduced-motion via useReducedMotion.
   ──────────────────────────────────────────────────────────── */

/* ── reduced-motion hook (PRD §3.4) ────────────────────────── */
function useReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  return mq.matches;
}

/* ── Shared context ─────────────────────────────────────────── */
interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion.Item must be used within <Accordion>");
  return ctx;
}

/* ── Item-level context (passes value down to Trigger/Content) ── */
interface ItemContextValue {
  value: string;
  isOpen: boolean;
  headingId: string;
  panelId: string;
}

const ItemContext = createContext<ItemContextValue | null>(null);

function useItem() {
  const ctx = useContext(ItemContext);
  if (!ctx)
    throw new Error(
      "Accordion.Trigger / Accordion.Content must be used within <Accordion.Item>",
    );
  return ctx;
}

/* ── <Accordion> root ──────────────────────────────────────── */
interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple items open at once */
  multiple?: boolean;
  /** Values of initially-open items */
  defaultOpen?: string[];
  children: ReactNode;
}

function Accordion({
  multiple = false,
  defaultOpen = [],
  className,
  children,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    () => new Set(defaultOpen),
  );

  const toggle = useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(value)) {
          next.delete(value);
        } else {
          if (!multiple) next.clear();
          next.add(value);
        }
        return next;
      });
    },
    [multiple],
  );

  const ctx = useMemo(() => ({ openItems, toggle }), [openItems, toggle]);

  return (
    <AccordionContext.Provider value={ctx}>
      <div
        className={cn("divide-y divide-agency-border", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

/* ── <Accordion.Item> ─────────────────────────────────────── */
interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique value identifying this item */
  value: string;
  children: ReactNode;
}

function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const { openItems } = useAccordion();
  const isOpen = openItems.has(value);
  const headingId = useId();
  const panelId = useId();

  const itemCtx = useMemo<ItemContextValue>(
    () => ({ value, isOpen, headingId, panelId }),
    [value, isOpen, headingId, panelId],
  );

  return (
    <ItemContext.Provider value={itemCtx}>
      <div className={cn("group", className)} {...props}>
        {children}
      </div>
    </ItemContext.Provider>
  );
}

/* ── <Accordion.Trigger> ──────────────────────────────────── */
interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const { value, isOpen, headingId, panelId } = useItem();
  const { toggle } = useAccordion();
  const prefersReduced = useReducedMotion();

  const transition: Transition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] };

  return (
    <h3>
      <button
        id={headingId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => toggle(value)}
        className={cn(
          "flex w-full items-center justify-between gap-4 py-5 text-left",
          "font-(family-name:--font-display) font-semibold text-lg",
          "text-agency-text transition-colors duration-150",
          "hover:text-agency-accent focus-visible:outline-none focus-visible:text-agency-accent",
          className,
        )}
        {...props}
      >
        <span>{children}</span>

        {/* Chevron icon */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={transition}
          className="shrink-0 text-agency-muted"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.span>
      </button>
    </h3>
  );
}

/* ── <Accordion.Content> ──────────────────────────────────── */
interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const { isOpen, headingId, panelId } = useItem();
  const prefersReduced = useReducedMotion();

  const transition: Transition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={panelId}
          role="region"
          aria-labelledby={headingId}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={transition}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "pb-5 text-agency-muted leading-relaxed",
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Namespace exports ──────────────────────────────────────── */
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
};
