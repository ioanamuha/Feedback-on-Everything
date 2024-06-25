const { VERBS } = require("./models");

const Router = () => {
	const routes = new Map();
	const middlewaresForAll = [];

	const getRoutes = () => {
		return routes;
	};

	const getMiddlewaresForAll = () => {
		return middlewaresForAll;
	};

	const use = (path, ...middlewares) => {
		const possiblePaths = [
			path + VERBS.GET,
			path + VERBS.POST,
			path + VERBS.PUT,
			path + VERBS.PATCH,
			path + VERBS.DELETE,
			path + VERBS.OPTIONS,
		];
		possiblePaths.forEach((route) => {
			const middlewaresAndControllers = routes.get(route) || [];

			if (middlewaresAndControllers.length) {
				routes.set(route, [
					...middlewares,
					...middlewaresAndControllers,
				]);
			}
		});
	};

	const useAll = (...middlewares) => {
		middlewaresForAll.push(...middlewares);
	};

	const get = (path, ...handlers) => {
		const internalPath = `${path}${VERBS.GET}`;
		const middlewaresAndControllers = routes.get(internalPath) || [];
		routes.set(internalPath, [...middlewaresAndControllers, ...handlers]);
		// options(path, ...handlers);
	};

	const post = (path, ...handlers) => {
		const internalPath = `${path}${VERBS.POST}`;
		const middlewaresAndControllers = routes.get(internalPath) || [];
		routes.set(internalPath, [...middlewaresAndControllers, ...handlers]);
		// options(path, ...handlers);
	};

	const put = (path, ...handlers) => {
		const internalPath = `${path}${VERBS.PUT}`;
		const middlewaresAndControllers = routes.get(internalPath) || [];
		routes.set(internalPath, [...middlewaresAndControllers, ...handlers]);
		// options(path, ...handlers);
	};

	const patch = (path, ...handlers) => {
		const internalPath = `${path}${VERBS.PATCH}`;
		const middlewaresAndControllers = routes.get(internalPath) || [];
		routes.set(internalPath, [...middlewaresAndControllers, ...handlers]);
		// options(path, ...handlers);
	};

	const del = (path, ...handlers) => {
		const internalPath = `${path}${VERBS.DELETE}`;
		const middlewaresAndControllers = routes.get(internalPath) || [];
		routes.set(internalPath, [...middlewaresAndControllers, ...handlers]);
		// options(path, ...handlers);
	};

	const options = (path, ...handlers) => {
		const internalPath = `${path}${VERBS.OPTIONS}`;
		const middlewaresAndControllers = routes.get(internalPath) || [];
		routes.set(internalPath, [...middlewaresAndControllers, ...handlers]);
	};

	return {
		get,
		post,
		put,
		patch,
		del,
		use,
		useAll,
		getRoutes,
		getMiddlewaresForAll,
	};
};

module.exports = Router;
