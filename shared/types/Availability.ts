export interface AvailabilityContent {
  closures: ClosurePeriod[];
  meetCancellations: MeetCancellation[];
}

export interface ClosurePeriod {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  reason?: string;
}

export interface MeetCancellation {
  id: string;
  date: string;
  times: string[];
  reason?: string;
}
