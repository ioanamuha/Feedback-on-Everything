const { createServer } = require("http");

const utils = require("./utils");
const { VERBS } = require("./models");

const Espresso = () => {
	const routes = new Map();
	const createMyServer = () => createServer(serverHandler.bind(this));
	const middlewaresForAll = [];

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

	const useRouter = (path, router) => {
		const routerRoutes = router.getRoutes();
		const middlewaresFromRouter = router.getMiddlewaresForAll();
		const existentHandlers = routes.get(path) || [];
		routerRoutes.forEach((middlewares, key) => {
			routes.set(`${path + key}`, [
				...existentHandlers,
				...middlewaresFromRouter,
				...middlewares,
			]);
		});
	};

	const matchUrl = (sanitizedUrl) => {
		for (const path of routes.keys()) {
			if (utils.url.isMatch(path, sanitizedUrl)) {
				return path;
			}
		}
		return false;
	};

	const dispatchChain = (request, response, middlewares) => {
		return invokeMiddlewares(request, response, middlewares);
	};

	const invokeMiddlewares = async (request, response, middlewares) => {
		if (!middlewares || !middlewares.length) return;

		let offset = 0;
		let currentMiddleware = middlewares[offset];

		// In case of conditional middleware
		if (typeof currentMiddleware !== "function") {
			offset = 1;
			currentMiddleware = middlewares[offset];
		}

		if (typeof currentMiddleware !== "function") {
			throw new TypeError("Middleware must be a function");
		}

		return currentMiddleware(request, response, async () => {
			await invokeMiddlewares(
				request,
				response,
				middlewares.slice(offset + 1)
			);
		});
	};

	const serverHandler = async (request, response) => {
		// for preflight requests
		if (request.method === "OPTIONS") {
			const headers = {
				"Access-Control-Allow-Origin": "http://127.0.0.1:5500",
				"Access-Control-Allow-Methods":
					"OPTIONS, POST, GET, PATCH, DELETE, PUT, HEAD",
				"Access-Control-Allow-Headers": "content-type,authorization",
			};
			response.writeHead(204, headers);
			response.end();
			return;
		}

		const sanitizedUrl = utils.url.sanitizeUrl(request.url, request.method);

		const match = matchUrl(sanitizedUrl);

		if (match) {
			const middlewaresAndControllers = routes.get(match);
			await dispatchChain(request, response, [
				utils.requestDecorator.bind(null, routes.keys()),
				utils.responseDecorator,
				...middlewaresForAll,
				...middlewaresAndControllers,
			]);
		} else {
			response.statusCode = 404;
			response.end("Endpoint not found :(");
		}
	};

	const run = (port, hostname) => {
		const server = createMyServer();
		server.listen(port, hostname);
	};

	return {
		run,
		get,
		post,
		patch,
		put,
		del,
		use,
		useAll,
		useRouter,
	};
};

module.exports = Espresso;
