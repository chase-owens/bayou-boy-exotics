import type { MenuContent } from '../../../../shared/types/Menu';
import { getJson, type Fetcher } from './getJson';

export const getMenuContent = (fetcher: Fetcher) =>
	getJson<MenuContent>(fetcher, '/data/menu.json');
