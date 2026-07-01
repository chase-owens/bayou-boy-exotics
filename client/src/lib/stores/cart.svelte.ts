import type { CartItem } from '../../../../shared/types/Cart';

const createCart = () => {
	let items = $state<CartItem[]>([]);

	const addItem = (item: Omit<CartItem, 'id'>) => {
		items = [
			...items,
			{
				...item,
				id: crypto.randomUUID()
			}
		];
	};

	const removeItem = (id: string) => {
		items = items.filter((item) => item.id !== id);
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
		addItem,
		removeItem,
		clear
	};
};

export const cart = createCart();
