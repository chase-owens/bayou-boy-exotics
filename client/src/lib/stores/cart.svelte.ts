import type { CartItem } from '../../../../shared/types/Cart';

export type CartStatus = 'idle' | 'adding' | 'success';

const createCart = () => {
	let items = $state<CartItem[]>([]);
	let status = $state<CartStatus>('idle');
	let resetTimer: ReturnType<typeof setTimeout>;

	const hasItem = (listingId: string, priceOptionId?: string) => {
		return items.some((item) =>
			item.listingId === listingId && priceOptionId ? item.priceOptionId === priceOptionId : false
		);
	};

	const getItem = (listingId: string, priceOptionId?: string) => {
		return items.find((item) => {
			if (item.listingId !== listingId) return false;

			if (priceOptionId) {
				return item.priceOptionId === priceOptionId;
			}

			return !item.priceOptionId;
		});
	};

	const addItem = (item: Omit<CartItem, 'id'>) => {
		clearTimeout(resetTimer);

		status = 'adding';

		setTimeout(() => {
			items = [
				...items,
				{
					...item,
					id: crypto.randomUUID()
				}
			];

			status = 'success';

			resetTimer = setTimeout(() => {
				status = 'idle';
			}, 2100);
		}, 250);
	};

	const removeItem = (id: string) => {
		items = items.filter((item) => item.id !== id);
	};

	const updateItem = (id: string, updates: Omit<CartItem, 'id'>) => {
		items = items.map((item) => (item.id === id ? { ...updates, id: item.id } : item));

		status = 'success';

		clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			status = 'idle';
		}, 2100);
	};

	const clear = () => {
		items = [];
	};

	return {
		get items() {
			return items;
		},
		get count() {
			return items.length;
		},
		get total() {
			return items.reduce((sum, item) => sum + (item.total ?? item.price), 0);
		},
		get status() {
			return status;
		},
		addItem,
		clear,
		getItem,
		hasItem,
		removeItem,
		updateItem
	};
};

export const cart = createCart();
