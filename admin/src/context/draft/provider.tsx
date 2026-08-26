import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AvailabilityContent,
  ClosurePeriod,
  MeetCancellation,
} from "../../../../shared/types/Availability";
import type { HomeContent } from "../../../../shared/types/Home";
import type { MenuContent } from "../../../../shared/types/Menu";
import type {
  BusinessDayHours,
  RootContent,
} from "../../../../shared/types/Root";

import {
  DraftContext,
  type ContentFileMap,
  type DraftContent,
  type DraftContextValue,
  type DraftFileKey,
  type PublishedContent,
} from "./context";

import { fetchAuthSession } from "aws-amplify/auth";
import type { Listing } from "../../../../shared/types/Listing";
import type { PricingConfig } from "../../../../shared/types/Pricing";

const contentPaths: Record<DraftFileKey, string> = {
  availability: "/data/availability.json",
  home: "/data/home.json",
  menu: "/data/menu.json",
  pricing: "/data/pricing.json",
  root: "/data/root.json",
};

const API_URL = import.meta.env.VITE_API_URL;

const fetchJson = async <T,>(path: string): Promise<T> => {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json() as Promise<T>;
};

const fetchPublishedContent = async (): Promise<ContentFileMap> => {
  const [availability, home, menu, pricing, root] = await Promise.all([
    fetchJson<AvailabilityContent>(contentPaths.availability),
    fetchJson<HomeContent>(contentPaths.home),
    fetchJson<MenuContent>(contentPaths.menu),
    fetchJson<PricingConfig>(contentPaths.pricing),
    fetchJson<RootContent>(contentPaths.root),
  ]);

  return {
    availability,
    home,
    menu,
    pricing,
    root,
  };
};

type Props = {
  children: ReactNode;
};

