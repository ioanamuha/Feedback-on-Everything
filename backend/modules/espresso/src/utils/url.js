const sanitizeUrl = (url, method) => {
	const urlParams = url.split("/").slice(1);

	const [lastParam] = urlParams[urlParams.length - 1].split("?");
	urlParams.splice(urlParams.length - 1, 1);

	const allParams = [...urlParams, lastParam].join("/");
	const sanitizedUrl = `/${allParams}/${method.toUpperCase()}`;

	return sanitizedUrl;
};

const isMatch = (route, url) => {
	const routeParts = route.split("/").filter(Boolean);
	const urlParts = url.split("/").filter(Boolean);

	if (routeParts.length !== urlParts.length) return false;

	for (let i = 0; i < routeParts.length; i++) {
		const routePart = routeParts[i];
		const urlPart = urlParts[i];

		if (routePart.startsWith(":")) continue;

		if (routePart === "*") continue;

		if (routePart !== urlPart) {
			return false;
		}
	}

	return true;
};

module.exports = {
	sanitizeUrl,
	isMatch,
};
