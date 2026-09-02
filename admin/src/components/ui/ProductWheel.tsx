import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useState } from "react";

import type { Listing } from "../../../../shared/types/Listing";

type Props = {
  listings: Listing[];
  getCategoryLabel: (categoryId: string) => string;
  onEdit: (listing: Listing) => void;
  onDelete: (listing: Listing) => void;
  hideControls?: boolean;
};

export default function ProductWheel({
  listings,
  getCategoryLabel,
  onEdit,
  onDelete,
  hideControls = false,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeActiveIndex = Math.min(
    activeIndex,
    Math.max(listings.length - 1, 0),
  );

  const goPrevious = () => {
    setActiveIndex(
      (current) => (current - 1 + listings.length) % listings.length,
    );
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % listings.length);
  };

  const getPosition = (index: number) => {
    let offset = index - safeActiveIndex;

    if (offset > listings.length / 2) {
      offset -= listings.length;
    }

    if (offset < -listings.length / 2) {
      offset += listings.length;
    }

    if (offset === 0) return "center";
    if (offset === -1) return "left";
    if (offset === 1) return "right";

    return "hidden";
  };

  return (
    <div className="mt-5">
      <div className="relative mx-auto h-90 max-w-2xl perspective-[900px]">
        {listings.map((listing, index) => {
          const position = getPosition(index);

          return (
            <div
              key={listing.id}
              onClick={
                hideControls
                  ? undefined
                  : position === "left"
                    ? goPrevious
                    : position === "right"
                      ? goNext
                      : undefined
              }
              className={[
                "absolute left-1/2 top-0 overflow-hidden rounded-vintage",
                "border border-white/15 bg-white/5",
                "transition-all duration-500 ease-in-out",
                "transform-3d",

                position === "center" &&
                  "z-20 w-72 -translate-x-1/2 translate-y-0 rotate-y-0 opacity-100",

                position === "left" &&
                  "z-10 w-36 translate-x-[-172%] translate-y-10 rotate-y-[-60deg] cursor-pointer opacity-65",

                position === "right" &&
                  "z-10 w-36 translate-x-[72%] translate-y-10 rotate-y-60 cursor-pointer opacity-65",

                position === "hidden" &&
                  "pointer-events-none z-0 w-28 -translate-x-1/2 scale-75 opacity-0",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div
                className={
                  position === "center"
                    ? "aspect-4/3 overflow-hidden bg-black/20"
                    : "aspect-4/5 overflow-hidden bg-black/20"
                }
              >
                {listing.images?.[0] ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Package
                      className={
                        position === "center"
                          ? "size-12 text-white/30"
                          : "size-8 text-white/30"
                      }
                    />
                  </div>
                )}
              </div>

              <div className={position === "center" ? "p-5" : "p-3"}>
                {position === "center" ? (
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-white">
                        {listing.name}
                      </p>

                      <p className="mt-1 text-sm text-white/65">
                        {getCategoryLabel(listing.categoryId)}
                        {listing.type ? ` · ${listing.type}` : ""}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit(listing);
                        }}
                        className="text-xs font-semibold text-accent"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete(listing);
                        }}
                        className="text-xs font-semibold text-highlight"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="truncate text-xs font-semibold text-white">
                      {listing.name}
                    </p>

                    <p className="mt-1 text-[11px] text-white/60">
                      {getCategoryLabel(listing.categoryId)}
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!hideControls && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={goPrevious}
            aria-label="Previous product"
            className="flex size-9 items-center justify-center rounded-vintage border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft className="size-5" />
          </button>

          <span className="min-w-16 text-center text-xs font-semibold text-white/60">
            {Math.min(activeIndex + 1, listings.length)} / {listings.length}
          </span>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next product"
            className="flex size-9 items-center justify-center rounded-vintage border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
