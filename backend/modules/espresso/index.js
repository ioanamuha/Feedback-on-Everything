"use strict";
const app = require("./initialize");
const { router, middlewares } = require("./src");

exports = module.exports = app;
exports.Router = router;
exports.middlewares = middlewares;
