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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/components/ui/layout/DashboardLayout.tsx":
/*!******************************************************!*\
  !*** ./src/components/ui/layout/DashboardLayout.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DashboardLayout: () => (/* binding */ DashboardLayout)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ \"./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nconst navigation = [\n    {\n        name: \"Properties\",\n        href: \"/properties\",\n        icon: \"\\uD83C\\uDFE0\"\n    },\n    {\n        name: \"Leads\",\n        href: \"/leads\",\n        icon: \"\\uD83D\\uDC65\"\n    },\n    {\n        name: \"Messages\",\n        href: \"/messages\",\n        icon: \"\\uD83D\\uDCAC\"\n    },\n    {\n        name: \"Analytics\",\n        href: \"/analytics\",\n        icon: \"\\uD83D\\uDCCA\"\n    },\n    {\n        name: \"Files\",\n        href: \"/files\",\n        icon: \"\\uD83D\\uDCC1\"\n    },\n    {\n        name: \"Notifications\",\n        href: \"/notifications\",\n        icon: \"\\uD83D\\uDD14\"\n    },\n    {\n        name: \"Settings\",\n        href: \"/settings\",\n        icon: \"⚙️\"\n    }\n];\nconst DashboardLayout = ({ children })=>{\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"min-h-screen bg-gray-50\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                className: \"bg-white shadow\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"flex justify-between h-16\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"flex\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"flex-shrink-0 flex items-center\",\n                                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                            href: \"/\",\n                                            className: \"text-xl font-bold text-blue-600\",\n                                            children: \"RealEstate Serenity\"\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                                            lineNumber: 33,\n                                            columnNumber: 17\n                                        }, undefined)\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                                        lineNumber: 32,\n                                        columnNumber: 15\n                                    }, undefined),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"hidden sm:ml-6 sm:flex sm:space-x-8\",\n                                        children: navigation.map((item)=>{\n                                            const isActive = router.pathname === item.href;\n                                            return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                                href: item.href,\n                                                className: `inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive ? \"border-b-2 border-blue-500 text-gray-900\" : \"border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700\"}`,\n                                                children: [\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                        className: \"mr-2\",\n                                                        children: item.icon\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                                                        lineNumber: 52,\n                                                        columnNumber: 23\n                                                    }, undefined),\n                                                    item.name\n                                                ]\n                                            }, item.name, true, {\n                                                fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                                                lineNumber: 43,\n                                                columnNumber: 21\n                                            }, undefined);\n                                        })\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                                        lineNumber: 39,\n                                        columnNumber: 15\n                                    }, undefined)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                                lineNumber: 30,\n                                columnNumber: 13\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"flex items-center\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                    className: \"p-1 rounded-full text-gray-400 hover:text-gray-500\",\n                                    children: \"\\uD83D\\uDC64\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                                    lineNumber: 62,\n                                    columnNumber: 15\n                                }, undefined)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                                lineNumber: 61,\n                                columnNumber: 13\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                        lineNumber: 29,\n                        columnNumber: 11\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                    lineNumber: 28,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                lineNumber: 27,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"grid grid-cols-4 gap-1\",\n                    children: navigation.map((item)=>{\n                        const isActive = router.pathname === item.href;\n                        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                            href: item.href,\n                            className: `flex flex-col items-center justify-center py-2 text-xs ${isActive ? \"text-blue-600\" : \"text-gray-500 hover:text-gray-900\"}`,\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                    className: \"text-xl mb-1\",\n                                    children: item.icon\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                                    lineNumber: 83,\n                                    columnNumber: 17\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                    children: item.name\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                                    lineNumber: 84,\n                                    columnNumber: 17\n                                }, undefined)\n                            ]\n                        }, item.name, true, {\n                            fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                            lineNumber: 76,\n                            columnNumber: 15\n                        }, undefined);\n                    })\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                    lineNumber: 72,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                lineNumber: 71,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                className: \"pb-16 sm:pb-0\",\n                children: children\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n                lineNumber: 92,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\components\\\\ui\\\\layout\\\\DashboardLayout.tsx\",\n        lineNumber: 25,\n        columnNumber: 5\n    }, undefined);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy91aS9sYXlvdXQvRGFzaGJvYXJkTGF5b3V0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQTBCO0FBQ0c7QUFDVztBQVF4QyxNQUFNRyxhQUF3QjtJQUM1QjtRQUFFQyxNQUFNO1FBQWNDLE1BQU07UUFBZUMsTUFBTTtJQUFLO0lBQ3REO1FBQUVGLE1BQU07UUFBU0MsTUFBTTtRQUFVQyxNQUFNO0lBQUs7SUFDNUM7UUFBRUYsTUFBTTtRQUFZQyxNQUFNO1FBQWFDLE1BQU07SUFBSztJQUNsRDtRQUFFRixNQUFNO1FBQWFDLE1BQU07UUFBY0MsTUFBTTtJQUFLO0lBQ3BEO1FBQUVGLE1BQU07UUFBU0MsTUFBTTtRQUFVQyxNQUFNO0lBQUs7SUFDNUM7UUFBRUYsTUFBTTtRQUFpQkMsTUFBTTtRQUFrQkMsTUFBTTtJQUFLO0lBQzVEO1FBQUVGLE1BQU07UUFBWUMsTUFBTTtRQUFhQyxNQUFNO0lBQUs7Q0FDbkQ7QUFFTSxNQUFNQyxrQkFBMkQsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDbkYsTUFBTUMsU0FBU1Asc0RBQVNBO0lBRXhCLHFCQUNFLDhEQUFDUTtRQUFJQyxXQUFVOzswQkFFYiw4REFBQ0M7Z0JBQUlELFdBQVU7MEJBQ2IsNEVBQUNEO29CQUFJQyxXQUFVOzhCQUNiLDRFQUFDRDt3QkFBSUMsV0FBVTs7MENBQ2IsOERBQUNEO2dDQUFJQyxXQUFVOztrREFFYiw4REFBQ0Q7d0NBQUlDLFdBQVU7a0RBQ2IsNEVBQUNWLGtEQUFJQTs0Q0FBQ0ksTUFBSzs0Q0FBSU0sV0FBVTtzREFBa0M7Ozs7Ozs7Ozs7O2tEQU03RCw4REFBQ0Q7d0NBQUlDLFdBQVU7a0RBQ1pSLFdBQVdVLEdBQUcsQ0FBQyxDQUFDQzs0Q0FDZixNQUFNQyxXQUFXTixPQUFPTyxRQUFRLEtBQUtGLEtBQUtULElBQUk7NENBQzlDLHFCQUNFLDhEQUFDSixrREFBSUE7Z0RBRUhJLE1BQU1TLEtBQUtULElBQUk7Z0RBQ2ZNLFdBQVcsQ0FBQyx1REFBdUQsRUFDakVJLFdBQ0ksNkNBQ0Esd0ZBQ0wsQ0FBQzs7a0VBRUYsOERBQUNFO3dEQUFLTixXQUFVO2tFQUFRRyxLQUFLUixJQUFJOzs7Ozs7b0RBQ2hDUSxLQUFLVixJQUFJOzsrQ0FUTFUsS0FBS1YsSUFBSTs7Ozs7d0NBWXBCOzs7Ozs7Ozs7Ozs7MENBS0osOERBQUNNO2dDQUFJQyxXQUFVOzBDQUNiLDRFQUFDTztvQ0FBT1AsV0FBVTs4Q0FBcUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFTL0UsOERBQUNEO2dCQUFJQyxXQUFVOzBCQUNiLDRFQUFDRDtvQkFBSUMsV0FBVTs4QkFDWlIsV0FBV1UsR0FBRyxDQUFDLENBQUNDO3dCQUNmLE1BQU1DLFdBQVdOLE9BQU9PLFFBQVEsS0FBS0YsS0FBS1QsSUFBSTt3QkFDOUMscUJBQ0UsOERBQUNKLGtEQUFJQTs0QkFFSEksTUFBTVMsS0FBS1QsSUFBSTs0QkFDZk0sV0FBVyxDQUFDLHVEQUF1RCxFQUNqRUksV0FBVyxrQkFBa0Isb0NBQzlCLENBQUM7OzhDQUVGLDhEQUFDRTtvQ0FBS04sV0FBVTs4Q0FBZ0JHLEtBQUtSLElBQUk7Ozs7Ozs4Q0FDekMsOERBQUNXOzhDQUFNSCxLQUFLVixJQUFJOzs7Ozs7OzJCQVBYVSxLQUFLVixJQUFJOzs7OztvQkFVcEI7Ozs7Ozs7Ozs7OzBCQUtKLDhEQUFDZTtnQkFBS1IsV0FBVTswQkFDYkg7Ozs7Ozs7Ozs7OztBQUlULEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFsLWVzdGF0ZS1zZXJlbml0eS13ZWIvLi9zcmMvY29tcG9uZW50cy91aS9sYXlvdXQvRGFzaGJvYXJkTGF5b3V0LnRzeD84YmViIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluayc7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuXHJcbmludGVyZmFjZSBOYXZJdGVtIHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgaHJlZjogc3RyaW5nO1xyXG4gIGljb246IHN0cmluZztcclxufVxyXG5cclxuY29uc3QgbmF2aWdhdGlvbjogTmF2SXRlbVtdID0gW1xyXG4gIHsgbmFtZTogJ1Byb3BlcnRpZXMnLCBocmVmOiAnL3Byb3BlcnRpZXMnLCBpY29uOiAn8J+PoCcgfSxcclxuICB7IG5hbWU6ICdMZWFkcycsIGhyZWY6ICcvbGVhZHMnLCBpY29uOiAn8J+RpScgfSxcclxuICB7IG5hbWU6ICdNZXNzYWdlcycsIGhyZWY6ICcvbWVzc2FnZXMnLCBpY29uOiAn8J+SrCcgfSxcclxuICB7IG5hbWU6ICdBbmFseXRpY3MnLCBocmVmOiAnL2FuYWx5dGljcycsIGljb246ICfwn5OKJyB9LFxyXG4gIHsgbmFtZTogJ0ZpbGVzJywgaHJlZjogJy9maWxlcycsIGljb246ICfwn5OBJyB9LFxyXG4gIHsgbmFtZTogJ05vdGlmaWNhdGlvbnMnLCBocmVmOiAnL25vdGlmaWNhdGlvbnMnLCBpY29uOiAn8J+UlCcgfSxcclxuICB7IG5hbWU6ICdTZXR0aW5ncycsIGhyZWY6ICcvc2V0dGluZ3MnLCBpY29uOiAn4pqZ77iPJyB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IERhc2hib2FyZExheW91dDogUmVhY3QuRkM8eyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0+ID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xyXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gYmctZ3JheS01MFwiPlxyXG4gICAgICB7LyogTmF2aWdhdGlvbiAqL31cclxuICAgICAgPG5hdiBjbGFzc05hbWU9XCJiZy13aGl0ZSBzaGFkb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTd4bCBteC1hdXRvIHB4LTQgc206cHgtNiBsZzpweC04XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGgtMTZcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4XCI+XHJcbiAgICAgICAgICAgICAgey8qIExvZ28gKi99XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LXNocmluay0wIGZsZXggaXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8TGluayBocmVmPVwiL1wiIGNsYXNzTmFtZT1cInRleHQteGwgZm9udC1ib2xkIHRleHQtYmx1ZS02MDBcIj5cclxuICAgICAgICAgICAgICAgICAgUmVhbEVzdGF0ZSBTZXJlbml0eVxyXG4gICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICB7LyogTmF2aWdhdGlvbiBJdGVtcyAqL31cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhpZGRlbiBzbTptbC02IHNtOmZsZXggc206c3BhY2UteC04XCI+XHJcbiAgICAgICAgICAgICAgICB7bmF2aWdhdGlvbi5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSByb3V0ZXIucGF0aG5hbWUgPT09IGl0ZW0uaHJlZjtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICA8TGlua1xyXG4gICAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtLm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICBocmVmPXtpdGVtLmhyZWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgcHgtMSBwdC0xIHRleHQtc20gZm9udC1tZWRpdW0gJHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItYi0yIGJvcmRlci1ibHVlLTUwMCB0ZXh0LWdyYXktOTAwJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1iLTIgYm9yZGVyLXRyYW5zcGFyZW50IHRleHQtZ3JheS01MDAgaG92ZXI6Ym9yZGVyLWdyYXktMzAwIGhvdmVyOnRleHQtZ3JheS03MDAnXHJcbiAgICAgICAgICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtci0yXCI+e2l0ZW0uaWNvbn08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHsvKiBQcm9maWxlIERyb3Bkb3duIFBsYWNlaG9sZGVyICovfVxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJwLTEgcm91bmRlZC1mdWxsIHRleHQtZ3JheS00MDAgaG92ZXI6dGV4dC1ncmF5LTUwMFwiPlxyXG4gICAgICAgICAgICAgICAg8J+RpFxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L25hdj5cclxuXHJcbiAgICAgIHsvKiBNb2JpbGUgTmF2aWdhdGlvbiAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzbTpoaWRkZW4gZml4ZWQgYm90dG9tLTAgbGVmdC0wIHJpZ2h0LTAgYmctd2hpdGUgYm9yZGVyLXQgYm9yZGVyLWdyYXktMjAwIHBiLXNhZmVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTQgZ2FwLTFcIj5cclxuICAgICAgICAgIHtuYXZpZ2F0aW9uLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IHJvdXRlci5wYXRobmFtZSA9PT0gaXRlbS5ocmVmO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgIDxMaW5rXHJcbiAgICAgICAgICAgICAgICBrZXk9e2l0ZW0ubmFtZX1cclxuICAgICAgICAgICAgICAgIGhyZWY9e2l0ZW0uaHJlZn1cclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB5LTIgdGV4dC14cyAke1xyXG4gICAgICAgICAgICAgICAgICBpc0FjdGl2ZSA/ICd0ZXh0LWJsdWUtNjAwJyA6ICd0ZXh0LWdyYXktNTAwIGhvdmVyOnRleHQtZ3JheS05MDAnXHJcbiAgICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhsIG1iLTFcIj57aXRlbS5pY29ufTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPntpdGVtLm5hbWV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHsvKiBNYWluIENvbnRlbnQgKi99XHJcbiAgICAgIDxtYWluIGNsYXNzTmFtZT1cInBiLTE2IHNtOnBiLTBcIj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgIDwvbWFpbj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07ICJdLCJuYW1lcyI6WyJSZWFjdCIsIkxpbmsiLCJ1c2VSb3V0ZXIiLCJuYXZpZ2F0aW9uIiwibmFtZSIsImhyZWYiLCJpY29uIiwiRGFzaGJvYXJkTGF5b3V0IiwiY2hpbGRyZW4iLCJyb3V0ZXIiLCJkaXYiLCJjbGFzc05hbWUiLCJuYXYiLCJtYXAiLCJpdGVtIiwiaXNBY3RpdmUiLCJwYXRobmFtZSIsInNwYW4iLCJidXR0b24iLCJtYWluIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/components/ui/layout/DashboardLayout.tsx\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_ui_layout_DashboardLayout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/ui/layout/DashboardLayout */ \"./src/components/ui/layout/DashboardLayout.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_layout_DashboardLayout__WEBPACK_IMPORTED_MODULE_1__.DashboardLayout, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\pages\\\\_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\User\\\\OneDrive - laude-reut.ro\\\\Desktop\\\\RealEstateSerenity-0.1\\\\web-ui\\\\src\\\\pages\\\\_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUN5RTtBQUMzQztBQUVmLFNBQVNDLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDNUQscUJBQ0UsOERBQUNILGtGQUFlQTtrQkFDZCw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QiIsInNvdXJjZXMiOlsid2VicGFjazovL3JlYWwtZXN0YXRlLXNlcmVuaXR5LXdlYi8uL3NyYy9wYWdlcy9fYXBwLnRzeD9mOWQ2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCdcclxuaW1wb3J0IHsgRGFzaGJvYXJkTGF5b3V0IH0gZnJvbSAnLi4vY29tcG9uZW50cy91aS9sYXlvdXQvRGFzaGJvYXJkTGF5b3V0J1xyXG5pbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxEYXNoYm9hcmRMYXlvdXQ+XHJcbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgIDwvRGFzaGJvYXJkTGF5b3V0PlxyXG4gIClcclxufSAiXSwibmFtZXMiOlsiRGFzaGJvYXJkTGF5b3V0IiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

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
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./src/pages/_app.tsx")));
module.exports = __webpack_exports__;

})();