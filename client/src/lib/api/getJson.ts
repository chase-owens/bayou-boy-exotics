export type Fetcher = typeof fetch;

export const getJson = async <T>(fetcher: Fetcher, path: string): Promise<T> => {
	const response = await fetcher(path);

	if (!response.ok) {
		throw new Error(`Failed to load ${path}`);
	}

	return response.json() as Promise<T>;
};
