const { match } = require("path-to-regexp");
const { sanitizeUrl } = require("./url");

const RequestDecorator = (routes, request, response, next) => {
	const getParams = () => {
		const url = sanitizeUrl(request.url, request.method);

		for (const path of routes) {
			const urlMatch = match(path, {
				decode: decodeURIComponent,
			});
			const found = urlMatch(url);
			if (found) {
				Object.keys(found.params).forEach((key) => {
					request.params = {
						...request.params,
						[key]: found.params[key],
					};
				});
				break;
			}
		}
	};

	const getQuery = () => {
		const urlParams = request.url.split("/").slice(1);

		const [lastParam, queryString] =
			urlParams[urlParams.length - 1].split("?");
		let params = new URLSearchParams(queryString);
		let entries = params.entries();

		request.query = {
			...request.query,
			...Object.fromEntries(entries),
		};
	};

	const getAuthorizationToken = () => {
		if (!request.headers.authorization) {
			return;
		}

		const authorizationItems = request.headers.authorization.split(" ");
		const bearer = authorizationItems[0];
		if (bearer !== "Bearer" || authorizationItems.length !== 2) {
			return;
		}

		request.token = authorizationItems[1];
	};

	getParams();
	getQuery();
	getAuthorizationToken();
	next();
};

module.exports = RequestDecorator;
