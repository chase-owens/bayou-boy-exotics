import { useMemo, useState } from "react";
import { CalendarX2, Clock3, Store } from "lucide-react";
import { format, parse } from "date-fns";
import { DayPicker, type DateRange } from "react-day-picker";

import PageHeader from "../components/layout/PageHeader";
import DataCard from "../components/ui/DataCard";
import { useDraft } from "../context/draft/useDraft";
import type {
  ClosurePeriod,
  MeetCancellation,
} from "../../../shared/types/Availability";

const formatTime = (time?: string) => {
  if (!time) return "";

  return format(parse(time, "HH:mm", new Date()), "h:mm a");
};

const getCancellationId = (date: string) =>
  `${date}-cancel-${crypto.randomUUID()}`;

const calendarClassNames = {
  root: "relative w-full",
  months: "w-full",
  month: "flex w-full flex-col",
  month_caption: "mb-2",
  caption_label: "font-display text-2xl text-white",
  nav: "absolute right-0 top-1 flex gap-1",
  button_previous:
    "flex size-6 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/20",
  button_next:
    "flex size-6 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/20",
  month_grid: "w-full border-collapse",
  weekdays: "border-b border-white/15",
  weekday:
    "py-3 text-center text-xs font-semibold uppercase tracking-wide text-white/60",
  week: "border-b border-white/15 last:border-b-0",
  day: "border-r border-white/15 last:border-r-0",
  day_button:
    "flex aspect-square w-full items-center justify-center text-sm font-semibold text-white transition hover:bg-white/10",
};

