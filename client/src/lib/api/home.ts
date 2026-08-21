import type { HomeContent } from '../../../../shared/types/Home';
import { getJson, type Fetcher } from './getJson';

export const getHomeContent = (fetcher: Fetcher) =>
	getJson<HomeContent>(fetcher, '/data/home.json');
