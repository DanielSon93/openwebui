export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37'),
	() => import('./nodes/38'),
	() => import('./nodes/39'),
	() => import('./nodes/40')
];

export const server_loads = [];

export const dictionary = {
		"/(app)": [8,[2]],
		"/(app)/admin": [9,[2,3]],
		"/(app)/admin/evaluations": [10,[2,3]],
		"/(app)/admin/functions": [11,[2,3]],
		"/(app)/admin/functions/create": [12,[2,3]],
		"/(app)/admin/functions/edit": [13,[2,3]],
		"/(app)/admin/settings": [14,[2,3]],
		"/(app)/admin/users": [15,[2,3]],
		"/auth": [37],
		"/(app)/channels/[id]": [17,[2]],
		"/(app)/c/[id]": [16,[2]],
		"/error": [38],
		"/(app)/home": [18,[2,4]],
		"/(app)/notes": [19,[2,5]],
		"/(app)/notes/[id]": [20,[2,5]],
		"/(app)/playground": [21,[2,6]],
		"/(app)/playground/completions": [22,[2,6]],
		"/s/[id]": [39],
		"/watch": [40],
		"/(app)/workspace": [23,[2,7]],
		"/(app)/workspace/functions/create": [24,[2,7]],
		"/(app)/workspace/knowledge": [25,[2,7]],
		"/(app)/workspace/knowledge/create": [27,[2,7]],
		"/(app)/workspace/knowledge/[id]": [26,[2,7]],
		"/(app)/workspace/models": [28,[2,7]],
		"/(app)/workspace/models/create": [29,[2,7]],
		"/(app)/workspace/models/edit": [30,[2,7]],
		"/(app)/workspace/prompts": [31,[2,7]],
		"/(app)/workspace/prompts/create": [32,[2,7]],
		"/(app)/workspace/prompts/edit": [33,[2,7]],
		"/(app)/workspace/tools": [34,[2,7]],
		"/(app)/workspace/tools/create": [35,[2,7]],
		"/(app)/workspace/tools/edit": [36,[2,7]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.svelte';