/**
 * Header WhatsApp CTA — one component, every header (Waseem, 2026-09-21).
 * wa.me needs E.164 without "+". Tap target ≥ 40 px on mobile.
 */
export const WHATSAPP_NUMBER = "6281316077185";
export const WHATSAPP_DISPLAY = "+62 813-1607-7185";
export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Waseem, I'm reaching out from waseemnasir.com",
)}`;

type Props = {
  /** Show the label on all sizes (default: icon-only below sm). */
  alwaysLabel?: boolean;
  /** Extra classes for placement. */
  className?: string;
  /** Text colour on the green pill. */
  ink?: string;
};

export default function WhatsAppCta({
  alwaysLabel = false,
  className = "",
  ink = "#0b2e1a",
}: Props) {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Contact us on WhatsApp, ${WHATSAPP_DISPLAY}`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-opacity hover:opacity-90 ${className}`}
      style={{
        background: "#25D366",
        color: ink,
        fontSize: "0.85rem",
        minHeight: 40,
        minWidth: 40,
        padding: "0.5rem 0.9rem",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
      </svg>
      <span className={alwaysLabel ? "" : "hidden sm:inline"}>WhatsApp</span>
    </a>
  );
}
