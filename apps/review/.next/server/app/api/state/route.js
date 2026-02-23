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
exports.id = "app/api/state/route";
exports.ids = ["app/api/state/route"];
exports.modules = {

/***/ "(rsc)/./app/api/state/route.ts":
/*!********************************!*\
  !*** ./app/api/state/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ \"node:path\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:fs */ \"node:fs\");\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst REPO_ROOT = node_path__WEBPACK_IMPORTED_MODULE_1___default().resolve(process.cwd(), \"..\", \"..\");\nfunction readJson(p) {\n    return JSON.parse(node_fs__WEBPACK_IMPORTED_MODULE_2___default().readFileSync(p, \"utf8\"));\n}\nfunction checkThumbnailExists(id) {\n    const thumbPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"apps\", \"browser\", \"public\", \"thumbnails\", `${id}.png`);\n    return node_fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(thumbPath);\n}\nasync function GET() {\n    try {\n        const compatPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"compatibility.json\");\n        const approvedPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"data\", \"approved.json\");\n        const rejectedPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"data\", \"rejected.json\");\n        const reconvertPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"data\", \"reconvert-queue.json\");\n        const manifest = readJson(compatPath);\n        const approved = readJson(approvedPath);\n        const rejected = readJson(rejectedPath);\n        const reconvert = readJson(reconvertPath);\n        const approvedIds = new Set(approved.patterns.map((p)=>p.id));\n        const rejectedIds = new Set(rejected.patterns.map((p)=>p.id));\n        const reconvertIds = new Set(reconvert.patterns.map((p)=>p.id));\n        // Pending = PASS or PARTIAL, not yet in any decision bucket\n        const pending = manifest.patterns.filter((p)=>(p.status === \"PASS\" || p.status === \"PARTIAL\") && !approvedIds.has(p.id) && !rejectedIds.has(p.id) && !reconvertIds.has(p.id)).map((p)=>({\n                ...p,\n                thumbnailExists: checkThumbnailExists(p.id)\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            manifestMeta: manifest.meta,\n            total: manifest.patterns.length,\n            pending,\n            approved: approved.patterns,\n            rejected: rejected.patterns,\n            reconvertQueue: reconvert.patterns,\n            stats: {\n                total: manifest.patterns.length,\n                pendingReview: pending.length,\n                approved: approved.patterns.length,\n                rejected: rejected.patterns.length,\n                inReconvertQueue: reconvert.patterns.length\n            }\n        });\n    } catch (err) {\n        const msg = err instanceof Error ? err.message : String(err);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: msg\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LXBhdHRlcm5zL2FwcHMvcmV2aWV3L2FwcC9hcGkvc3RhdGUvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCJcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIlxuaW1wb3J0IGZzIGZyb20gXCJub2RlOmZzXCJcblxuY29uc3QgUkVQT19ST09UID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwiLi5cIiwgXCIuLlwiKVxuXG5mdW5jdGlvbiByZWFkSnNvbjxUPihwOiBzdHJpbmcpOiBUIHsgcmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHAsIFwidXRmOFwiKSkgYXMgVCB9XG5cbmludGVyZmFjZSBNYW5pZmVzdFBhdHRlcm4ge1xuICBpZDogc3RyaW5nXG4gIG5hbWU6IHN0cmluZ1xuICBjYXRlZ29yeTogc3RyaW5nXG4gIHN0YXR1czogc3RyaW5nXG4gIHNraXBSZWFzb246IHN0cmluZyB8IG51bGxcbiAgcmVuZGVyTWV0aG9kOiBzdHJpbmdcbiAgZmVhdHVyZXM6IHN0cmluZ1tdXG4gIHNhdG9yaVN0eWxlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGxcbiAgc3VpdGFibGVGb3JTb2NpYWxCZzogYm9vbGVhbiB8IG51bGxcbiAgbm90ZXM6IHN0cmluZ1tdXG59XG5cbmludGVyZmFjZSBTdGF0ZUZpbGU8VD4geyBtZXRhOiB7IHVwZGF0ZWRBdDogc3RyaW5nOyBjb3VudDogbnVtYmVyIH07IHBhdHRlcm5zOiBUW10gfVxuXG5mdW5jdGlvbiBjaGVja1RodW1ibmFpbEV4aXN0cyhpZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IHRodW1iUGF0aCA9IHBhdGguam9pbihSRVBPX1JPT1QsIFwiYXBwc1wiLCBcImJyb3dzZXJcIiwgXCJwdWJsaWNcIiwgXCJ0aHVtYm5haWxzXCIsIGAke2lkfS5wbmdgKVxuICByZXR1cm4gZnMuZXhpc3RzU3luYyh0aHVtYlBhdGgpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgY29tcGF0UGF0aCA9IHBhdGguam9pbihSRVBPX1JPT1QsIFwiY29tcGF0aWJpbGl0eS5qc29uXCIpXG4gICAgY29uc3QgYXBwcm92ZWRQYXRoID0gcGF0aC5qb2luKFJFUE9fUk9PVCwgXCJkYXRhXCIsIFwiYXBwcm92ZWQuanNvblwiKVxuICAgIGNvbnN0IHJlamVjdGVkUGF0aCA9IHBhdGguam9pbihSRVBPX1JPT1QsIFwiZGF0YVwiLCBcInJlamVjdGVkLmpzb25cIilcbiAgICBjb25zdCByZWNvbnZlcnRQYXRoID0gcGF0aC5qb2luKFJFUE9fUk9PVCwgXCJkYXRhXCIsIFwicmVjb252ZXJ0LXF1ZXVlLmpzb25cIilcblxuICAgIGNvbnN0IG1hbmlmZXN0ID0gcmVhZEpzb248eyBtZXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyBwYXR0ZXJuczogTWFuaWZlc3RQYXR0ZXJuW10gfT4oY29tcGF0UGF0aClcbiAgICBjb25zdCBhcHByb3ZlZCA9IHJlYWRKc29uPFN0YXRlRmlsZTx7IGlkOiBzdHJpbmcgfT4+KGFwcHJvdmVkUGF0aClcbiAgICBjb25zdCByZWplY3RlZCA9IHJlYWRKc29uPFN0YXRlRmlsZTx7IGlkOiBzdHJpbmcgfT4+KHJlamVjdGVkUGF0aClcbiAgICBjb25zdCByZWNvbnZlcnQgPSByZWFkSnNvbjxTdGF0ZUZpbGU8eyBpZDogc3RyaW5nOyBxdWV1ZWRBdDogc3RyaW5nOyByZWFzb246IHN0cmluZyB9Pj4ocmVjb252ZXJ0UGF0aClcblxuICAgIGNvbnN0IGFwcHJvdmVkSWRzID0gbmV3IFNldChhcHByb3ZlZC5wYXR0ZXJucy5tYXAoKHApID0+IHAuaWQpKVxuICAgIGNvbnN0IHJlamVjdGVkSWRzID0gbmV3IFNldChyZWplY3RlZC5wYXR0ZXJucy5tYXAoKHApID0+IHAuaWQpKVxuICAgIGNvbnN0IHJlY29udmVydElkcyA9IG5ldyBTZXQocmVjb252ZXJ0LnBhdHRlcm5zLm1hcCgocCkgPT4gcC5pZCkpXG5cbiAgICAvLyBQZW5kaW5nID0gUEFTUyBvciBQQVJUSUFMLCBub3QgeWV0IGluIGFueSBkZWNpc2lvbiBidWNrZXRcbiAgICBjb25zdCBwZW5kaW5nID0gbWFuaWZlc3QucGF0dGVybnNcbiAgICAgIC5maWx0ZXIoXG4gICAgICAgIChwKSA9PlxuICAgICAgICAgIChwLnN0YXR1cyA9PT0gXCJQQVNTXCIgfHwgcC5zdGF0dXMgPT09IFwiUEFSVElBTFwiKSAmJlxuICAgICAgICAgICFhcHByb3ZlZElkcy5oYXMocC5pZCkgJiZcbiAgICAgICAgICAhcmVqZWN0ZWRJZHMuaGFzKHAuaWQpICYmXG4gICAgICAgICAgIXJlY29udmVydElkcy5oYXMocC5pZClcbiAgICAgIClcbiAgICAgIC5tYXAoKHApID0+ICh7IC4uLnAsIHRodW1ibmFpbEV4aXN0czogY2hlY2tUaHVtYm5haWxFeGlzdHMocC5pZCkgfSkpXG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgbWFuaWZlc3RNZXRhOiBtYW5pZmVzdC5tZXRhLFxuICAgICAgdG90YWw6IG1hbmlmZXN0LnBhdHRlcm5zLmxlbmd0aCxcbiAgICAgIHBlbmRpbmcsXG4gICAgICBhcHByb3ZlZDogYXBwcm92ZWQucGF0dGVybnMsXG4gICAgICByZWplY3RlZDogcmVqZWN0ZWQucGF0dGVybnMsXG4gICAgICByZWNvbnZlcnRRdWV1ZTogcmVjb252ZXJ0LnBhdHRlcm5zLFxuICAgICAgc3RhdHM6IHtcbiAgICAgICAgdG90YWw6IG1hbmlmZXN0LnBhdHRlcm5zLmxlbmd0aCxcbiAgICAgICAgcGVuZGluZ1JldmlldzogcGVuZGluZy5sZW5ndGgsXG4gICAgICAgIGFwcHJvdmVkOiBhcHByb3ZlZC5wYXR0ZXJucy5sZW5ndGgsXG4gICAgICAgIHJlamVjdGVkOiByZWplY3RlZC5wYXR0ZXJucy5sZW5ndGgsXG4gICAgICAgIGluUmVjb252ZXJ0UXVldWU6IHJlY29udmVydC5wYXR0ZXJucy5sZW5ndGgsXG4gICAgICB9LFxuICAgIH0pXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnN0IG1zZyA9IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBtc2cgfSwgeyBzdGF0dXM6IDUwMCB9KVxuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicGF0aCIsImZzIiwiUkVQT19ST09UIiwicmVzb2x2ZSIsInByb2Nlc3MiLCJjd2QiLCJyZWFkSnNvbiIsInAiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJjaGVja1RodW1ibmFpbEV4aXN0cyIsImlkIiwidGh1bWJQYXRoIiwiam9pbiIsImV4aXN0c1N5bmMiLCJHRVQiLCJjb21wYXRQYXRoIiwiYXBwcm92ZWRQYXRoIiwicmVqZWN0ZWRQYXRoIiwicmVjb252ZXJ0UGF0aCIsIm1hbmlmZXN0IiwiYXBwcm92ZWQiLCJyZWplY3RlZCIsInJlY29udmVydCIsImFwcHJvdmVkSWRzIiwiU2V0IiwicGF0dGVybnMiLCJtYXAiLCJyZWplY3RlZElkcyIsInJlY29udmVydElkcyIsInBlbmRpbmciLCJmaWx0ZXIiLCJzdGF0dXMiLCJoYXMiLCJ0aHVtYm5haWxFeGlzdHMiLCJqc29uIiwibWFuaWZlc3RNZXRhIiwibWV0YSIsInRvdGFsIiwibGVuZ3RoIiwicmVjb252ZXJ0UXVldWUiLCJzdGF0cyIsInBlbmRpbmdSZXZpZXciLCJpblJlY29udmVydFF1ZXVlIiwiZXJyIiwibXNnIiwiRXJyb3IiLCJtZXNzYWdlIiwiU3RyaW5nIiwiZXJyb3IiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/state/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fstate%2Froute&page=%2Fapi%2Fstate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstate%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fstate%2Froute&page=%2Fapi%2Fstate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstate%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_macuser_Documents_GitHub_satori_patterns_apps_review_app_api_state_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/state/route.ts */ \"(rsc)/./app/api/state/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/state/route\",\n        pathname: \"/api/state\",\n        filename: \"route\",\n        bundlePath: \"app/api/state/route\"\n    },\n    resolvedPagePath: \"/Users/macuser/Documents/GitHub/satori-patterns/apps/review/app/api/state/route.ts\",\n    nextConfigOutput,\n    userland: _Users_macuser_Documents_GitHub_satori_patterns_apps_review_app_api_state_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzdGF0ZSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGc3RhdGUlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZzdGF0ZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm1hY3VzZXIlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzYXRvcmktcGF0dGVybnMlMkZhcHBzJTJGcmV2aWV3JTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRm1hY3VzZXIlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzYXRvcmktcGF0dGVybnMlMkZhcHBzJTJGcmV2aWV3JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNrQztBQUMvRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL21hY3VzZXIvRG9jdW1lbnRzL0dpdEh1Yi9zYXRvcmktcGF0dGVybnMvYXBwcy9yZXZpZXcvYXBwL2FwaS9zdGF0ZS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvc3RhdGUvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9zdGF0ZVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvc3RhdGUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvbWFjdXNlci9Eb2N1bWVudHMvR2l0SHViL3NhdG9yaS1wYXR0ZXJucy9hcHBzL3Jldmlldy9hcHAvYXBpL3N0YXRlL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fstate%2Froute&page=%2Fapi%2Fstate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstate%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fstate%2Froute&page=%2Fapi%2Fstate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstate%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();