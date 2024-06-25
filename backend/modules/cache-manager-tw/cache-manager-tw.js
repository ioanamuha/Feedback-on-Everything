class CacheManagerTW {
	constructor() {
		this.cache = new Map();
		this.defaultTTL = 1000 * 60; // 60 seconds

		setInterval(() => this.cleanUp(), 1000 * 60); // run an auto clean up every 60 seconds
	}

	set(key, value, ttl = this.defaultTTL) {
		const expireDate = Date.now() + ttl;
		this.cache.set(key, { expireDate: expireDate, value: value });
	}

	get(key) {
		const cacheItem = this.cache.get(key);
		if (!cacheItem) {
			return undefined;
		}

		if (cacheItem.expireDate < Date.now()) {
			this.delete(key);
			return undefined;
		}

		return cacheItem.value;
	}

	delete(key) {
		this.cache.delete(key);
	}

	cleanUp() {
		const now = Date.now();
		for (const [key, cacheItem] of this.cache.entries()) {
			if (cacheItem.expireDate < now) {
				this.delete(key);
			}
		}
	}
}

module.exports = CacheManagerTW;
