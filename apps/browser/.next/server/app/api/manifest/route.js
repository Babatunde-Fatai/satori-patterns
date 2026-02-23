/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/manifest/route";
exports.ids = ["app/api/manifest/route"];
exports.modules = {

/***/ "(rsc)/./app/api/manifest/route.ts":
/*!***********************************!*\
  !*** ./app/api/manifest/route.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:fs */ \"node:fs\");\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:path */ \"node:path\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nfunction resolveApprovedPath() {\n    const envPath = process.env.APPROVED_PATH;\n    if (envPath) {\n        return node_path__WEBPACK_IMPORTED_MODULE_2___default().isAbsolute(envPath) ? envPath : node_path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), envPath);\n    }\n    // Local dev fallback: data/approved.json copied by prebuild\n    return node_path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), \"data\", \"approved.json\");\n}\nasync function GET() {\n    const approvedPath = resolveApprovedPath();\n    try {\n        const raw = node_fs__WEBPACK_IMPORTED_MODULE_1___default().readFileSync(approvedPath, \"utf8\");\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(JSON.parse(raw));\n    } catch  {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"approved.json not found\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL21hbmlmZXN0L3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUEwQztBQUNsQjtBQUNJO0FBRTVCLFNBQVNHO0lBQ1AsTUFBTUMsVUFBVUMsUUFBUUMsR0FBRyxDQUFDQyxhQUFhO0lBQ3pDLElBQUlILFNBQVM7UUFDWCxPQUFPRiwyREFBZSxDQUFDRSxXQUFXQSxVQUFVRixxREFBUyxDQUFDRyxRQUFRSyxHQUFHLElBQUlOO0lBQ3ZFO0lBQ0EsNERBQTREO0lBQzVELE9BQU9GLHFEQUFTLENBQUNHLFFBQVFLLEdBQUcsSUFBSSxRQUFRO0FBQzFDO0FBRU8sZUFBZUM7SUFDcEIsTUFBTUMsZUFBZVQ7SUFDckIsSUFBSTtRQUNGLE1BQU1VLE1BQU1aLDJEQUFlLENBQUNXLGNBQWM7UUFDMUMsT0FBT1oscURBQVlBLENBQUNlLElBQUksQ0FBQ0MsS0FBS0MsS0FBSyxDQUFDSjtJQUN0QyxFQUFFLE9BQU07UUFDTixPQUFPYixxREFBWUEsQ0FBQ2UsSUFBSSxDQUFDO1lBQUVHLE9BQU87UUFBMEIsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDL0U7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL21hY3VzZXIvRG9jdW1lbnRzL0dpdEh1Yi9zYXRvcmktcGF0dGVybnMvYXBwcy9icm93c2VyL2FwcC9hcGkvbWFuaWZlc3Qvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCJcbmltcG9ydCBmcyBmcm9tIFwibm9kZTpmc1wiXG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCJcblxuZnVuY3Rpb24gcmVzb2x2ZUFwcHJvdmVkUGF0aCgpOiBzdHJpbmcge1xuICBjb25zdCBlbnZQYXRoID0gcHJvY2Vzcy5lbnYuQVBQUk9WRURfUEFUSFxuICBpZiAoZW52UGF0aCkge1xuICAgIHJldHVybiBwYXRoLmlzQWJzb2x1dGUoZW52UGF0aCkgPyBlbnZQYXRoIDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGVudlBhdGgpXG4gIH1cbiAgLy8gTG9jYWwgZGV2IGZhbGxiYWNrOiBkYXRhL2FwcHJvdmVkLmpzb24gY29waWVkIGJ5IHByZWJ1aWxkXG4gIHJldHVybiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCJkYXRhXCIsIFwiYXBwcm92ZWQuanNvblwiKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICBjb25zdCBhcHByb3ZlZFBhdGggPSByZXNvbHZlQXBwcm92ZWRQYXRoKClcbiAgdHJ5IHtcbiAgICBjb25zdCByYXcgPSBmcy5yZWFkRmlsZVN5bmMoYXBwcm92ZWRQYXRoLCBcInV0ZjhcIilcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oSlNPTi5wYXJzZShyYXcpKVxuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJhcHByb3ZlZC5qc29uIG5vdCBmb3VuZFwiIH0sIHsgc3RhdHVzOiA1MDAgfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImZzIiwicGF0aCIsInJlc29sdmVBcHByb3ZlZFBhdGgiLCJlbnZQYXRoIiwicHJvY2VzcyIsImVudiIsIkFQUFJPVkVEX1BBVEgiLCJpc0Fic29sdXRlIiwiam9pbiIsImN3ZCIsIkdFVCIsImFwcHJvdmVkUGF0aCIsInJhdyIsInJlYWRGaWxlU3luYyIsImpzb24iLCJKU09OIiwicGFyc2UiLCJlcnJvciIsInN0YXR1cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/manifest/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmanifest%2Froute&page=%2Fapi%2Fmanifest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmanifest%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Fbrowser%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Fbrowser&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmanifest%2Froute&page=%2Fapi%2Fmanifest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmanifest%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Fbrowser%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Fbrowser&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_macuser_Documents_GitHub_satori_patterns_apps_browser_app_api_manifest_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/manifest/route.ts */ \"(rsc)/./app/api/manifest/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/manifest/route\",\n        pathname: \"/api/manifest\",\n        filename: \"route\",\n        bundlePath: \"app/api/manifest/route\"\n    },\n    resolvedPagePath: \"/Users/macuser/Documents/GitHub/satori-patterns/apps/browser/app/api/manifest/route.ts\",\n    nextConfigOutput,\n    userland: _Users_macuser_Documents_GitHub_satori_patterns_apps_browser_app_api_manifest_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZtYW5pZmVzdCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbWFuaWZlc3QlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZtYW5pZmVzdCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm1hY3VzZXIlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzYXRvcmktcGF0dGVybnMlMkZhcHBzJTJGYnJvd3NlciUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZtYWN1c2VyJTJGRG9jdW1lbnRzJTJGR2l0SHViJTJGc2F0b3JpLXBhdHRlcm5zJTJGYXBwcyUyRmJyb3dzZXImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9c3RhbmRhbG9uZSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNzQztBQUNuSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL21hY3VzZXIvRG9jdW1lbnRzL0dpdEh1Yi9zYXRvcmktcGF0dGVybnMvYXBwcy9icm93c2VyL2FwcC9hcGkvbWFuaWZlc3Qvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwic3RhbmRhbG9uZVwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9tYW5pZmVzdC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL21hbmlmZXN0XCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9tYW5pZmVzdC9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9tYWN1c2VyL0RvY3VtZW50cy9HaXRIdWIvc2F0b3JpLXBhdHRlcm5zL2FwcHMvYnJvd3Nlci9hcHAvYXBpL21hbmlmZXN0L3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmanifest%2Froute&page=%2Fapi%2Fmanifest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmanifest%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Fbrowser%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Fbrowser&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmanifest%2Froute&page=%2Fapi%2Fmanifest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmanifest%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Fbrowser%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Fbrowser&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();