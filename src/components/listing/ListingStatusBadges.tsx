"use client";

import { getListingStatusLabels } from "@/components/onboarding/flow/utils";

const ICON_BY_KEY: Record<string, string> = {
  urgent_sale: "fa-solid fa-bolt",
  under_offer: "fa-solid fa-handshake-simple",
  multiple_locations: "fa-solid fa-map-location-dot",
};

/** Keeps title/meta aligned when some cards have 0–3 badges (same reserved band). */
const SLOT_MIN_HEIGHT_PX = 34;
const SLOT_MARGIN_BOTTOM_PX = 10;

type ListingStatusBadgesProps = {
  item: Record<string, unknown>;
  className?: string;
  /**
   * When true, cards with no status still reserve the same vertical band as a one-line rail,
   * so grid rows stay aligned. Extra height only appears if badges wrap to a second line.
   */
  uniformCardSlot?: boolean;
};

export default function ListingStatusBadges({
  item,
  className,
  uniformCardSlot = false,
}: ListingStatusBadgesProps) {
  const labels = getListingStatusLabels(item);

  if (labels.length === 0) {
    if (!uniformCardSlot) {
      return null;
    }

    return (
      <div
        aria-hidden
        className={className ?? ""}
        style={{
          width: "100%",
          minHeight: `${SLOT_MIN_HEIGHT_PX}px`,
          marginBottom: `${SLOT_MARGIN_BOTTOM_PX}px`,
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      />
    );
  }

  return (
    <div
      className={`listing-status-badges-wrap ${className ?? ""}`}
      style={{
        width: "100%",
        minHeight: `${SLOT_MIN_HEIGHT_PX}px`,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        alignContent: "center",
        gap: "7px",
        rowGap: "7px",
        marginBottom: `${SLOT_MARGIN_BOTTOM_PX}px`,
        boxSizing: "border-box",
      }}
    >
      {labels.map((status) => {
        const icon = ICON_BY_KEY[status.key] ?? "fa-solid fa-circle";
        const isUrgent = status.key === "urgent_sale";

        return (
          <span
            key={status.key}
            className={`listing-status-badge listing-status-badge--${status.key}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 9px 4px 6px",
              borderRadius: "999px",
              background: status.background,
              border: status.border,
              color: status.color,
              fontSize: "10px",
              fontWeight: 750,
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              boxShadow:
                "0 8px 20px rgba(15, 23, 42, 0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
              maxWidth: "100%",
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "18px",
                height: "18px",
                borderRadius: "999px",
                background: `${status.color}22`,
                color: status.color,
                flexShrink: 0,
                fontSize: "8px",
              }}
            >
              <i className={icon} />
            </span>
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {status.label}
            </span>
            {isUrgent && (
              <span
                className="listing-status-badge-pulse"
                aria-hidden
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: status.color,
                  flexShrink: 0,
                  marginLeft: "2px",
                }}
              />
            )}
          </span>
        );
      })}

      <style jsx>{`
        .listing-status-badge--urgent_sale {
          animation: listing-urgent-float 2.6s ease-in-out infinite;
        }
        .listing-status-badge-pulse {
          animation: listing-urgent-pulse 1.8s ease-in-out infinite;
        }
        @keyframes listing-urgent-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-1px);
          }
        }
        @keyframes listing-urgent-pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.5);
          }
          50% {
            opacity: 0.88;
            transform: scale(1.08);
            box-shadow: 0 0 0 7px rgba(234, 88, 12, 0);
          }
        }
      `}</style>
    </div>
  );
}
