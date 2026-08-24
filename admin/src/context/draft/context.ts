import { createContext } from "react";

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

export type ContentFileMap = {
  availability: AvailabilityContent;
  home: HomeContent;
  menu: MenuContent;
  root: RootContent;
};

export type DraftFileKey = keyof ContentFileMap;

export type PublishedContent = Partial<ContentFileMap>;
export type DraftContent = Partial<ContentFileMap>;

export type DraftContextValue = {
  published: PublishedContent;
  drafts: DraftContent;

  availability?: AvailabilityContent;
  home?: HomeContent;
  menu?: MenuContent;
  root?: RootContent;

  isLoading: boolean;
  error: string | null;

  dirtyFiles: DraftFileKey[];
  hasChanges: boolean;

  isPublishing: boolean;
  publishedFiles: DraftFileKey[];
  publishSucceeded: boolean;

  reloadPublished: () => Promise<void>;
  publishChanges: () => Promise<void>;

  setAvailabilityDraft: (value: AvailabilityContent) => void;
  setHomeDraft: (value: HomeContent) => void;
  setMenuDraft: (value: MenuContent) => void;
  setRootDraft: (value: RootContent) => void;

  updateAvailabilityDraft: (
    updater: (current: AvailabilityContent) => AvailabilityContent,
  ) => void;

  updateHomeDraft: (updater: (current: HomeContent) => HomeContent) => void;

  updateMenuDraft: (updater: (current: MenuContent) => MenuContent) => void;

  updateRootDraft: (updater: (current: RootContent) => RootContent) => void;

  addClosure: (closure: ClosurePeriod) => void;
  editClosure: (closure: ClosurePeriod) => void;
  deleteClosure: (closureId: string) => void;

  addMeetCancellation: (cancellation: MeetCancellation) => void;
  editMeetCancellation: (cancellation: MeetCancellation) => void;
  deleteMeetCancellation: (cancellationId: string) => void;

  setNewMeetTimes: (meetTimes: string[]) => void;
  setNewBusinessHours: (businessHours: BusinessDayHours[]) => void;

  clearDraft: (file: DraftFileKey) => void;
  clearAllDrafts: () => void;
};

export const DraftContext = createContext<DraftContextValue | null>(null);
