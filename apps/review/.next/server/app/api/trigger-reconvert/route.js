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
exports.id = "app/api/trigger-reconvert/route";
exports.ids = ["app/api/trigger-reconvert/route"];
exports.modules = {

/***/ "(rsc)/./app/api/trigger-reconvert/route.ts":
/*!********************************************!*\
  !*** ./app/api/trigger-reconvert/route.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ \"node:path\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:fs */ \"node:fs\");\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:child_process */ \"node:child_process\");\n/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nconst REPO_ROOT = node_path__WEBPACK_IMPORTED_MODULE_1___default().resolve(process.cwd(), \"..\", \"..\");\nfunction readJson(p) {\n    return JSON.parse(node_fs__WEBPACK_IMPORTED_MODULE_2___default().readFileSync(p, \"utf8\"));\n}\nfunction writeJson(p, data) {\n    data.meta.count = data.patterns.length;\n    data.meta.updatedAt = new Date().toISOString();\n    node_fs__WEBPACK_IMPORTED_MODULE_2___default().writeFileSync(p, JSON.stringify(data, null, 2) + \"\\n\", \"utf8\");\n}\nasync function POST() {\n    const reconvertPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"data\", \"reconvert-queue.json\");\n    const diffReportPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"scripts\", \"diff-report.json\");\n    const queue = readJson(reconvertPath);\n    if (queue.patterns.length === 0) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            skipped: true,\n            reason: \"queue is empty\"\n        });\n    }\n    const ids = queue.patterns.map((p)=>p.id);\n    // Write a temporary diff-report.json containing only queued IDs\n    const diffReport = {\n        added: [],\n        modified: ids,\n        removed: [],\n        upstreamCommit: \"reconvert-trigger\",\n        localCommit: \"reconvert-trigger\",\n        date: new Date().toISOString()\n    };\n    node_fs__WEBPACK_IMPORTED_MODULE_2___default().writeFileSync(diffReportPath, JSON.stringify(diffReport, null, 2) + \"\\n\", \"utf8\");\n    // Run the pipeline steps\n    const cmd = \"npm run pipeline:translate -- --only-changed && npm run pipeline:render -- --only-changed && npm run build:index\";\n    const log = [];\n    await new Promise((resolve, reject)=>{\n        const child = (0,node_child_process__WEBPACK_IMPORTED_MODULE_3__.spawn)(\"sh\", [\n            \"-c\",\n            cmd\n        ], {\n            cwd: REPO_ROOT,\n            env: process.env\n        });\n        child.stdout.on(\"data\", (chunk)=>{\n            log.push(chunk.toString());\n        });\n        child.stderr.on(\"data\", (chunk)=>{\n            log.push(chunk.toString());\n        });\n        child.on(\"close\", (code)=>{\n            if (code === 0) resolve();\n            else reject(new Error(`Pipeline exited with code ${code}`));\n        });\n    }).catch((err)=>{\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            log: log.join(\"\"),\n            error: err.message\n        }, {\n            status: 500\n        });\n    });\n    // After reconversion, remove successfully re-rendered patterns from the queue.\n    // A pattern is considered processed if it now has status PASS or PARTIAL in the manifest.\n    const compatPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(REPO_ROOT, \"compatibility.json\");\n    const manifest = readJson(compatPath);\n    const updatedQueue = readJson(reconvertPath);\n    const remaining = updatedQueue.patterns.filter((entry)=>{\n        const m = manifest.patterns.find((p)=>p.id === entry.id);\n        // Keep in queue if manifest still shows FAIL/SILENT_FAIL/UNCLASSIFIED\n        if (!m) return true;\n        return m.status !== \"PASS\" && m.status !== \"PARTIAL\";\n    });\n    updatedQueue.patterns = remaining;\n    writeJson(reconvertPath, updatedQueue);\n    const processed = ids.length - remaining.length;\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        success: true,\n        processed,\n        log: log.join(\"\")\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3RyaWdnZXItcmVjb252ZXJ0L3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQTBDO0FBQ2Q7QUFDSjtBQUNrQjtBQUUxQyxNQUFNSSxZQUFZSCx3REFBWSxDQUFDSyxRQUFRQyxHQUFHLElBQUksTUFBTTtBQU9wRCxTQUFTQyxTQUFZQyxDQUFTO0lBQU8sT0FBT0MsS0FBS0MsS0FBSyxDQUFDVCwyREFBZSxDQUFDTyxHQUFHO0FBQWM7QUFDeEYsU0FBU0ksVUFBeUZKLENBQVMsRUFBRUssSUFBTztJQUNsSEEsS0FBS0MsSUFBSSxDQUFDQyxLQUFLLEdBQUdGLEtBQUtHLFFBQVEsQ0FBQ0MsTUFBTTtJQUN0Q0osS0FBS0MsSUFBSSxDQUFDSSxTQUFTLEdBQUcsSUFBSUMsT0FBT0MsV0FBVztJQUM1Q25CLDREQUFnQixDQUFDTyxHQUFHQyxLQUFLYSxTQUFTLENBQUNULE1BQU0sTUFBTSxLQUFLLE1BQU07QUFDNUQ7QUFFTyxlQUFlVTtJQUNwQixNQUFNQyxnQkFBZ0J4QixxREFBUyxDQUFDRyxXQUFXLFFBQVE7SUFDbkQsTUFBTXVCLGlCQUFpQjFCLHFEQUFTLENBQUNHLFdBQVcsV0FBVztJQUV2RCxNQUFNd0IsUUFBUXBCLFNBQTZCaUI7SUFFM0MsSUFBSUcsTUFBTVgsUUFBUSxDQUFDQyxNQUFNLEtBQUssR0FBRztRQUMvQixPQUFPbEIscURBQVlBLENBQUM2QixJQUFJLENBQUM7WUFBRUMsU0FBUztZQUFNQyxRQUFRO1FBQWlCO0lBQ3JFO0lBRUEsTUFBTUMsTUFBTUosTUFBTVgsUUFBUSxDQUFDZ0IsR0FBRyxDQUFDLENBQUN4QixJQUFNQSxFQUFFeUIsRUFBRTtJQUUxQyxnRUFBZ0U7SUFDaEUsTUFBTUMsYUFBYTtRQUNqQkMsT0FBTyxFQUFFO1FBQ1RDLFVBQVVMO1FBQ1ZNLFNBQVMsRUFBRTtRQUNYQyxnQkFBZ0I7UUFDaEJDLGFBQWE7UUFDYkMsTUFBTSxJQUFJckIsT0FBT0MsV0FBVztJQUM5QjtJQUNBbkIsNERBQWdCLENBQUN5QixnQkFBZ0JqQixLQUFLYSxTQUFTLENBQUNZLFlBQVksTUFBTSxLQUFLLE1BQU07SUFFN0UseUJBQXlCO0lBQ3pCLE1BQU1PLE1BQU07SUFDWixNQUFNQyxNQUFnQixFQUFFO0lBRXhCLE1BQU0sSUFBSUMsUUFBYyxDQUFDdkMsU0FBU3dDO1FBQ2hDLE1BQU1DLFFBQVEzQyx5REFBS0EsQ0FBQyxNQUFNO1lBQUM7WUFBTXVDO1NBQUksRUFBRTtZQUFFbkMsS0FBS0g7WUFBVzJDLEtBQUt6QyxRQUFReUMsR0FBRztRQUFDO1FBRTFFRCxNQUFNRSxNQUFNLENBQUNDLEVBQUUsQ0FBQyxRQUFRLENBQUNDO1lBQW9CUCxJQUFJUSxJQUFJLENBQUNELE1BQU1FLFFBQVE7UUFBSTtRQUN4RU4sTUFBTU8sTUFBTSxDQUFDSixFQUFFLENBQUMsUUFBUSxDQUFDQztZQUFvQlAsSUFBSVEsSUFBSSxDQUFDRCxNQUFNRSxRQUFRO1FBQUk7UUFFeEVOLE1BQU1HLEVBQUUsQ0FBQyxTQUFTLENBQUNLO1lBQ2pCLElBQUlBLFNBQVMsR0FBR2pEO2lCQUNYd0MsT0FBTyxJQUFJVSxNQUFNLENBQUMsMEJBQTBCLEVBQUVELE1BQU07UUFDM0Q7SUFDRixHQUFHRSxLQUFLLENBQUMsQ0FBQ0M7UUFDUixPQUFPekQscURBQVlBLENBQUM2QixJQUFJLENBQUM7WUFBRTZCLFNBQVM7WUFBT2YsS0FBS0EsSUFBSWpCLElBQUksQ0FBQztZQUFLaUMsT0FBTyxJQUFlQyxPQUFPO1FBQUMsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDL0c7SUFFQSwrRUFBK0U7SUFDL0UsMEZBQTBGO0lBQzFGLE1BQU1DLGFBQWE3RCxxREFBUyxDQUFDRyxXQUFXO0lBQ3hDLE1BQU0yRCxXQUFXdkQsU0FBeURzRDtJQUUxRSxNQUFNRSxlQUFleEQsU0FBNkJpQjtJQUNsRCxNQUFNd0MsWUFBWUQsYUFBYS9DLFFBQVEsQ0FBQ2lELE1BQU0sQ0FBQyxDQUFDQztRQUM5QyxNQUFNQyxJQUFJTCxTQUFTOUMsUUFBUSxDQUFDb0QsSUFBSSxDQUFDLENBQUM1RCxJQUFNQSxFQUFFeUIsRUFBRSxLQUFLaUMsTUFBTWpDLEVBQUU7UUFDekQsc0VBQXNFO1FBQ3RFLElBQUksQ0FBQ2tDLEdBQUcsT0FBTztRQUNmLE9BQU9BLEVBQUVQLE1BQU0sS0FBSyxVQUFVTyxFQUFFUCxNQUFNLEtBQUs7SUFDN0M7SUFDQUcsYUFBYS9DLFFBQVEsR0FBR2dEO0lBQ3hCcEQsVUFBVVksZUFBZXVDO0lBRXpCLE1BQU1NLFlBQVl0QyxJQUFJZCxNQUFNLEdBQUcrQyxVQUFVL0MsTUFBTTtJQUUvQyxPQUFPbEIscURBQVlBLENBQUM2QixJQUFJLENBQUM7UUFBRTZCLFNBQVM7UUFBTVk7UUFBVzNCLEtBQUtBLElBQUlqQixJQUFJLENBQUM7SUFBSTtBQUN6RSIsInNvdXJjZXMiOlsiL1VzZXJzL21hY3VzZXIvRG9jdW1lbnRzL0dpdEh1Yi9zYXRvcmktcGF0dGVybnMvYXBwcy9yZXZpZXcvYXBwL2FwaS90cmlnZ2VyLXJlY29udmVydC9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiXG5pbXBvcnQgZnMgZnJvbSBcIm5vZGU6ZnNcIlxuaW1wb3J0IHsgc3Bhd24gfSBmcm9tIFwibm9kZTpjaGlsZF9wcm9jZXNzXCJcblxuY29uc3QgUkVQT19ST09UID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwiLi5cIiwgXCIuLlwiKVxuXG5pbnRlcmZhY2UgUmVjb252ZXJ0UXVldWVGaWxlIHtcbiAgbWV0YTogeyB1cGRhdGVkQXQ6IHN0cmluZzsgY291bnQ6IG51bWJlciB9XG4gIHBhdHRlcm5zOiB7IGlkOiBzdHJpbmc7IHF1ZXVlZEF0OiBzdHJpbmc7IHJlYXNvbjogc3RyaW5nIH1bXVxufVxuXG5mdW5jdGlvbiByZWFkSnNvbjxUPihwOiBzdHJpbmcpOiBUIHsgcmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHAsIFwidXRmOFwiKSkgYXMgVCB9XG5mdW5jdGlvbiB3cml0ZUpzb248VCBleHRlbmRzIHsgbWV0YTogeyB1cGRhdGVkQXQ6IHN0cmluZzsgY291bnQ6IG51bWJlciB9OyBwYXR0ZXJuczogdW5rbm93bltdIH0+KHA6IHN0cmluZywgZGF0YTogVCk6IHZvaWQge1xuICBkYXRhLm1ldGEuY291bnQgPSBkYXRhLnBhdHRlcm5zLmxlbmd0aFxuICBkYXRhLm1ldGEudXBkYXRlZEF0ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gIGZzLndyaXRlRmlsZVN5bmMocCwgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMikgKyBcIlxcblwiLCBcInV0ZjhcIilcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QoKSB7XG4gIGNvbnN0IHJlY29udmVydFBhdGggPSBwYXRoLmpvaW4oUkVQT19ST09ULCBcImRhdGFcIiwgXCJyZWNvbnZlcnQtcXVldWUuanNvblwiKVxuICBjb25zdCBkaWZmUmVwb3J0UGF0aCA9IHBhdGguam9pbihSRVBPX1JPT1QsIFwic2NyaXB0c1wiLCBcImRpZmYtcmVwb3J0Lmpzb25cIilcblxuICBjb25zdCBxdWV1ZSA9IHJlYWRKc29uPFJlY29udmVydFF1ZXVlRmlsZT4ocmVjb252ZXJ0UGF0aClcblxuICBpZiAocXVldWUucGF0dGVybnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgc2tpcHBlZDogdHJ1ZSwgcmVhc29uOiBcInF1ZXVlIGlzIGVtcHR5XCIgfSlcbiAgfVxuXG4gIGNvbnN0IGlkcyA9IHF1ZXVlLnBhdHRlcm5zLm1hcCgocCkgPT4gcC5pZClcblxuICAvLyBXcml0ZSBhIHRlbXBvcmFyeSBkaWZmLXJlcG9ydC5qc29uIGNvbnRhaW5pbmcgb25seSBxdWV1ZWQgSURzXG4gIGNvbnN0IGRpZmZSZXBvcnQgPSB7XG4gICAgYWRkZWQ6IFtdLFxuICAgIG1vZGlmaWVkOiBpZHMsXG4gICAgcmVtb3ZlZDogW10sXG4gICAgdXBzdHJlYW1Db21taXQ6IFwicmVjb252ZXJ0LXRyaWdnZXJcIixcbiAgICBsb2NhbENvbW1pdDogXCJyZWNvbnZlcnQtdHJpZ2dlclwiLFxuICAgIGRhdGU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgfVxuICBmcy53cml0ZUZpbGVTeW5jKGRpZmZSZXBvcnRQYXRoLCBKU09OLnN0cmluZ2lmeShkaWZmUmVwb3J0LCBudWxsLCAyKSArIFwiXFxuXCIsIFwidXRmOFwiKVxuXG4gIC8vIFJ1biB0aGUgcGlwZWxpbmUgc3RlcHNcbiAgY29uc3QgY21kID0gXCJucG0gcnVuIHBpcGVsaW5lOnRyYW5zbGF0ZSAtLSAtLW9ubHktY2hhbmdlZCAmJiBucG0gcnVuIHBpcGVsaW5lOnJlbmRlciAtLSAtLW9ubHktY2hhbmdlZCAmJiBucG0gcnVuIGJ1aWxkOmluZGV4XCJcbiAgY29uc3QgbG9nOiBzdHJpbmdbXSA9IFtdXG5cbiAgYXdhaXQgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGNoaWxkID0gc3Bhd24oXCJzaFwiLCBbXCItY1wiLCBjbWRdLCB7IGN3ZDogUkVQT19ST09ULCBlbnY6IHByb2Nlc3MuZW52IH0pXG5cbiAgICBjaGlsZC5zdGRvdXQub24oXCJkYXRhXCIsIChjaHVuazogQnVmZmVyKSA9PiB7IGxvZy5wdXNoKGNodW5rLnRvU3RyaW5nKCkpIH0pXG4gICAgY2hpbGQuc3RkZXJyLm9uKFwiZGF0YVwiLCAoY2h1bms6IEJ1ZmZlcikgPT4geyBsb2cucHVzaChjaHVuay50b1N0cmluZygpKSB9KVxuXG4gICAgY2hpbGQub24oXCJjbG9zZVwiLCAoY29kZSkgPT4ge1xuICAgICAgaWYgKGNvZGUgPT09IDApIHJlc29sdmUoKVxuICAgICAgZWxzZSByZWplY3QobmV3IEVycm9yKGBQaXBlbGluZSBleGl0ZWQgd2l0aCBjb2RlICR7Y29kZX1gKSlcbiAgICB9KVxuICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGxvZzogbG9nLmpvaW4oXCJcIiksIGVycm9yOiAoZXJyIGFzIEVycm9yKS5tZXNzYWdlIH0sIHsgc3RhdHVzOiA1MDAgfSlcbiAgfSlcblxuICAvLyBBZnRlciByZWNvbnZlcnNpb24sIHJlbW92ZSBzdWNjZXNzZnVsbHkgcmUtcmVuZGVyZWQgcGF0dGVybnMgZnJvbSB0aGUgcXVldWUuXG4gIC8vIEEgcGF0dGVybiBpcyBjb25zaWRlcmVkIHByb2Nlc3NlZCBpZiBpdCBub3cgaGFzIHN0YXR1cyBQQVNTIG9yIFBBUlRJQUwgaW4gdGhlIG1hbmlmZXN0LlxuICBjb25zdCBjb21wYXRQYXRoID0gcGF0aC5qb2luKFJFUE9fUk9PVCwgXCJjb21wYXRpYmlsaXR5Lmpzb25cIilcbiAgY29uc3QgbWFuaWZlc3QgPSByZWFkSnNvbjx7IHBhdHRlcm5zOiB7IGlkOiBzdHJpbmc7IHN0YXR1czogc3RyaW5nIH1bXSB9Pihjb21wYXRQYXRoKVxuXG4gIGNvbnN0IHVwZGF0ZWRRdWV1ZSA9IHJlYWRKc29uPFJlY29udmVydFF1ZXVlRmlsZT4ocmVjb252ZXJ0UGF0aClcbiAgY29uc3QgcmVtYWluaW5nID0gdXBkYXRlZFF1ZXVlLnBhdHRlcm5zLmZpbHRlcigoZW50cnkpID0+IHtcbiAgICBjb25zdCBtID0gbWFuaWZlc3QucGF0dGVybnMuZmluZCgocCkgPT4gcC5pZCA9PT0gZW50cnkuaWQpXG4gICAgLy8gS2VlcCBpbiBxdWV1ZSBpZiBtYW5pZmVzdCBzdGlsbCBzaG93cyBGQUlML1NJTEVOVF9GQUlML1VOQ0xBU1NJRklFRFxuICAgIGlmICghbSkgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gbS5zdGF0dXMgIT09IFwiUEFTU1wiICYmIG0uc3RhdHVzICE9PSBcIlBBUlRJQUxcIlxuICB9KVxuICB1cGRhdGVkUXVldWUucGF0dGVybnMgPSByZW1haW5pbmdcbiAgd3JpdGVKc29uKHJlY29udmVydFBhdGgsIHVwZGF0ZWRRdWV1ZSlcblxuICBjb25zdCBwcm9jZXNzZWQgPSBpZHMubGVuZ3RoIC0gcmVtYWluaW5nLmxlbmd0aFxuXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IHRydWUsIHByb2Nlc3NlZCwgbG9nOiBsb2cuam9pbihcIlwiKSB9KVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInBhdGgiLCJmcyIsInNwYXduIiwiUkVQT19ST09UIiwicmVzb2x2ZSIsInByb2Nlc3MiLCJjd2QiLCJyZWFkSnNvbiIsInAiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJ3cml0ZUpzb24iLCJkYXRhIiwibWV0YSIsImNvdW50IiwicGF0dGVybnMiLCJsZW5ndGgiLCJ1cGRhdGVkQXQiLCJEYXRlIiwidG9JU09TdHJpbmciLCJ3cml0ZUZpbGVTeW5jIiwic3RyaW5naWZ5IiwiUE9TVCIsInJlY29udmVydFBhdGgiLCJqb2luIiwiZGlmZlJlcG9ydFBhdGgiLCJxdWV1ZSIsImpzb24iLCJza2lwcGVkIiwicmVhc29uIiwiaWRzIiwibWFwIiwiaWQiLCJkaWZmUmVwb3J0IiwiYWRkZWQiLCJtb2RpZmllZCIsInJlbW92ZWQiLCJ1cHN0cmVhbUNvbW1pdCIsImxvY2FsQ29tbWl0IiwiZGF0ZSIsImNtZCIsImxvZyIsIlByb21pc2UiLCJyZWplY3QiLCJjaGlsZCIsImVudiIsInN0ZG91dCIsIm9uIiwiY2h1bmsiLCJwdXNoIiwidG9TdHJpbmciLCJzdGRlcnIiLCJjb2RlIiwiRXJyb3IiLCJjYXRjaCIsImVyciIsInN1Y2Nlc3MiLCJlcnJvciIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJjb21wYXRQYXRoIiwibWFuaWZlc3QiLCJ1cGRhdGVkUXVldWUiLCJyZW1haW5pbmciLCJmaWx0ZXIiLCJlbnRyeSIsIm0iLCJmaW5kIiwicHJvY2Vzc2VkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/trigger-reconvert/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftrigger-reconvert%2Froute&page=%2Fapi%2Ftrigger-reconvert%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftrigger-reconvert%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftrigger-reconvert%2Froute&page=%2Fapi%2Ftrigger-reconvert%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftrigger-reconvert%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_macuser_Documents_GitHub_satori_patterns_apps_review_app_api_trigger_reconvert_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/trigger-reconvert/route.ts */ \"(rsc)/./app/api/trigger-reconvert/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/trigger-reconvert/route\",\n        pathname: \"/api/trigger-reconvert\",\n        filename: \"route\",\n        bundlePath: \"app/api/trigger-reconvert/route\"\n    },\n    resolvedPagePath: \"/Users/macuser/Documents/GitHub/satori-patterns/apps/review/app/api/trigger-reconvert/route.ts\",\n    nextConfigOutput,\n    userland: _Users_macuser_Documents_GitHub_satori_patterns_apps_review_app_api_trigger_reconvert_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ0cmlnZ2VyLXJlY29udmVydCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGdHJpZ2dlci1yZWNvbnZlcnQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZ0cmlnZ2VyLXJlY29udmVydCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm1hY3VzZXIlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzYXRvcmktcGF0dGVybnMlMkZhcHBzJTJGcmV2aWV3JTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRm1hY3VzZXIlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzYXRvcmktcGF0dGVybnMlMkZhcHBzJTJGcmV2aWV3JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUM4QztBQUMzSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL21hY3VzZXIvRG9jdW1lbnRzL0dpdEh1Yi9zYXRvcmktcGF0dGVybnMvYXBwcy9yZXZpZXcvYXBwL2FwaS90cmlnZ2VyLXJlY29udmVydC9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdHJpZ2dlci1yZWNvbnZlcnQvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS90cmlnZ2VyLXJlY29udmVydFwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdHJpZ2dlci1yZWNvbnZlcnQvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvbWFjdXNlci9Eb2N1bWVudHMvR2l0SHViL3NhdG9yaS1wYXR0ZXJucy9hcHBzL3Jldmlldy9hcHAvYXBpL3RyaWdnZXItcmVjb252ZXJ0L3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftrigger-reconvert%2Froute&page=%2Fapi%2Ftrigger-reconvert%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftrigger-reconvert%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "node:child_process":
/*!*************************************!*\
  !*** external "node:child_process" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:child_process");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftrigger-reconvert%2Froute&page=%2Fapi%2Ftrigger-reconvert%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftrigger-reconvert%2Froute.ts&appDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacuser%2FDocuments%2FGitHub%2Fsatori-patterns%2Fapps%2Freview&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();