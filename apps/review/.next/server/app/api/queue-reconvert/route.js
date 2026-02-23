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
exports.id = "app/api/queue-reconvert/route";
exports.ids = ["app/api/queue-reconvert/route"];
exports.modules = {

/***/ "(rsc)/./app/api/queue-reconvert/route.ts":
/*!******************************************!*\
  !*** ./app/api/queue-reconvert/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ \"node:path\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:fs */ \"node:fs\");\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst REPO_ROOT = node_path__WEBPACK_IMPORTED_MODULE_1___default().resolve(process.cwd(), \"..\", \"..\");\nfunction readJson(p) {\n    return JSON.parse(node_fs__WEBPACK_IMPORTED_MODULE_2___default().readFileSync(p, \"utf8\"));\n}\nfunction writeJson(p, data) {\n    data.meta.count = data.patterns.length;\n    data.meta.updatedAt = new Date().toISOString();\n    node_fs__WEBPACK_IMPORTED_MODULE_2___default().writeFileSync(p, JSON.stringify(data, null, 2) + \"\\n\", \"utf8\");\n}\nasync function POST(req) {\n    try {\n        const body = await req.json();\n        const { id, reason = \"manual\" } = body;\n        if (!id) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"id required\"\n        }, {\n            status: 400\n        });\n        const compatPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"compatibility.json\");\n        const approvedPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"data\", \"approved.json\");\n        const reconvertPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"data\", \"reconvert-queue.json\");\n        const manifest = readJson(compatPath);\n        if (!manifest.patterns.find((p)=>p.id === id)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: `Pattern \"${id}\" not found`\n            }, {\n                status: 404\n            });\n        }\n        const now = new Date().toISOString();\n        // Remove from approved\n        const approved = readJson(approvedPath);\n        const ai = approved.patterns.findIndex((p)=>p.id === id);\n        if (ai >= 0) {\n            approved.patterns.splice(ai, 1);\n            writeJson(approvedPath, approved);\n        }\n        // Add to queue\n        const queue = readJson(reconvertPath);\n        if (!queue.patterns.some((p)=>p.id === id)) {\n            queue.patterns.push({\n                id,\n                queuedAt: now,\n                reason\n            });\n            writeJson(reconvertPath, queue);\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true\n        });\n    } catch (err) {\n        const msg = err instanceof Error ? err.message : String(err);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: msg\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3F1ZXVlLXJlY29udmVydC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBdUQ7QUFDM0I7QUFDSjtBQUV4QixNQUFNRyxZQUFZRix3REFBWSxDQUFDSSxRQUFRQyxHQUFHLElBQUksTUFBTTtBQUdwRCxTQUFTQyxTQUFZQyxDQUFTO0lBQU8sT0FBT0MsS0FBS0MsS0FBSyxDQUFDUiwyREFBZSxDQUFDTSxHQUFHO0FBQWM7QUFDeEYsU0FBU0ksVUFBeUZKLENBQVMsRUFBRUssSUFBTztJQUNsSEEsS0FBS0MsSUFBSSxDQUFDQyxLQUFLLEdBQUdGLEtBQUtHLFFBQVEsQ0FBQ0MsTUFBTTtJQUN0Q0osS0FBS0MsSUFBSSxDQUFDSSxTQUFTLEdBQUcsSUFBSUMsT0FBT0MsV0FBVztJQUM1Q2xCLDREQUFnQixDQUFDTSxHQUFHQyxLQUFLYSxTQUFTLENBQUNULE1BQU0sTUFBTSxLQUFLLE1BQU07QUFDNUQ7QUFFTyxlQUFlVSxLQUFLQyxHQUFnQjtJQUN6QyxJQUFJO1FBQ0YsTUFBTUMsT0FBTyxNQUFNRCxJQUFJRSxJQUFJO1FBQzNCLE1BQU0sRUFBRUMsRUFBRSxFQUFFQyxTQUFTLFFBQVEsRUFBRSxHQUFHSDtRQUNsQyxJQUFJLENBQUNFLElBQUksT0FBTzNCLHFEQUFZQSxDQUFDMEIsSUFBSSxDQUFDO1lBQUVHLE9BQU87UUFBYyxHQUFHO1lBQUVDLFFBQVE7UUFBSTtRQUUxRSxNQUFNQyxhQUFhOUIscURBQVMsQ0FBQ0UsV0FBVztRQUN4QyxNQUFNOEIsZUFBZWhDLHFEQUFTLENBQUNFLFdBQVcsUUFBUTtRQUNsRCxNQUFNK0IsZ0JBQWdCakMscURBQVMsQ0FBQ0UsV0FBVyxRQUFRO1FBRW5ELE1BQU1nQyxXQUFXNUIsU0FBeUN3QjtRQUMxRCxJQUFJLENBQUNJLFNBQVNuQixRQUFRLENBQUNvQixJQUFJLENBQUMsQ0FBQzVCLElBQU1BLEVBQUVtQixFQUFFLEtBQUtBLEtBQUs7WUFDL0MsT0FBTzNCLHFEQUFZQSxDQUFDMEIsSUFBSSxDQUFDO2dCQUFFRyxPQUFPLENBQUMsU0FBUyxFQUFFRixHQUFHLFdBQVcsQ0FBQztZQUFDLEdBQUc7Z0JBQUVHLFFBQVE7WUFBSTtRQUNqRjtRQUVBLE1BQU1PLE1BQU0sSUFBSWxCLE9BQU9DLFdBQVc7UUFFbEMsdUJBQXVCO1FBQ3ZCLE1BQU1rQixXQUFXL0IsU0FBb0MwQjtRQUNyRCxNQUFNTSxLQUFLRCxTQUFTdEIsUUFBUSxDQUFDd0IsU0FBUyxDQUFDLENBQUNoQyxJQUFNQSxFQUFFbUIsRUFBRSxLQUFLQTtRQUN2RCxJQUFJWSxNQUFNLEdBQUc7WUFBRUQsU0FBU3RCLFFBQVEsQ0FBQ3lCLE1BQU0sQ0FBQ0YsSUFBSTtZQUFJM0IsVUFBVXFCLGNBQWNLO1FBQVU7UUFFbEYsZUFBZTtRQUNmLE1BQU1JLFFBQVFuQyxTQUFzRTJCO1FBQ3BGLElBQUksQ0FBQ1EsTUFBTTFCLFFBQVEsQ0FBQzJCLElBQUksQ0FBQyxDQUFDbkMsSUFBTUEsRUFBRW1CLEVBQUUsS0FBS0EsS0FBSztZQUM1Q2UsTUFBTTFCLFFBQVEsQ0FBQzRCLElBQUksQ0FBQztnQkFBRWpCO2dCQUFJa0IsVUFBVVI7Z0JBQUtUO1lBQU87WUFDaERoQixVQUFVc0IsZUFBZVE7UUFDM0I7UUFFQSxPQUFPMUMscURBQVlBLENBQUMwQixJQUFJLENBQUM7WUFBRW9CLFNBQVM7UUFBSztJQUMzQyxFQUFFLE9BQU9DLEtBQUs7UUFDWixNQUFNQyxNQUFNRCxlQUFlRSxRQUFRRixJQUFJRyxPQUFPLEdBQUdDLE9BQU9KO1FBQ3hELE9BQU8vQyxxREFBWUEsQ0FBQzBCLElBQUksQ0FBQztZQUFFRyxPQUFPbUI7UUFBSSxHQUFHO1lBQUVsQixRQUFRO1FBQUk7SUFDekQ7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL21hY3VzZXIvRG9jdW1lbnRzL0dpdEh1Yi9zYXRvcmktcGF0dGVybnMvYXBwcy9yZXZpZXcvYXBwL2FwaS9xdWV1ZS1yZWNvbnZlcnQvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiXG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCJcbmltcG9ydCBmcyBmcm9tIFwibm9kZTpmc1wiXG5cbmNvbnN0IFJFUE9fUk9PVCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcIi4uXCIsIFwiLi5cIilcblxuaW50ZXJmYWNlIFN0YXRlRmlsZTxUPiB7IF9jb21tZW50Pzogc3RyaW5nOyBtZXRhOiB7IHVwZGF0ZWRBdDogc3RyaW5nOyBjb3VudDogbnVtYmVyIH07IHBhdHRlcm5zOiBUW10gfVxuZnVuY3Rpb24gcmVhZEpzb248VD4ocDogc3RyaW5nKTogVCB7IHJldHVybiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwLCBcInV0ZjhcIikpIGFzIFQgfVxuZnVuY3Rpb24gd3JpdGVKc29uPFQgZXh0ZW5kcyB7IG1ldGE6IHsgdXBkYXRlZEF0OiBzdHJpbmc7IGNvdW50OiBudW1iZXIgfTsgcGF0dGVybnM6IHVua25vd25bXSB9PihwOiBzdHJpbmcsIGRhdGE6IFQpOiB2b2lkIHtcbiAgZGF0YS5tZXRhLmNvdW50ID0gZGF0YS5wYXR0ZXJucy5sZW5ndGhcbiAgZGF0YS5tZXRhLnVwZGF0ZWRBdCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICBmcy53cml0ZUZpbGVTeW5jKHAsIEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDIpICsgXCJcXG5cIiwgXCJ1dGY4XCIpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxLmpzb24oKSBhcyB7IGlkOiBzdHJpbmc7IHJlYXNvbj86IHN0cmluZyB9XG4gICAgY29uc3QgeyBpZCwgcmVhc29uID0gXCJtYW51YWxcIiB9ID0gYm9keVxuICAgIGlmICghaWQpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcImlkIHJlcXVpcmVkXCIgfSwgeyBzdGF0dXM6IDQwMCB9KVxuXG4gICAgY29uc3QgY29tcGF0UGF0aCA9IHBhdGguam9pbihSRVBPX1JPT1QsIFwiY29tcGF0aWJpbGl0eS5qc29uXCIpXG4gICAgY29uc3QgYXBwcm92ZWRQYXRoID0gcGF0aC5qb2luKFJFUE9fUk9PVCwgXCJkYXRhXCIsIFwiYXBwcm92ZWQuanNvblwiKVxuICAgIGNvbnN0IHJlY29udmVydFBhdGggPSBwYXRoLmpvaW4oUkVQT19ST09ULCBcImRhdGFcIiwgXCJyZWNvbnZlcnQtcXVldWUuanNvblwiKVxuXG4gICAgY29uc3QgbWFuaWZlc3QgPSByZWFkSnNvbjx7IHBhdHRlcm5zOiB7IGlkOiBzdHJpbmcgfVtdIH0+KGNvbXBhdFBhdGgpXG4gICAgaWYgKCFtYW5pZmVzdC5wYXR0ZXJucy5maW5kKChwKSA9PiBwLmlkID09PSBpZCkpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBgUGF0dGVybiBcIiR7aWR9XCIgbm90IGZvdW5kYCB9LCB7IHN0YXR1czogNDA0IH0pXG4gICAgfVxuXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG5cbiAgICAvLyBSZW1vdmUgZnJvbSBhcHByb3ZlZFxuICAgIGNvbnN0IGFwcHJvdmVkID0gcmVhZEpzb248U3RhdGVGaWxlPHsgaWQ6IHN0cmluZyB9Pj4oYXBwcm92ZWRQYXRoKVxuICAgIGNvbnN0IGFpID0gYXBwcm92ZWQucGF0dGVybnMuZmluZEluZGV4KChwKSA9PiBwLmlkID09PSBpZClcbiAgICBpZiAoYWkgPj0gMCkgeyBhcHByb3ZlZC5wYXR0ZXJucy5zcGxpY2UoYWksIDEpOyB3cml0ZUpzb24oYXBwcm92ZWRQYXRoLCBhcHByb3ZlZCkgfVxuXG4gICAgLy8gQWRkIHRvIHF1ZXVlXG4gICAgY29uc3QgcXVldWUgPSByZWFkSnNvbjxTdGF0ZUZpbGU8eyBpZDogc3RyaW5nOyBxdWV1ZWRBdDogc3RyaW5nOyByZWFzb246IHN0cmluZyB9Pj4ocmVjb252ZXJ0UGF0aClcbiAgICBpZiAoIXF1ZXVlLnBhdHRlcm5zLnNvbWUoKHApID0+IHAuaWQgPT09IGlkKSkge1xuICAgICAgcXVldWUucGF0dGVybnMucHVzaCh7IGlkLCBxdWV1ZWRBdDogbm93LCByZWFzb24gfSlcbiAgICAgIHdyaXRlSnNvbihyZWNvbnZlcnRQYXRoLCBxdWV1ZSlcbiAgICB9XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiB0cnVlIH0pXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnN0IG1zZyA9IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBtc2cgfSwgeyBzdGF0dXM6IDUwMCB9KVxuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicGF0aCIsImZzIiwiUkVQT19ST09UIiwicmVzb2x2ZSIsInByb2Nlc3MiLCJjd2QiLCJyZWFkSnNvbiIsInAiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJ3cml0ZUpzb24iLCJkYXRhIiwibWV0YSIsImNvdW50IiwicGF0dGVybnMiLCJsZW5ndGgiLCJ1cGRhdGVkQXQiLCJEYXRlIiwidG9JU09TdHJpbmciLCJ3cml0ZUZpbGVTeW5jIiwic3RyaW5naWZ5IiwiUE9TVCIsInJlcSIsImJvZHkiLCJqc29uIiwiaWQiLCJyZWFzb24iLCJlcnJvciIsInN0YXR1cyIsImNvbXBhdFBhdGgiLCJqb2luIiwiYXBwcm92ZWRQYXRoIiwicmVjb252ZXJ0UGF0aCIsIm1hbmlmZXN0IiwiZmluZCIsIm5vdyIsImFwcHJvdmVkIiwiYWkiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJxdWV1ZSIsInNvbWUiLCJwdXNoIiwicXVldWVkQXQiLCJzdWNjZXNzIiwiZXJyIiwibXNnIiwiRXJyb3IiLCJtZXNzYWdlIiwiU3RyaW5nIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/queue-reconvert/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fqueue-reconvert%2Froute&page=%2Fapi%2Fqueue-reconvert%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fqueue-reconvert%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fqueue-reconvert%2Froute&page=%2Fapi%2Fqueue-reconvert%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fqueue-reconvert%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_macuser_Documents_GitHub_satori_patterns_apps_review_app_api_queue_reconvert_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/queue-reconvert/route.ts */ \"(rsc)/./app/api/queue-reconvert/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/queue-reconvert/route\",\n        pathname: \"/api/queue-reconvert\",\n        filename: \"route\",\n        bundlePath: \"app/api/queue-reconvert/route\"\n    },\n    resolvedPagePath: \"/Users/macuser/Documents/GitHub/satori-patterns/apps/review/app/api/queue-reconvert/route.ts\",\n    nextConfigOutput,\n    userland: _Users_macuser_Documents_GitHub_satori_patterns_apps_review_app_api_queue_reconvert_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZxdWV1ZS1yZWNvbnZlcnQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnF1ZXVlLXJlY29udmVydCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnF1ZXVlLXJlY29udmVydCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm1hY3VzZXIlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzYXRvcmktcGF0dGVybnMlMkZhcHBzJTJGcmV2aWV3JTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRm1hY3VzZXIlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzYXRvcmktcGF0dGVybnMlMkZhcHBzJTJGcmV2aWV3JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUM0QztBQUN6SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL21hY3VzZXIvRG9jdW1lbnRzL0dpdEh1Yi9zYXRvcmktcGF0dGVybnMvYXBwcy9yZXZpZXcvYXBwL2FwaS9xdWV1ZS1yZWNvbnZlcnQvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3F1ZXVlLXJlY29udmVydC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3F1ZXVlLXJlY29udmVydFwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcXVldWUtcmVjb252ZXJ0L3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL21hY3VzZXIvRG9jdW1lbnRzL0dpdEh1Yi9zYXRvcmktcGF0dGVybnMvYXBwcy9yZXZpZXcvYXBwL2FwaS9xdWV1ZS1yZWNvbnZlcnQvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fqueue-reconvert%2Froute&page=%2Fapi%2Fqueue-reconvert%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fqueue-reconvert%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fqueue-reconvert%2Froute&page=%2Fapi%2Fqueue-reconvert%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fqueue-reconvert%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();