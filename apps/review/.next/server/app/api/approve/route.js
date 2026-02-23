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
exports.id = "app/api/approve/route";
exports.ids = ["app/api/approve/route"];
exports.modules = {

/***/ "(rsc)/./app/api/approve/route.ts":
/*!**********************************!*\
  !*** ./app/api/approve/route.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ \"node:path\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:fs */ \"node:fs\");\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n// Next.js dev server sets cwd to the app directory (apps/review/).\n// \".., ..\" resolves to the repo root from there.\nconst REPO_ROOT = node_path__WEBPACK_IMPORTED_MODULE_1___default().resolve(process.cwd(), \"..\", \"..\");\nfunction readJson(p) {\n    return JSON.parse(node_fs__WEBPACK_IMPORTED_MODULE_2___default().readFileSync(p, \"utf8\"));\n}\nfunction writeJson(p, data) {\n    data.meta.count = data.patterns.length;\n    data.meta.updatedAt = new Date().toISOString();\n    node_fs__WEBPACK_IMPORTED_MODULE_2___default().writeFileSync(p, JSON.stringify(data, null, 2) + \"\\n\", \"utf8\");\n}\nasync function POST(req) {\n    try {\n        const { id } = await req.json();\n        if (!id) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"id required\"\n        }, {\n            status: 400\n        });\n        const compatPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"compatibility.json\");\n        const approvedPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"data\", \"approved.json\");\n        const rejectedPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"data\", \"rejected.json\");\n        const reconvertPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"data\", \"reconvert-queue.json\");\n        const manifest = readJson(compatPath);\n        const entry = manifest.patterns.find((p)=>p.id === id);\n        if (!entry) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: `Pattern \"${id}\" not found`\n        }, {\n            status: 404\n        });\n        const now = new Date().toISOString();\n        const approved = readJson(approvedPath);\n        if (!approved.patterns.some((p)=>p.id === id)) {\n            approved.patterns.push({\n                id: entry.id,\n                name: entry.name,\n                category: entry.category,\n                approvedAt: now,\n                satoriStyle: entry.satoriStyle,\n                renderMethod: entry.renderMethod,\n                notes: []\n            });\n            writeJson(approvedPath, approved);\n        }\n        const rejected = readJson(rejectedPath);\n        const ri = rejected.patterns.findIndex((p)=>p.id === id);\n        if (ri >= 0) {\n            rejected.patterns.splice(ri, 1);\n            writeJson(rejectedPath, rejected);\n        }\n        const queue = readJson(reconvertPath);\n        const qi = queue.patterns.findIndex((p)=>p.id === id);\n        if (qi >= 0) {\n            queue.patterns.splice(qi, 1);\n            writeJson(reconvertPath, queue);\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            pattern: {\n                id: entry.id,\n                name: entry.name\n            }\n        });\n    } catch (err) {\n        const msg = err instanceof Error ? err.message : String(err);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: msg\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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MEIsSUFBSSxDQUFDO1lBQUUyQixTQUFTO1lBQU1DLFNBQVM7Z0JBQUU3QixJQUFJVSxNQUFNVixFQUFFO2dCQUFFZ0IsTUFBTU4sTUFBTU0sSUFBSTtZQUFDO1FBQUU7SUFDeEYsRUFBRSxPQUFPYyxLQUFLO1FBQ1osTUFBTUMsTUFBTUQsZUFBZUUsUUFBUUYsSUFBSUcsT0FBTyxHQUFHQyxPQUFPSjtRQUN4RCxPQUFPdkQscURBQVlBLENBQUMwQixJQUFJLENBQUM7WUFBRUMsT0FBTzZCO1FBQUksR0FBRztZQUFFNUIsUUFBUTtRQUFJO0lBQ3pEO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYWN1c2VyL0RvY3VtZW50cy9HaXRIdWIvc2F0b3JpLXBhdHRlcm5zL2FwcHMvcmV2aWV3L2FwcC9hcGkvYXBwcm92ZS9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCJcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIlxuaW1wb3J0IGZzIGZyb20gXCJub2RlOmZzXCJcblxuLy8gTmV4dC5qcyBkZXYgc2VydmVyIHNldHMgY3dkIHRvIHRoZSBhcHAgZGlyZWN0b3J5IChhcHBzL3Jldmlldy8pLlxuLy8gXCIuLiwgLi5cIiByZXNvbHZlcyB0byB0aGUgcmVwbyByb290IGZyb20gdGhlcmUuXG5jb25zdCBSRVBPX1JPT1QgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCIuLlwiLCBcIi4uXCIpXG5cbmludGVyZmFjZSBBcHByb3ZlZFBhdHRlcm4ge1xuICBpZDogc3RyaW5nOyBuYW1lOiBzdHJpbmc7IGNhdGVnb3J5OiBzdHJpbmc7IGFwcHJvdmVkQXQ6IHN0cmluZ1xuICBzYXRvcmlTdHlsZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsOyByZW5kZXJNZXRob2Q6IHN0cmluZzsgbm90ZXM6IHN0cmluZ1tdXG59XG5pbnRlcmZhY2UgU3RhdGVGaWxlPFQ+IHsgX2NvbW1lbnQ/OiBzdHJpbmc7IG1ldGE6IHsgdXBkYXRlZEF0OiBzdHJpbmc7IGNvdW50OiBudW1iZXIgfTsgcGF0dGVybnM6IFRbXSB9XG5cbmZ1bmN0aW9uIHJlYWRKc29uPFQ+KHA6IHN0cmluZyk6IFQgeyByZXR1cm4gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocCwgXCJ1dGY4XCIpKSBhcyBUIH1cbmZ1bmN0aW9uIHdyaXRlSnNvbjxUIGV4dGVuZHMgeyBtZXRhOiB7IHVwZGF0ZWRBdDogc3RyaW5nOyBjb3VudDogbnVtYmVyIH07IHBhdHRlcm5zOiB1bmtub3duW10gfT4ocDogc3RyaW5nLCBkYXRhOiBUKTogdm9pZCB7XG4gIGRhdGEubWV0YS5jb3VudCA9IGRhdGEucGF0dGVybnMubGVuZ3RoXG4gIGRhdGEubWV0YS51cGRhdGVkQXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgZnMud3JpdGVGaWxlU3luYyhwLCBKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKSArIFwiXFxuXCIsIFwidXRmOFwiKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IE5leHRSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBpZCB9ID0gYXdhaXQgcmVxLmpzb24oKSBhcyB7IGlkOiBzdHJpbmcgfVxuICAgIGlmICghaWQpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcImlkIHJlcXVpcmVkXCIgfSwgeyBzdGF0dXM6IDQwMCB9KVxuXG4gICAgY29uc3QgY29tcGF0UGF0aCA9IHBhdGguam9pbihSRVBPX1JPT1QsIFwiY29tcGF0aWJpbGl0eS5qc29uXCIpXG4gICAgY29uc3QgYXBwcm92ZWRQYXRoID0gcGF0aC5qb2luKFJFUE9fUk9PVCwgXCJkYXRhXCIsIFwiYXBwcm92ZWQuanNvblwiKVxuICAgIGNvbnN0IHJlamVjdGVkUGF0aCA9IHBhdGguam9pbihSRVBPX1JPT1QsIFwiZGF0YVwiLCBcInJlamVjdGVkLmpzb25cIilcbiAgICBjb25zdCByZWNvbnZlcnRQYXRoID0gcGF0aC5qb2luKFJFUE9fUk9PVCwgXCJkYXRhXCIsIFwicmVjb252ZXJ0LXF1ZXVlLmpzb25cIilcblxuICAgIGNvbnN0IG1hbmlmZXN0ID0gcmVhZEpzb248eyBwYXR0ZXJuczogeyBpZDogc3RyaW5nOyBuYW1lOiBzdHJpbmc7IGNhdGVnb3J5OiBzdHJpbmc7IHNhdG9yaVN0eWxlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGw7IHJlbmRlck1ldGhvZDogc3RyaW5nIH1bXSB9Pihjb21wYXRQYXRoKVxuICAgIGNvbnN0IGVudHJ5ID0gbWFuaWZlc3QucGF0dGVybnMuZmluZCgocCkgPT4gcC5pZCA9PT0gaWQpXG4gICAgaWYgKCFlbnRyeSkgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IGBQYXR0ZXJuIFwiJHtpZH1cIiBub3QgZm91bmRgIH0sIHsgc3RhdHVzOiA0MDQgfSlcblxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuXG4gICAgY29uc3QgYXBwcm92ZWQgPSByZWFkSnNvbjxTdGF0ZUZpbGU8QXBwcm92ZWRQYXR0ZXJuPj4oYXBwcm92ZWRQYXRoKVxuICAgIGlmICghYXBwcm92ZWQucGF0dGVybnMuc29tZSgocCkgPT4gcC5pZCA9PT0gaWQpKSB7XG4gICAgICBhcHByb3ZlZC5wYXR0ZXJucy5wdXNoKHtcbiAgICAgICAgaWQ6IGVudHJ5LmlkLCBuYW1lOiBlbnRyeS5uYW1lLCBjYXRlZ29yeTogZW50cnkuY2F0ZWdvcnksXG4gICAgICAgIGFwcHJvdmVkQXQ6IG5vdywgc2F0b3JpU3R5bGU6IGVudHJ5LnNhdG9yaVN0eWxlLFxuICAgICAgICByZW5kZXJNZXRob2Q6IGVudHJ5LnJlbmRlck1ldGhvZCwgbm90ZXM6IFtdLFxuICAgICAgfSlcbiAgICAgIHdyaXRlSnNvbihhcHByb3ZlZFBhdGgsIGFwcHJvdmVkKVxuICAgIH1cblxuICAgIGNvbnN0IHJlamVjdGVkID0gcmVhZEpzb248U3RhdGVGaWxlPHsgaWQ6IHN0cmluZyB9Pj4ocmVqZWN0ZWRQYXRoKVxuICAgIGNvbnN0IHJpID0gcmVqZWN0ZWQucGF0dGVybnMuZmluZEluZGV4KChwKSA9PiBwLmlkID09PSBpZClcbiAgICBpZiAocmkgPj0gMCkgeyByZWplY3RlZC5wYXR0ZXJucy5zcGxpY2UocmksIDEpOyB3cml0ZUpzb24ocmVqZWN0ZWRQYXRoLCByZWplY3RlZCkgfVxuXG4gICAgY29uc3QgcXVldWUgPSByZWFkSnNvbjxTdGF0ZUZpbGU8eyBpZDogc3RyaW5nIH0+PihyZWNvbnZlcnRQYXRoKVxuICAgIGNvbnN0IHFpID0gcXVldWUucGF0dGVybnMuZmluZEluZGV4KChwKSA9PiBwLmlkID09PSBpZClcbiAgICBpZiAocWkgPj0gMCkgeyBxdWV1ZS5wYXR0ZXJucy5zcGxpY2UocWksIDEpOyB3cml0ZUpzb24ocmVjb252ZXJ0UGF0aCwgcXVldWUpIH1cblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IHRydWUsIHBhdHRlcm46IHsgaWQ6IGVudHJ5LmlkLCBuYW1lOiBlbnRyeS5uYW1lIH0gfSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc3QgbXNnID0gZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFN0cmluZyhlcnIpXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IG1zZyB9LCB7IHN0YXR1czogNTAwIH0pXG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwYXRoIiwiZnMiLCJSRVBPX1JPT1QiLCJyZXNvbHZlIiwicHJvY2VzcyIsImN3ZCIsInJlYWRKc29uIiwicCIsIkpTT04iLCJwYXJzZSIsInJlYWRGaWxlU3luYyIsIndyaXRlSnNvbiIsImRhdGEiLCJtZXRhIiwiY291bnQiLCJwYXR0ZXJucyIsImxlbmd0aCIsInVwZGF0ZWRBdCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsIndyaXRlRmlsZVN5bmMiLCJzdHJpbmdpZnkiLCJQT1NUIiwicmVxIiwiaWQiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJjb21wYXRQYXRoIiwiam9pbiIsImFwcHJvdmVkUGF0aCIsInJlamVjdGVkUGF0aCIsInJlY29udmVydFBhdGgiLCJtYW5pZmVzdCIsImVudHJ5IiwiZmluZCIsIm5vdyIsImFwcHJvdmVkIiwic29tZSIsInB1c2giLCJuYW1lIiwiY2F0ZWdvcnkiLCJhcHByb3ZlZEF0Iiwic2F0b3JpU3R5bGUiLCJyZW5kZXJNZXRob2QiLCJub3RlcyIsInJlamVjdGVkIiwicmkiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJxdWV1ZSIsInFpIiwic3VjY2VzcyIsInBhdHRlcm4iLCJlcnIiLCJtc2ciLCJFcnJvciIsIm1lc3NhZ2UiLCJTdHJpbmciXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/approve/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fapprove%2Froute&page=%2Fapi%2Fapprove%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fapprove%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fapprove%2Froute&page=%2Fapi%2Fapprove%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fapprove%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_macuser_Documents_GitHub_satori_patterns_apps_review_app_api_approve_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/approve/route.ts */ \"(rsc)/./app/api/approve/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/approve/route\",\n        pathname: \"/api/approve\",\n        filename: \"route\",\n        bundlePath: \"app/api/approve/route\"\n    },\n    resolvedPagePath: \"/Users/macuser/Documents/GitHub/satori-patterns/apps/review/app/api/approve/route.ts\",\n    nextConfigOutput,\n    userland: _Users_macuser_Documents_GitHub_satori_patterns_apps_review_app_api_approve_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhcHByb3ZlJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhcHByb3ZlJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYXBwcm92ZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm1hY3VzZXIlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzYXRvcmktcGF0dGVybnMlMkZhcHBzJTJGcmV2aWV3JTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRm1hY3VzZXIlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzYXRvcmktcGF0dGVybnMlMkZhcHBzJTJGcmV2aWV3JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNvQztBQUNqSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL21hY3VzZXIvRG9jdW1lbnRzL0dpdEh1Yi9zYXRvcmktcGF0dGVybnMvYXBwcy9yZXZpZXcvYXBwL2FwaS9hcHByb3ZlL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hcHByb3ZlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXBwcm92ZVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXBwcm92ZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9tYWN1c2VyL0RvY3VtZW50cy9HaXRIdWIvc2F0b3JpLXBhdHRlcm5zL2FwcHMvcmV2aWV3L2FwcC9hcGkvYXBwcm92ZS9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fapprove%2Froute&page=%2Fapi%2Fapprove%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fapprove%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fapprove%2Froute&page=%2Fapi%2Fapprove%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fapprove%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();