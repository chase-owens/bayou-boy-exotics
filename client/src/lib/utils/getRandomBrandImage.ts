const getRandomBrandImage = () => {
	const randomNumber = Math.floor(Math.random() * 9);

	switch (randomNumber) {
		case 0:
			return '/images/otter.png';
		case 1:
			return '/images/frog.png';
		case 2:
			return '/images/heron.png';
		case 3:
			return '/images/turtle.png';
		case 4:
			return '/images/raccoon-smoking.png';
		case 5:
			return '/images/garfish.png';
		case 6:
			return '/images/beaver.png';
		case 7:
			return '/images/crawfish.png';
		case 8:
		default:
			return '/images/boar.png';
	}
};

export default getRandomBrandImage;
