const CacheManager = require("./cache-manager-tw");

const myCacheManager =
	(exports =
	module.exports =
		function () {
			if (myCacheManager.instance === null) {
				myCacheManager.instance = new CacheManager();
			}
			return myCacheManager.instance;
		});

myCacheManager.instance = null;
