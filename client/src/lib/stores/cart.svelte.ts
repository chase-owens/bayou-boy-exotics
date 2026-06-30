export type CartSelection = {
	optionId: string;
	label: string;
	units: number;
};

export type CartItem = {
	id: string;
	image: string;
	listingId: string;
	listingName: string;
	priceOptionId: string;
	priceLabel: string;
	price: number;
	quantity?: number;
	selections: CartSelection[];
	total?: number;
	units: number;
};

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
