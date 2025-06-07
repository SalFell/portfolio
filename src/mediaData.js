// Import all images from CrabDash folder using Vite's import.meta.glob
/** @type {Record<string, { default: string }>} */
const crabImages = import.meta.glob('./assets/CrabDash/*.{png,jpg,jpeg,svg}', { eager: true });

const crabs = Object.values(crabImages).map(mod => mod.default);

export const mediaCrabDash = [
		{
			id: 0,
			name: "Crab Dash Title",
			imgurl: crabs.at(3),
			attribution: "",
		},
		{
			id: 1,
			name: "Wave",
			imgurl: crabs.at(4),
			attribution: "",
		},
		{
			id: 2,
			name: "Grid",
			imgurl: crabs.at(2),
			attribution: "",
		},
		{
			id: 3,
			name: "Food",
			imgurl: crabs.at(1),
			attribution: "",
		},
		{
			id: 4,
			name: "Enemy that stuns",
			imgurl: crabs.at(0),
			attribution: "",
		},
	];