export function DraftProvider({ children }: Props) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState<PublishedContent>({});
  const [publishSucceeded, setPublishSucceeded] = useState(false);
  const [publishedFiles, setPublishedFiles] = useState<DraftFileKey[]>([]);
  const [drafts, setDrafts] = useState<DraftContent>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadInitialContent = async () => {
      try {
        const content = await fetchPublishedContent();

        if (!cancelled) {
          setPublished(content);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Failed to load content",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialContent();

    return () => {
      cancelled = true;
    };
  }, []);

  const reloadPublished = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const content = await fetchPublishedContent();
      setPublished(content);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to load content",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pricing = drafts.pricing ?? published.pricing;
  const availability = drafts.availability ?? published.availability;
  const home = drafts.home ?? published.home;
  const menu = drafts.menu ?? published.menu;
  const root = drafts.root ?? published.root;

  const dirtyFiles = useMemo(
    () =>
      (Object.keys(drafts) as DraftFileKey[]).filter(
        (key) => drafts[key] !== undefined,
      ),
    [drafts],
  );

  const publishChanges = useCallback(async () => {
    if (dirtyFiles.length === 0) return;

    const filesToPublish = [...dirtyFiles];

    setIsPublishing(true);
    setPublishSucceeded(false);
    setError(null);

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) {
        throw new Error("Admin authentication is required");
      }

      await Promise.all(
        filesToPublish.map(async (file) => {
          const draft = drafts[file];

          if (!draft) return;

          const response = await fetch(`${API_URL}admin/content/${file}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(draft),
          });

          if (!response.ok) {
            throw new Error(`Failed to publish ${file}`);
          }
        }),
      );

      setPublished((current) => {
        const next = { ...current };

        filesToPublish.forEach((file) => {
          const draft = drafts[file];

          if (draft) {
            Object.assign(next, {
              [file]: draft,
            });
          }
        });

        return next;
      });

      setPublishedFiles(filesToPublish);
      setPublishSucceeded(true);
      setDrafts({});

      window.setTimeout(() => {
        setPublishSucceeded(false);
        setPublishedFiles([]);
      }, 6000);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to publish changes",
      );

      throw caughtError;
    } finally {
      setIsPublishing(false);
    }
  }, [dirtyFiles, drafts]);

  const setAvailabilityDraft = useCallback((value: AvailabilityContent) => {
    setDrafts((current) => ({
      ...current,
      availability: value,
    }));
  }, []);

  const setHomeDraft = useCallback((value: HomeContent) => {
    setDrafts((current) => ({
      ...current,
      home: value,
    }));
  }, []);

  const setMenuDraft = useCallback((value: MenuContent) => {
    setDrafts((current) => ({
      ...current,
      menu: value,
    }));
  }, []);

  const setRootDraft = useCallback((value: RootContent) => {
    setDrafts((current) => ({
      ...current,
      root: value,
    }));
  }, []);

  const updateAvailabilityDraft = useCallback(
    (updater: (current: AvailabilityContent) => AvailabilityContent) => {
      setDrafts((current) => {
        const base = current.availability ?? published.availability;

        if (!base) return current;

        return {
          ...current,
          availability: updater(base),
        };
      });
    },
    [published.availability],
  );

  const updateHomeDraft = useCallback(
    (updater: (current: HomeContent) => HomeContent) => {
      setDrafts((current) => {
        const base = current.home ?? published.home;

        if (!base) return current;

        return {
          ...current,
          home: updater(base),
        };
      });
    },
    [published.home],
  );

  const updateMenuDraft = useCallback(
    (updater: (current: MenuContent) => MenuContent) => {
      setDrafts((current) => {
        const base = current.menu ?? published.menu;

        if (!base) return current;

        return {
          ...current,
          menu: updater(base),
        };
      });
    },
    [published.menu],
  );

  const updateRootDraft = useCallback(
    (updater: (current: RootContent) => RootContent) => {
      setDrafts((current) => {
        const base = current.root ?? published.root;

        if (!base) return current;

        return {
          ...current,
          root: updater(base),
        };
      });
    },
    [published.root],
  );

  const addClosure = useCallback(
    (closure: ClosurePeriod) => {
      updateAvailabilityDraft((current) => ({
        ...current,
        closures: [...current.closures, closure],
      }));
    },
    [updateAvailabilityDraft],
  );

  const editClosure = useCallback(
    (closure: ClosurePeriod) => {
      updateAvailabilityDraft((current) => ({
        ...current,
        closures: current.closures.map((item) =>
          item.id === closure.id ? closure : item,
        ),
      }));
    },
    [updateAvailabilityDraft],
  );

  const deleteClosure = useCallback(
    (closureId: string) => {
      updateAvailabilityDraft((current) => ({
        ...current,
        closures: current.closures.filter(
          (closure) => closure.id !== closureId,
        ),
      }));
    },
    [updateAvailabilityDraft],
  );
  const addListing = useCallback(
    (listing: Listing) => {
      updateMenuDraft((current) => ({
        ...current,
        listings: [...current.listings, listing],
        currentMenu: {
          ...current.currentMenu,
          listingIds: [...current.currentMenu.listingIds, listing.id],
        },
      }));
    },
    [updateMenuDraft],
  );

  const editListing = useCallback(
    (listing: Listing) => {
      updateMenuDraft((current) => ({
        ...current,
        listings: current.listings.map((item) =>
          item.id === listing.id ? listing : item,
        ),
      }));
    },
    [updateMenuDraft],
  );

  const deleteListing = useCallback(
    (listingId: string) => {
      updateMenuDraft((current) => ({
        ...current,
        listings: current.listings.filter(
          (listing) => listing.id !== listingId,
        ),
        currentMenu: {
          ...current.currentMenu,
          listingIds: current.currentMenu.listingIds.filter(
            (id) => id !== listingId,
          ),
        },
      }));
    },
    [updateMenuDraft],
  );

  const addMeetCancellation = useCallback(
    (cancellation: MeetCancellation) => {
      updateAvailabilityDraft((current) => ({
        ...current,
        meetCancellations: [...current.meetCancellations, cancellation],
      }));
    },
    [updateAvailabilityDraft],
  );

  const editMeetCancellation = useCallback(
    (cancellation: MeetCancellation) => {
      updateAvailabilityDraft((current) => ({
        ...current,
        meetCancellations: current.meetCancellations.map((item) =>
          item.id === cancellation.id ? cancellation : item,
        ),
      }));
    },
    [updateAvailabilityDraft],
  );

  const deleteMeetCancellation = useCallback(
    (cancellationId: string) => {
      updateAvailabilityDraft((current) => ({
        ...current,
        meetCancellations: current.meetCancellations.filter(
          (cancellation) => cancellation.id !== cancellationId,
        ),
      }));
    },
    [updateAvailabilityDraft],
  );

  const setNewMeetTimes = useCallback(
    (meetTimes: string[]) => {
      updateRootDraft((current) => ({
        ...current,
        business: {
          ...current.business,
          hours: {
            ...current.business.hours,
            meetSchedule: {
              ...current.business.hours.meetSchedule,
              defaultTimes: [...meetTimes].sort(),
            },
          },
        },
      }));
    },
    [updateRootDraft],
  );

  const setNewBusinessHours = useCallback(
    (businessHours: BusinessDayHours[]) => {
      updateRootDraft((current) => ({
        ...current,
        business: {
          ...current.business,
          hours: {
            ...current.business.hours,
            schedule: businessHours,
          },
        },
      }));
    },
    [updateRootDraft],
  );

  const clearDraft = useCallback((file: DraftFileKey) => {
    setDrafts((current) => {
      const next = { ...current };
      delete next[file];
      return next;
    });
  }, []);

  const clearAllDrafts = useCallback(() => {
    setDrafts({});
  }, []);

  const value = useMemo<DraftContextValue>(
    () => ({
      published,
      drafts,

      availability,
      home,
      menu,
      pricing,
      root,

      isLoading,
      error,

      isPublishing,
      publishSucceeded,
      publishedFiles,

      dirtyFiles,
      hasChanges: dirtyFiles.length > 0,

      reloadPublished,
      publishChanges,

      setAvailabilityDraft,
      setHomeDraft,
      setMenuDraft,
      setRootDraft,

      updateAvailabilityDraft,
      updateHomeDraft,
      updateMenuDraft,
      updateRootDraft,

      addClosure,
      editClosure,
      deleteClosure,

      addListing,
      editListing,
      deleteListing,

      addMeetCancellation,
      editMeetCancellation,
      deleteMeetCancellation,

      setNewMeetTimes,
      setNewBusinessHours,

      clearDraft,
      clearAllDrafts,
    }),
    [
      published,
      drafts,
      availability,
      home,
      menu,
      pricing,
      root,
      isLoading,
      error,
      isPublishing,
      publishSucceeded,
      publishedFiles,
      dirtyFiles,
      reloadPublished,
      publishChanges,
      setAvailabilityDraft,
      setHomeDraft,
      setMenuDraft,
      setRootDraft,
      updateAvailabilityDraft,
      updateHomeDraft,
      updateMenuDraft,
      updateRootDraft,
      addClosure,
      editClosure,
      deleteClosure,
      addListing,
      editListing,
      deleteListing,
      addMeetCancellation,
      editMeetCancellation,
      deleteMeetCancellation,
      setNewMeetTimes,
      setNewBusinessHours,
      clearDraft,
      clearAllDrafts,
    ],
  );

  return (
    <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
  );
}
