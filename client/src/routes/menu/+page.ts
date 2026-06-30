// import { error } from '@sveltejs/kit';

import menuContent from '$lib/data/menu.json';
import type { MenuContent } from '../../../../shared/types/Menu';
import type { PageLoad } from '../$types';
const fallbackMenu = menuContent as unknown as MenuContent;

export const load: PageLoad = async () => {
	if (import.meta.env.VITE_IS_MOCK === 'true') {
		return { menu: fallbackMenu };
	}

	return { menu: fallbackMenu };
};
