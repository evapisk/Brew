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
exports.id = "app/api/linkup/events/route";
exports.ids = ["app/api/linkup/events/route"];
exports.modules = {

/***/ "(rsc)/./app/api/linkup/events/route.ts":
/*!****************************************!*\
  !*** ./app/api/linkup/events/route.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_linkup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/linkup */ \"(rsc)/./lib/linkup.ts\");\n\n\nasync function GET(req) {\n    const { searchParams } = new URL(req.url);\n    const university = searchParams.get(\"university\");\n    if (!university) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"university param required\"\n        }, {\n            status: 400\n        });\n    }\n    if (!process.env.LINKUP_API_KEY) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            events: []\n        }); // graceful degradation\n    }\n    try {\n        const events = await (0,_lib_linkup__WEBPACK_IMPORTED_MODULE_1__.getNetworkingEvents)(university);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            events\n        });\n    } catch (err) {\n        const message = err instanceof Error ? err.message : \"Linkup fetch failed\";\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2xpbmt1cC9ldmVudHMvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTJDO0FBQ1E7QUFFNUMsZUFBZUUsSUFBSUMsR0FBWTtJQUNwQyxNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlGLElBQUlHLEdBQUc7SUFDeEMsTUFBTUMsYUFBYUgsYUFBYUksR0FBRyxDQUFDO0lBRXBDLElBQUksQ0FBQ0QsWUFBWTtRQUNmLE9BQU9QLHFEQUFZQSxDQUFDUyxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUE0QixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUNqRjtJQUVBLElBQUksQ0FBQ0MsUUFBUUMsR0FBRyxDQUFDQyxjQUFjLEVBQUU7UUFDL0IsT0FBT2QscURBQVlBLENBQUNTLElBQUksQ0FBQztZQUFFTSxRQUFRLEVBQUU7UUFBQyxJQUFJLHVCQUF1QjtJQUNuRTtJQUVBLElBQUk7UUFDRixNQUFNQSxTQUFTLE1BQU1kLGdFQUFtQkEsQ0FBQ007UUFDekMsT0FBT1AscURBQVlBLENBQUNTLElBQUksQ0FBQztZQUFFTTtRQUFPO0lBQ3BDLEVBQUUsT0FBT0MsS0FBYztRQUNyQixNQUFNQyxVQUFVRCxlQUFlRSxRQUFRRixJQUFJQyxPQUFPLEdBQUc7UUFDckQsT0FBT2pCLHFEQUFZQSxDQUFDUyxJQUFJLENBQUM7WUFBRUMsT0FBT087UUFBUSxHQUFHO1lBQUVOLFFBQVE7UUFBSTtJQUM3RDtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvZXZhcGlza3VuL0Rlc2t0b3AvY3MgcGVyc29uYWwvYnJldy9hcHAvYXBpL2xpbmt1cC9ldmVudHMvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5pbXBvcnQgeyBnZXROZXR3b3JraW5nRXZlbnRzIH0gZnJvbSBcIkAvbGliL2xpbmt1cFwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcTogUmVxdWVzdCkge1xuICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXEudXJsKTtcbiAgY29uc3QgdW5pdmVyc2l0eSA9IHNlYXJjaFBhcmFtcy5nZXQoXCJ1bml2ZXJzaXR5XCIpO1xuXG4gIGlmICghdW5pdmVyc2l0eSkge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcInVuaXZlcnNpdHkgcGFyYW0gcmVxdWlyZWRcIiB9LCB7IHN0YXR1czogNDAwIH0pO1xuICB9XG5cbiAgaWYgKCFwcm9jZXNzLmVudi5MSU5LVVBfQVBJX0tFWSkge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGV2ZW50czogW10gfSk7IC8vIGdyYWNlZnVsIGRlZ3JhZGF0aW9uXG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IGV2ZW50cyA9IGF3YWl0IGdldE5ldHdvcmtpbmdFdmVudHModW5pdmVyc2l0eSk7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXZlbnRzIH0pO1xuICB9IGNhdGNoIChlcnI6IHVua25vd24pIHtcbiAgICBjb25zdCBtZXNzYWdlID0gZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiTGlua3VwIGZldGNoIGZhaWxlZFwiO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBtZXNzYWdlIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJnZXROZXR3b3JraW5nRXZlbnRzIiwiR0VUIiwicmVxIiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwidW5pdmVyc2l0eSIsImdldCIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsInByb2Nlc3MiLCJlbnYiLCJMSU5LVVBfQVBJX0tFWSIsImV2ZW50cyIsImVyciIsIm1lc3NhZ2UiLCJFcnJvciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/linkup/events/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/linkup.ts":
/*!***********************!*\
  !*** ./lib/linkup.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getCafesNearUniversity: () => (/* binding */ getCafesNearUniversity),\n/* harmony export */   getNetworkingEvents: () => (/* binding */ getNetworkingEvents)\n/* harmony export */ });\n/* harmony import */ var linkup_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! linkup-sdk */ \"(rsc)/./node_modules/linkup-sdk/dist/src/index.js\");\n/* harmony import */ var linkup_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(linkup_sdk__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction getClient() {\n    return new linkup_sdk__WEBPACK_IMPORTED_MODULE_0__.LinkupClient({\n        apiKey: process.env.LINKUP_API_KEY\n    });\n}\n// ─── Cafes ────────────────────────────────────────────────────────────────────\nasync function getCafesNearUniversity(university) {\n    const client = getClient();\n    const { results } = await client.search({\n        query: `best coffee shops cafes near ${university} campus student friendly`,\n        depth: \"standard\",\n        outputType: \"searchResults\",\n        maxResults: 6\n    });\n    return results.filter((r)=>r.type === \"text\").slice(0, 5).map((r)=>({\n            name: cleanTitle(r.name),\n            description: r.type === \"text\" ? r.content.slice(0, 120).trim() : \"\",\n            url: r.url\n        }));\n}\n// ─── Events ───────────────────────────────────────────────────────────────────\nasync function getNetworkingEvents(university) {\n    const client = getClient();\n    const { results } = await client.search({\n        query: `student networking events career workshops near ${university} upcoming 2025`,\n        depth: \"standard\",\n        outputType: \"searchResults\",\n        maxResults: 5\n    });\n    return results.filter((r)=>r.type === \"text\").slice(0, 4).map((r)=>({\n            title: r.name,\n            description: r.type === \"text\" ? r.content.slice(0, 140).trim() : \"\",\n            url: r.url\n        }));\n}\n// ─── Helpers ──────────────────────────────────────────────────────────────────\nfunction cleanTitle(title) {\n    return title.replace(/\\s*[-|–]\\s*(Yelp|Google|TripAdvisor|Maps|Reviews?|Website).*/i, \"\").trim();\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbGlua3VwLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBMEM7QUFFMUMsU0FBU0M7SUFDUCxPQUFPLElBQUlELG9EQUFZQSxDQUFDO1FBQUVFLFFBQVFDLFFBQVFDLEdBQUcsQ0FBQ0MsY0FBYztJQUFFO0FBQ2hFO0FBY0EsaUZBQWlGO0FBRTFFLGVBQWVDLHVCQUF1QkMsVUFBa0I7SUFDN0QsTUFBTUMsU0FBU1A7SUFFZixNQUFNLEVBQUVRLE9BQU8sRUFBRSxHQUFHLE1BQU1ELE9BQU9FLE1BQU0sQ0FBQztRQUN0Q0MsT0FBTyxDQUFDLDZCQUE2QixFQUFFSixXQUFXLHdCQUF3QixDQUFDO1FBQzNFSyxPQUFPO1FBQ1BDLFlBQVk7UUFDWkMsWUFBWTtJQUNkO0lBRUEsT0FBT0wsUUFDSk0sTUFBTSxDQUFDLENBQUNDLElBQU1BLEVBQUVDLElBQUksS0FBSyxRQUN6QkMsS0FBSyxDQUFDLEdBQUcsR0FDVEMsR0FBRyxDQUFDLENBQUNILElBQU87WUFDWEksTUFBTUMsV0FBV0wsRUFBRUksSUFBSTtZQUN2QkUsYUFBYU4sRUFBRUMsSUFBSSxLQUFLLFNBQVNELEVBQUVPLE9BQU8sQ0FBQ0wsS0FBSyxDQUFDLEdBQUcsS0FBS00sSUFBSSxLQUFLO1lBQ2xFQyxLQUFLVCxFQUFFUyxHQUFHO1FBQ1o7QUFDSjtBQUVBLGlGQUFpRjtBQUUxRSxlQUFlQyxvQkFBb0JuQixVQUFrQjtJQUMxRCxNQUFNQyxTQUFTUDtJQUVmLE1BQU0sRUFBRVEsT0FBTyxFQUFFLEdBQUcsTUFBTUQsT0FBT0UsTUFBTSxDQUFDO1FBQ3RDQyxPQUFPLENBQUMsZ0RBQWdELEVBQUVKLFdBQVcsY0FBYyxDQUFDO1FBQ3BGSyxPQUFPO1FBQ1BDLFlBQVk7UUFDWkMsWUFBWTtJQUNkO0lBRUEsT0FBT0wsUUFDSk0sTUFBTSxDQUFDLENBQUNDLElBQU1BLEVBQUVDLElBQUksS0FBSyxRQUN6QkMsS0FBSyxDQUFDLEdBQUcsR0FDVEMsR0FBRyxDQUFDLENBQUNILElBQU87WUFDWFcsT0FBT1gsRUFBRUksSUFBSTtZQUNiRSxhQUFhTixFQUFFQyxJQUFJLEtBQUssU0FBU0QsRUFBRU8sT0FBTyxDQUFDTCxLQUFLLENBQUMsR0FBRyxLQUFLTSxJQUFJLEtBQUs7WUFDbEVDLEtBQUtULEVBQUVTLEdBQUc7UUFDWjtBQUNKO0FBRUEsaUZBQWlGO0FBRWpGLFNBQVNKLFdBQVdNLEtBQWE7SUFDL0IsT0FBT0EsTUFBTUMsT0FBTyxDQUFDLGlFQUFpRSxJQUFJSixJQUFJO0FBQ2hHIiwic291cmNlcyI6WyIvVXNlcnMvZXZhcGlza3VuL0Rlc2t0b3AvY3MgcGVyc29uYWwvYnJldy9saWIvbGlua3VwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExpbmt1cENsaWVudCB9IGZyb20gXCJsaW5rdXAtc2RrXCI7XG5cbmZ1bmN0aW9uIGdldENsaWVudCgpIHtcbiAgcmV0dXJuIG5ldyBMaW5rdXBDbGllbnQoeyBhcGlLZXk6IHByb2Nlc3MuZW52LkxJTktVUF9BUElfS0VZISB9KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDYWZlIHtcbiAgbmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZXR3b3JraW5nRXZlbnQge1xuICB0aXRsZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbn1cblxuLy8g4pSA4pSA4pSAIENhZmVzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q2FmZXNOZWFyVW5pdmVyc2l0eSh1bml2ZXJzaXR5OiBzdHJpbmcpOiBQcm9taXNlPENhZmVbXT4ge1xuICBjb25zdCBjbGllbnQgPSBnZXRDbGllbnQoKTtcblxuICBjb25zdCB7IHJlc3VsdHMgfSA9IGF3YWl0IGNsaWVudC5zZWFyY2goe1xuICAgIHF1ZXJ5OiBgYmVzdCBjb2ZmZWUgc2hvcHMgY2FmZXMgbmVhciAke3VuaXZlcnNpdHl9IGNhbXB1cyBzdHVkZW50IGZyaWVuZGx5YCxcbiAgICBkZXB0aDogXCJzdGFuZGFyZFwiLFxuICAgIG91dHB1dFR5cGU6IFwic2VhcmNoUmVzdWx0c1wiLFxuICAgIG1heFJlc3VsdHM6IDYsXG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHRzXG4gICAgLmZpbHRlcigocikgPT4gci50eXBlID09PSBcInRleHRcIilcbiAgICAuc2xpY2UoMCwgNSlcbiAgICAubWFwKChyKSA9PiAoe1xuICAgICAgbmFtZTogY2xlYW5UaXRsZShyLm5hbWUpLFxuICAgICAgZGVzY3JpcHRpb246IHIudHlwZSA9PT0gXCJ0ZXh0XCIgPyByLmNvbnRlbnQuc2xpY2UoMCwgMTIwKS50cmltKCkgOiBcIlwiLFxuICAgICAgdXJsOiByLnVybCxcbiAgICB9KSk7XG59XG5cbi8vIOKUgOKUgOKUgCBFdmVudHMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXROZXR3b3JraW5nRXZlbnRzKHVuaXZlcnNpdHk6IHN0cmluZyk6IFByb21pc2U8TmV0d29ya2luZ0V2ZW50W10+IHtcbiAgY29uc3QgY2xpZW50ID0gZ2V0Q2xpZW50KCk7XG5cbiAgY29uc3QgeyByZXN1bHRzIH0gPSBhd2FpdCBjbGllbnQuc2VhcmNoKHtcbiAgICBxdWVyeTogYHN0dWRlbnQgbmV0d29ya2luZyBldmVudHMgY2FyZWVyIHdvcmtzaG9wcyBuZWFyICR7dW5pdmVyc2l0eX0gdXBjb21pbmcgMjAyNWAsXG4gICAgZGVwdGg6IFwic3RhbmRhcmRcIixcbiAgICBvdXRwdXRUeXBlOiBcInNlYXJjaFJlc3VsdHNcIixcbiAgICBtYXhSZXN1bHRzOiA1LFxuICB9KTtcblxuICByZXR1cm4gcmVzdWx0c1xuICAgIC5maWx0ZXIoKHIpID0+IHIudHlwZSA9PT0gXCJ0ZXh0XCIpXG4gICAgLnNsaWNlKDAsIDQpXG4gICAgLm1hcCgocikgPT4gKHtcbiAgICAgIHRpdGxlOiByLm5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogci50eXBlID09PSBcInRleHRcIiA/IHIuY29udGVudC5zbGljZSgwLCAxNDApLnRyaW0oKSA6IFwiXCIsXG4gICAgICB1cmw6IHIudXJsLFxuICAgIH0pKTtcbn1cblxuLy8g4pSA4pSA4pSAIEhlbHBlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmZ1bmN0aW9uIGNsZWFuVGl0bGUodGl0bGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB0aXRsZS5yZXBsYWNlKC9cXHMqWy184oCTXVxccyooWWVscHxHb29nbGV8VHJpcEFkdmlzb3J8TWFwc3xSZXZpZXdzP3xXZWJzaXRlKS4qL2ksIFwiXCIpLnRyaW0oKTtcbn1cbiJdLCJuYW1lcyI6WyJMaW5rdXBDbGllbnQiLCJnZXRDbGllbnQiLCJhcGlLZXkiLCJwcm9jZXNzIiwiZW52IiwiTElOS1VQX0FQSV9LRVkiLCJnZXRDYWZlc05lYXJVbml2ZXJzaXR5IiwidW5pdmVyc2l0eSIsImNsaWVudCIsInJlc3VsdHMiLCJzZWFyY2giLCJxdWVyeSIsImRlcHRoIiwib3V0cHV0VHlwZSIsIm1heFJlc3VsdHMiLCJmaWx0ZXIiLCJyIiwidHlwZSIsInNsaWNlIiwibWFwIiwibmFtZSIsImNsZWFuVGl0bGUiLCJkZXNjcmlwdGlvbiIsImNvbnRlbnQiLCJ0cmltIiwidXJsIiwiZ2V0TmV0d29ya2luZ0V2ZW50cyIsInRpdGxlIiwicmVwbGFjZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/linkup.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Flinkup%2Fevents%2Froute&page=%2Fapi%2Flinkup%2Fevents%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flinkup%2Fevents%2Froute.ts&appDir=%2FUsers%2Fevapiskun%2FDesktop%2Fcs%20personal%2Fbrew%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fevapiskun%2FDesktop%2Fcs%20personal%2Fbrew&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Flinkup%2Fevents%2Froute&page=%2Fapi%2Flinkup%2Fevents%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flinkup%2Fevents%2Froute.ts&appDir=%2FUsers%2Fevapiskun%2FDesktop%2Fcs%20personal%2Fbrew%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fevapiskun%2FDesktop%2Fcs%20personal%2Fbrew&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_evapiskun_Desktop_cs_personal_brew_app_api_linkup_events_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/linkup/events/route.ts */ \"(rsc)/./app/api/linkup/events/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/linkup/events/route\",\n        pathname: \"/api/linkup/events\",\n        filename: \"route\",\n        bundlePath: \"app/api/linkup/events/route\"\n    },\n    resolvedPagePath: \"/Users/evapiskun/Desktop/cs personal/brew/app/api/linkup/events/route.ts\",\n    nextConfigOutput,\n    userland: _Users_evapiskun_Desktop_cs_personal_brew_app_api_linkup_events_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZsaW5rdXAlMkZldmVudHMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmxpbmt1cCUyRmV2ZW50cyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmxpbmt1cCUyRmV2ZW50cyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmV2YXBpc2t1biUyRkRlc2t0b3AlMkZjcyUyMHBlcnNvbmFsJTJGYnJldyUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZldmFwaXNrdW4lMkZEZXNrdG9wJTJGY3MlMjBwZXJzb25hbCUyRmJyZXcmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ3dCO0FBQ3JHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvZXZhcGlza3VuL0Rlc2t0b3AvY3MgcGVyc29uYWwvYnJldy9hcHAvYXBpL2xpbmt1cC9ldmVudHMvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2xpbmt1cC9ldmVudHMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9saW5rdXAvZXZlbnRzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9saW5rdXAvZXZlbnRzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2V2YXBpc2t1bi9EZXNrdG9wL2NzIHBlcnNvbmFsL2JyZXcvYXBwL2FwaS9saW5rdXAvZXZlbnRzL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Flinkup%2Fevents%2Froute&page=%2Fapi%2Flinkup%2Fevents%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flinkup%2Fevents%2Froute.ts&appDir=%2FUsers%2Fevapiskun%2FDesktop%2Fcs%20personal%2Fbrew%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fevapiskun%2FDesktop%2Fcs%20personal%2Fbrew&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "http2":
