const { espresso } = require("./src");

const myEspresso =
	(exports =
	module.exports =
		function () {
			if (myEspresso.instance === null) {
				myEspresso.instance = espresso();
			}
			return myEspresso.instance;
		});

myEspresso.instance = null;
