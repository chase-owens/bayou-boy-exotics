import type { AvailabilityContent } from '../../../../shared/types/Availability';
import { getJson, type Fetcher } from './getJson';

export const getAvailabilityContent = (fetcher: Fetcher) =>
	getJson<AvailabilityContent>(fetcher, '/data/availability.json');