/*!************************!*\
  !*** external "http2" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

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

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/ms","vendor-chunks/zod","vendor-chunks/axios","vendor-chunks/mime-db","vendor-chunks/zod-to-json-schema","vendor-chunks/follow-redirects","vendor-chunks/debug","vendor-chunks/form-data","vendor-chunks/get-intrinsic","vendor-chunks/linkup-sdk","vendor-chunks/asynckit","vendor-chunks/combined-stream","vendor-chunks/mime-types","vendor-chunks/supports-color","vendor-chunks/has-symbols","vendor-chunks/delayed-stream","vendor-chunks/function-bind","vendor-chunks/es-set-tostringtag","vendor-chunks/get-proto","vendor-chunks/call-bind-apply-helpers","vendor-chunks/dunder-proto","vendor-chunks/math-intrinsics","vendor-chunks/es-errors","vendor-chunks/has-flag","vendor-chunks/gopd","vendor-chunks/es-define-property","vendor-chunks/hasown","vendor-chunks/has-tostringtag","vendor-chunks/es-object-atoms"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Flinkup%2Fevents%2Froute&page=%2Fapi%2Flinkup%2Fevents%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flinkup%2Fevents%2Froute.ts&appDir=%2FUsers%2Fevapiskun%2FDesktop%2Fcs%20personal%2Fbrew%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fevapiskun%2FDesktop%2Fcs%20personal%2Fbrew&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();