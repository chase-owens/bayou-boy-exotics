// import type { HomeContent } from '../../../shared/types/Home.ts';
// import homeData from '$lib/data/home.json';
// import type { PageLoad } from './$types';
// const fallbackContent = homeData as unknown as HomeContent;

// export const load: PageLoad = async ({ fetch }) => {
// 	if (import.meta.env.VITE_IS_MOCK === 'true') {
// 		return { home: fallbackContent };
// 	}

// 	const response = await fetch('/data/home.json');

// 	if (!response.ok) {
// 		throw new Error('Unable to load home content.');
// 	}

// 	const home = (await response.json()) as unknown as HomeContent;

// 	return {
// 		home
// 	};
// };
