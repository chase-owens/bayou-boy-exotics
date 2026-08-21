import type { RootContent } from '../../../../shared/types/Root';
import { getJson, type Fetcher } from './getJson';

export const getRootContent = (fetcher: Fetcher) =>
	getJson<RootContent>(fetcher, '/data/root.json');