export default function MeetTimes() {
  const {
    availability,
    root,
    addClosure,
    editClosure,
    deleteClosure,
    addMeetCancellation,
    editMeetCancellation,
    deleteMeetCancellation,
    // setNewMeetTimes,
    // setNewBusinessHours,
  } = useDraft();

  const [closureMonth, setClosureMonth] = useState(new Date());
  const [isAddingClosure, setIsAddingClosure] = useState(false);
  const [editingClosureId, setEditingClosureId] = useState<string | null>(null);
  const [closureTitle, setClosureTitle] = useState("");
  const [closureMessage, setClosureMessage] = useState("");
  const [closureRange, setClosureRange] = useState<DateRange>();

  const [isEditingCancellation, setIsEditingCancellation] = useState(false);
  const [editingCancellationId, setEditingCancellationId] = useState<
    string | null
  >(null);
  const [cancellationDate, setCancellationDate] = useState("");
  const [cancelledTimes, setCancelledTimes] = useState<string[]>([]);

  const currentMeetTimes = root?.business.hours.meetSchedule.defaultTimes ?? [];

  const currentBusinessHours = root?.business.hours.schedule ?? [];

  const closureRanges = useMemo(
    () =>
      (availability?.closures ?? []).map((closure) => ({
        from: new Date(closure.startsAt),
        to: new Date(closure.endsAt),
      })),
    [availability?.closures],
  );

  const resetClosureEditor = () => {
    setIsAddingClosure(false);
    setEditingClosureId(null);
    setClosureTitle("");
    setClosureMessage("");
    setClosureRange(undefined);
  };

  const startAddingClosure = () => {
    setEditingClosureId(null);
    setClosureTitle("");
    setClosureMessage("");
    setClosureRange(undefined);
    setIsAddingClosure(true);
  };

  const handleEditClosure = (closure: ClosurePeriod) => {
    setEditingClosureId(closure.id);
    setClosureTitle(closure.title);
    setClosureMessage(closure.message ?? "");
    setClosureRange({
      from: new Date(closure.startsAt),
      to: new Date(closure.endsAt),
    });
    setClosureMonth(new Date(closure.startsAt));
    setIsAddingClosure(true);
  };

  const handleSaveClosure = () => {
    if (!closureRange?.from || !closureRange.to || !closureTitle.trim()) {
      return;
    }

    const nextClosure: ClosurePeriod = {
      id: editingClosureId ?? crypto.randomUUID(),
      title: closureTitle.trim(),
      startsAt: closureRange.from.toISOString(),
      endsAt: closureRange.to.toISOString(),
      message: closureMessage.trim() || undefined,
    };

    if (editingClosureId) {
      editClosure(nextClosure);
    } else {
      addClosure(nextClosure);
    }

    resetClosureEditor();
  };

  const resetCancellationEditor = () => {
    setIsEditingCancellation(false);
    setEditingCancellationId(null);
    setCancellationDate("");
    setCancelledTimes([]);
  };

  const startAddingCancellation = () => {
    setEditingCancellationId(null);
    setCancellationDate("");
    setCancelledTimes([]);
    setIsEditingCancellation(true);
  };

  const handleEditCancellation = (cancellation: MeetCancellation) => {
    setEditingCancellationId(cancellation.id);
    setCancellationDate(cancellation.date);
    setCancelledTimes(cancellation.times);
    setIsEditingCancellation(true);
  };

  const toggleCancellationTime = (time: string) => {
    setCancelledTimes((current) =>
      current.includes(time)
        ? current.filter((value) => value !== time)
        : [...current, time],
    );
  };

  const handleSaveCancellation = () => {
    if (!cancellationDate || cancelledTimes.length === 0) {
      return;
    }

    const nextCancellation: MeetCancellation = {
      id: editingCancellationId ?? getCancellationId(cancellationDate),
      date: cancellationDate,
      times: [...cancelledTimes].sort(),
    };

    if (editingCancellationId) {
      editMeetCancellation(nextCancellation);
    } else {
      addMeetCancellation(nextCancellation);
    }

    resetCancellationEditor();
  };

  return (
    <>
      <PageHeader
        eyebrow="Meet Times"
        title="Manage Availability"
        description="Manage meet times, cancellations, closures, and business hours."
      />

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:flex-wrap">
        <DataCard
          eyebrow={isAddingClosure ? "Time Off" : "Closure Calendar"}
          icon={CalendarX2}
          className="w-full sm:min-w-[320px] sm:flex-1"
        >
          {isAddingClosure ? (
            <div className="space-y-4">
              <div>
                <label className="admin-label text-white">Title</label>

                <input
                  type="text"
                  value={closureTitle}
                  onChange={(event) => setClosureTitle(event.target.value)}
                  placeholder="Anniversary Vacation"
                  className="admin-input mt-2"
                />
              </div>

              <DayPicker
                mode="range"
                month={closureMonth}
                onMonthChange={setClosureMonth}
                selected={closureRange}
                onSelect={setClosureRange}
                disabled={{ before: new Date() }}
                classNames={calendarClassNames}
                modifiersClassNames={{
                  range_start:
                    "border-2 border-highlight bg-highlight/25 text-white",
                  range_middle: "bg-highlight/20 text-white",
                  range_end:
                    "border-2 border-highlight bg-highlight/25 text-white",
                  selected: "bg-highlight/20 text-white",
                }}
              />

              {closureRange?.from && (
                <div className="text-sm font-semibold text-white">
                  {format(closureRange.from, "MMM d, yyyy")}

                  {closureRange.to && (
                    <>
                      {" "}
                      <span className="text-white/50">–</span>{" "}
                      {format(closureRange.to, "MMM d, yyyy")}
                    </>
                  )}
                </div>
              )}

              <div>
                <label className="admin-label text-white">Description</label>

                <textarea
                  value={closureMessage}
                  onChange={(event) => setClosureMessage(event.target.value)}
                  placeholder="Out of town and unavailable..."
                  className="admin-input mt-2 min-h-24 resize-y"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveClosure}
                  disabled={
                    !closureTitle.trim() ||
                    !closureRange?.from ||
                    !closureRange.to
                  }
                  className="rounded-vintage border border-accent px-4 py-2 text-sm font-semibold text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editingClosureId ? "Save Time Off" : "Schedule Time Off"}
                </button>

                <button
                  type="button"
                  onClick={resetClosureEditor}
                  className="rounded-vintage border border-white/20 px-4 py-2 text-sm font-semibold text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <DayPicker
                month={closureMonth}
                onMonthChange={setClosureMonth}
                modifiers={{
                  closed: closureRanges,
                }}
                classNames={calendarClassNames}
                modifiersClassNames={{
                  closed: "bg-highlight text-white",
                }}
              />

              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="divide-y divide-white/10">
                  {(availability?.closures ?? []).map((closure) => (
                    <div
                      key={closure.id}
                      className="flex items-start justify-between gap-4 py-3 first:pt-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {closure.title}
                        </p>

                        <p className="mt-1 text-xs text-white/70">
                          {format(new Date(closure.startsAt), "MMM d")} –{" "}
                          {format(new Date(closure.endsAt), "MMM d")}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditClosure(closure)}
                          className="text-xs font-semibold text-accent"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteClosure(closure.id)}
                          className="text-xs font-semibold text-highlight"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={startAddingClosure}
                  className="mt-4 rounded-vintage border border-accent px-4 py-2 text-sm font-semibold text-accent"
                >
                  Add Time Off
                </button>
              </div>
            </>
          )}
        </DataCard>

        <DataCard
          eyebrow={
            isEditingCancellation ? "Cancel Meet Times" : "Meet Schedule"
          }
          icon={Clock3}
          className="w-full sm:min-w-[320px] sm:flex-1"
        >
          {isEditingCancellation ? (
            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wide text-white/70">
                Date
              </label>

              <input
                type="date"
                value={cancellationDate}
                onChange={(event) => setCancellationDate(event.target.value)}
                className="mt-2 block rounded-vintage border border-white/20 bg-white/10 px-2 py-1.5 text-sm text-white"
              />

              <div className="mt-4 divide-y divide-white/10 border-t border-white/10">
                {currentMeetTimes.map((time) => (
                  <label
                    key={time}
                    className="flex cursor-pointer items-center justify-between gap-3 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={cancelledTimes.includes(time)}
                        onChange={() => toggleCancellationTime(time)}
                        className="size-4 accent-accent"
                      />

                      <span className="text-sm font-semibold text-white">
                        {formatTime(time)}
                      </span>
                    </div>

                    {cancelledTimes.includes(time) && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-highlight">
                        Cancelled
                      </span>
                    )}
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveCancellation}
                  disabled={!cancellationDate || cancelledTimes.length === 0}
                  className="rounded-vintage border border-accent px-4 py-2 text-sm font-semibold text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={resetCancellationEditor}
                  className="rounded-vintage border border-white/20 px-4 py-2 text-sm font-semibold text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-5 divide-y divide-white/10">
                {currentMeetTimes.map((time) => (
                  <div
                    key={time}
                    className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm font-semibold text-white">
                      {formatTime(time)}
                    </span>
                  </div>
                ))}
              </div>

              {(availability?.meetCancellations ?? []).length > 0 && (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="divide-y divide-white/10">
                    {(availability?.meetCancellations ?? []).map(
                      (cancellation) => (
                        <div
                          key={cancellation.id}
                          className="flex items-start justify-between gap-4 py-3 first:pt-0"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">
                              {format(
                                parse(
                                  cancellation.date,
                                  "yyyy-MM-dd",
                                  new Date(),
                                ),
                                "MMM d",
                              )}
                            </p>

                            <p className="mt-1 text-xs text-white/70">
                              {cancellation.times
                                .map((time) => formatTime(time))
                                .join(", ")}
                            </p>
                          </div>

                          <div className="flex shrink-0 gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleEditCancellation(cancellation)
                              }
                              className="text-xs font-semibold text-accent"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteMeetCancellation(cancellation.id)
                              }
                              className="text-xs font-semibold text-highlight"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={startAddingCancellation}
                className="mt-4 rounded-vintage border border-accent px-4 py-2 text-sm font-semibold text-accent"
              >
                Cancel Some Meet Times
              </button>
            </>
          )}
        </DataCard>

        <DataCard
          eyebrow="Business Hours"
          icon={Store}
          className="w-full sm:min-w-[320px] sm:flex-1"
        >
          <div className="mt-5 divide-y divide-white/10">
            {currentBusinessHours.map((hours) => (
              <div
                key={hours.day}
                className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="text-sm font-semibold text-white">
                  {hours.day}
                </span>

                <span className="text-sm text-white/80">
                  {hours.closed
                    ? "Closed"
                    : `${formatTime(hours.opensAt)} – ${formatTime(
                        hours.closesAt,
                      )}`}
                </span>
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </>
  );
}
