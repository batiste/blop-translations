module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server.blop");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/blop-language/src/runtime.js":
/*!***************************************************!*\
  !*** ./node_modules/blop-language/src/runtime.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const snabbdom = __webpack_require__(/*! snabbdom */ \"snabbdom\");\nconst attributes = __webpack_require__(/*! snabbdom/modules/attributes */ \"snabbdom/modules/attributes\");\nconst style = __webpack_require__(/*! snabbdom/modules/style */ \"snabbdom/modules/style\");\nconst sclass = __webpack_require__(/*! snabbdom/modules/class */ \"snabbdom/modules/class\");\nconst eventlisteners = __webpack_require__(/*! snabbdom/modules/eventlisteners */ \"snabbdom/modules/eventlisteners\");\nconst snabbdomh = __webpack_require__(/*! snabbdom/h */ \"snabbdom/h\");\nconst toVNode = __webpack_require__(/*! snabbdom/tovnode */ \"snabbdom/tovnode\").default;\n\n// the node being currently rendered\nlet currentNode = null;\n// this is the component state cache\nlet cache = {};\n// this is the next cache that replace cache after a full re-render\nlet nextCache = {};\n\n// eslint-disable-next-line arrow-body-style\nconst componentPath = (name) => {\n  return currentNode\n    ? `${currentNode.path}.${currentNode.componentsChildren.length}.${name}`\n    : name;\n};\n\nclass Component {\n  constructor(ComponentFct, attributes, children, name) {\n    if (ComponentFct === null) {\n      if (!this.render) {\n        throw new Error('Component should implement the render() method');\n      }\n      this.componentFct = this.render;\n    } else {\n      this.componentFct = ComponentFct;\n    }\n    this.attributes = attributes || {};\n    this.children = children || [];\n    this.name = name;\n    if (name === 'root') {\n      this.path = 'root';\n    } else {\n      this.path = componentPath(name);\n    }\n    this.componentsChildren = [];\n    this.listeners = [];\n    this.life = { mount: [], unmount: [] };\n    this.vnode = null;\n    this.parent = currentNode;\n    this.state = {};\n    this.context = {};\n    this.mounted = false;\n    this.destroyed = false;\n    cache[this.path] = this;\n  }\n\n  // called on a partial render\n  partialRender() {\n    const parentNode = currentNode;\n    currentNode = this;\n    this._resetForRender();\n    const newVnode = this.renderComponent();\n    const thunk = patch(this.vnode, newVnode);\n    copyToThunk(thunk, this.vnode);\n    currentNode = parentNode;\n  }\n\n  refresh() {\n    if (this.destroyed) return;\n    scheduleRender(this);\n  }\n\n  renderComponent() {\n    try {\n      return this.componentFct(this.attributes, this.children, this);\n    } catch (e) {\n      console.error(e);\n      return h('span', {}, [e.message]);\n    }\n  }\n\n  onMount() { return this; }\n\n  onUnmount() { return this; }\n\n  mount(func) {\n    if (this.mounted) return this;\n    this.life.mount.push(func);\n    return this;\n  }\n\n  unmount(func) {\n    if (this.mounted) return this;\n    this.life.unmount.push(func);\n    return this;\n  }\n\n  useState(name, initialValue) {\n    this.state[name] = this.state[name] || initialValue;\n    const value = this.state[name];\n    const setState = (newState) => {\n      this.state[name] = newState;\n      scheduleRender(this);\n    };\n    return { value, setState, getState: () => this.state[name] };\n  }\n\n  useContext(name, initialValue) {\n    this.listeners[name] = [];\n    if (initialValue && this.context[name] === undefined) {\n      this.context[name] = initialValue;\n    }\n    const setContext = (value) => {\n      this.context[name] = value;\n      this.listeners[name].forEach((node) => {\n        scheduleRender(node);\n      });\n    };\n    const getContext = () => {\n      let node = this;\n      const requestingNode = currentNode;\n      while (node) {\n        if (node.context[name] !== undefined) {\n          if (!node.listeners[name].includes(requestingNode) && requestingNode !== node) {\n            node.listeners[name].push(requestingNode);\n          }\n          return node.context[name];\n        }\n        node = node.parent;\n      }\n    };\n    const value = initialValue || getContext();\n    return { setContext, getContext, value };\n  }\n\n  _resetForRender() {\n    this.componentsChildren = [];\n    this.listeners = [];\n  }\n\n  _render(attributes, children) {\n    const parentNode = currentNode;\n    this.attributes = attributes;\n    this.children = children;\n    currentNode = this;\n    this._resetForRender();\n    const newVnode = this.renderComponent();\n    if (!this.mounted) {\n      this._mount();\n    }\n    parentNode && parentNode.componentsChildren.push(this);\n    nextCache[this.path] = this;\n    this.vnode = newVnode;\n    currentNode = parentNode;\n    return this.vnode;\n  }\n\n  _unmount() {\n    this.onUnmount();\n    this.life.unmount.forEach(fct => fct());\n    this.mounted = false;\n    this.life.unmount = [];\n  }\n\n  _mount() {\n    // do not mount in node\n    if ((process && process.title === 'node') || this.mounted) {\n      return;\n    }\n    this.onMount();\n    this.life.mount.forEach(fct => fct());\n    this.mounted = true;\n    this.life.mount = [];\n  }\n\n  _destroy() {\n    this.destroyed = true;\n    this._unmount();\n    this.parent = null;\n    this.children = [];\n    this.state = {};\n    // delete cache[this.name];\n    this.context = {};\n    this.componentsChildren = [];\n  }\n}\n\nfunction isClass(v) {\n  return typeof v === 'function' && /^\\s*class\\s+/.test(v.toString());\n}\n\nfunction createComponent(ComponentFct, attributes, children, name) {\n  const path = componentPath(name);\n  if (cache[path]) {\n    return cache[path]._render(attributes, children);\n  }\n  let component;\n  if (isClass(ComponentFct)) {\n    component = new ComponentFct(null, attributes, children, name);\n  } else {\n    component = new Component(ComponentFct, attributes, children, name);\n  }\n\n  return component._render(attributes, children);\n}\n\nfunction copyToThunk(vnode, thunk) {\n  thunk.elm = vnode.elm;\n  (vnode.data).fn = (thunk.data).fn;\n  (vnode.data).args = (thunk.data).args;\n  thunk.data = vnode.data;\n  thunk.children = vnode.children;\n  thunk.text = vnode.text;\n  thunk.elm = vnode.elm;\n}\n\nfunction prepatch(oldVnode, newNode) {\n  if (newNode.data.attrs.needRender === false) {\n    copyToThunk(oldVnode, newNode);\n  }\n}\n\nfunction h(name, attributes, children) {\n  const attrs = {};\n  let on;\n  let style;\n  let sclass;\n  let hook = { prepatch };\n  let key;\n  Object.entries(attributes).forEach((attr) => {\n    const [index, value] = attr;\n    if (index === 'on') {\n      on = value;\n    } else if (index === 'style') {\n      style = value;\n    } else if (index === 'key') {\n      key = value;\n    } else if (index === 'hooks') {\n      hook = { ...hook, ...value };\n    } else if (index === 'class') {\n      if (typeof value === 'string') {\n        attrs[index] = value;\n      } else {\n        sclass = value;\n      }\n    } else {\n      attrs[index] = value;\n    }\n  });\n  return snabbdomh.default(\n    name,\n    {\n      on, style, attrs, hook, class: sclass, key,\n    },\n    children,\n  );\n}\n\nconst patch = snabbdom.init([\n  attributes.default,\n  style.default,\n  eventlisteners.default,\n  sclass.default,\n]);\n\nlet renderPipeline = [];\nlet animationRequest = false;\n\nfunction scheduleRender(node) {\n  renderPipeline.push(node);\n  if (!animationRequest) {\n    animationRequest = true;\n    window.requestAnimationFrame(() => {\n      renderPipeline.forEach(node => node.partialRender());\n      animationRequest = false;\n      renderPipeline = [];\n    });\n  }\n}\n\nfunction destroyUnreferencedComponents() {\n  const keysCache = Object.keys(cache);\n  const keysNextCache = Object.keys(nextCache);\n  const difference = keysCache.filter(x => !keysNextCache.includes(x));\n  difference.forEach(path => cache[path]._destroy());\n}\n\nlet rootNode = new Component(() => {}, {}, [], 'root');\ncurrentNode = rootNode;\n\nconst newRoot = () => {\n  rootNode = new Component(() => {}, {}, [], 'root');\n  currentNode = rootNode;\n};\n\nfunction mount(dom, render) {\n  let vnode; let requested;\n  cache = {};\n  nextCache = {};\n  const target = window.document.createElement('div');\n  dom.innerHTML = '';\n  dom.appendChild(target);\n  function init() {\n    newRoot();\n    vnode = render();\n    vnode = patch(toVNode(target), vnode);\n    requested = false;\n    return vnode;\n  }\n  function refresh(callback) {\n    if (requested) {\n      return;\n    }\n    requested = true;\n    renderPipeline = [];\n    const rerender = () => {\n      let newVnode;\n      nextCache = {};\n      const now = (new Date()).getTime();\n      try {\n        newVnode = render();\n        // nothing to update\n        if (!newVnode) {\n          requested = false;\n          const after = (new Date()).getTime();\n          callback && callback(after - now);\n          return;\n        }\n        newRoot();\n        // error can happen during patching\n        patch(vnode, newVnode);\n      } catch (error) {\n        requested = false;\n        throw error;\n      }\n      const after = (new Date()).getTime();\n      vnode = newVnode;\n      destroyUnreferencedComponents();\n      cache = nextCache;\n      requested = false;\n      callback && callback(after - now);\n    };\n    window.requestAnimationFrame(() => {\n      rerender();\n      renderPipeline = [];\n    });\n  }\n  return { refresh, init };\n}\n\nmodule.exports = {\n  h,\n  patch,\n  mount,\n  c: createComponent,\n  Component,\n};\n\n\n//# sourceURL=webpack:///./node_modules/blop-language/src/runtime.js?");

/***/ }),

/***/ "./src/index.blop":
/*!************************!*\
  !*** ./src/index.blop ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const blop = __webpack_require__(/*! ./node_modules/blop-language/src/runtime.js */ \"./node_modules/blop-language/src/runtime.js\");\nlet TranslationList, TranslationPage, Index;\nlet main = __webpack_require__(/*! ./main.css */ \"./src/main.css\");\nlet EditModal = __webpack_require__(/*! ./modal.blop */ \"./src/modal.blop\").EditModal;\nlet getTranslation = __webpack_require__(/*! ./service.blop */ \"./src/service.blop\").getTranslation;\n\nTranslationList = (params, _children, _node) => {let newPath;\n  let { translations, path, filter, state } = params;\n  function _click(newPath) {\n    return function click(_e) {\n      state.edit = newPath;\n    }\n  };\n  function addKey() {let key;\n    key = prompt('Spaces, will converted in _');\n    if (!key) {\n      return \n    }\n    key = key.replace(/\\s/g, '_').toUpperCase();\n    state.edit = `${path}.${key}`;\n  };\n  const __1c = []; const __1a = {};\n    if (path && (!filter || path.toLowerCase().includes(filter.toLowerCase()))) {\n      const __2c = []; const __2a = {}; __2a['class'] = 'translation-key-value';\n        const __3c = []; const __3a = {}; __3a['class'] = 'translation-key';\n         const __3 = blop.h('span', __3a, __3c); __2c.push(__3);\n        const __4c = []; const __4a = {}; __4a['type'] = 'button'; __4a['class'] = 'btn btn-light translation-value'; __4a['on'] = ({ click: addKey }); const __5 = 'Add a translation key here'; Array.isArray(__5) ? __4c.push(...__5) : __4c.push(__5); const __4 = blop.h('button', __4a, __4c); __2c.push(__4);\n       const __2 = blop.h('li', __2a, __2c); __1c.push(__2);\n    }\n    let __6 = translations; let __7 = Object.keys(__6); let key; for(let __8=0; __8 < __7.length; __8++) { key = __7[__8]; let value = __6[key];\n      newPath = `${path}.${key}`;\n      if (!filter || newPath.toLowerCase().includes(filter.toLowerCase())) {\n        const __9c = []; const __9a = {}; __9a['class'] = 'translation-key-value';\n          const __10c = []; const __10a = {}; __10a['class'] = 'translation-key'; __10a['title'] = newPath; const __11 = key; Array.isArray(__11) ? __10c.push(...__11) : __10c.push(__11); const __10 = blop.h('span', __10a, __10c); __9c.push(__10);\n          if (value.length) {\n            const __12c = []; const __12a = {}; __12a['type'] = 'text'; __12a['class'] = 'translation-value form-control form-control-sm'; __12a['on'] = ({ click: _click(newPath, translations, key) }); __12a['value'] = value; const __12 = blop.h('input', __12a, __12c); __9c.push(__12);\n          } else {\n            const __13c = []; const __13a = {}; __13a['translations'] = value; __13a['filter'] = filter; __13a['path'] = `${path}.${key}`; __13a['state'] = state; const __13 = blop.c(TranslationList, __13a, __13c, '__13'); __9c.push(__13);\n          }\n         const __9 = blop.h('li', __9a, __9c); __1c.push(__9);\n      } else {\n        if (!value.length) {\n          const __14c = []; const __14a = {}; __14a['translations'] = value; __14a['filter'] = filter; __14a['path'] = `${path}.${key}`; __14a['state'] = state; const __14 = blop.c(TranslationList, __14a, __14c, '__14'); __1c.push(__14);\n        }\n      }\n    };\n   const __1 = blop.h('ul', __1a, __1c); return __1;\n};\n\nTranslationPage = (params, _children, node) => {\n  let { state } = params;\n  node.mount(() => {\n    getTranslation(state);\n  });\n  const __15c = []; const __15a = {}; __15a['class'] = 'translation-navigation container';\n    const __16c = []; const __16a = {}; const __17 = 'Translations tool'; Array.isArray(__17) ? __16c.push(...__17) : __16c.push(__17); const __16 = blop.h('h1', __16a, __16c); __15c.push(__16);\n    function keyup(e) {\n      state.filter = e.target.value;\n    };\n    if (state.edit) {\n      const __18c = []; const __18a = {}; __18a['state'] = state; const __18 = blop.c(EditModal, __18a, __18c, '__18'); __15c.push(__18);\n    }\n    if (state.translations) {\n      const __19c = []; const __19a = {}; __19a['class'] = 'form-group';\n        const __20c = []; const __20a = {}; __20a['for'] = 'filter'; const __21 = 'Filter'; Array.isArray(__21) ? __20c.push(...__21) : __20c.push(__21); const __20 = blop.h('label', __20a, __20c); __19c.push(__20);\n        const __22c = []; const __22a = {}; __22a['type'] = 'text'; __22a['on'] = ({ keyup }); __22a['class'] = 'form-control'; __22a['id'] = 'filter'; __22a['placeholder'] = 'Filter keys'; __22a['value'] = state.filter; const __22 = blop.h('input', __22a, __22c); __19c.push(__22);\n       const __19 = blop.h('div', __19a, __19c); __15c.push(__19);\n      const __23c = []; const __23a = {}; __23a['translations'] = state.translations[0].content; __23a['filter'] = state.filter; __23a['state'] = state; __23a['path'] = ''; const __23 = blop.c(TranslationList, __23a, __23c, '__23'); __15c.push(__23);\n    }\n    if (state.failed) {\n      const __24c = []; const __24a = {}; const __25 = `Error: ${JSON.stringify(state.failed)}`; Array.isArray(__25) ? __24c.push(...__25) : __24c.push(__25); const __24 = blop.h('p', __24a, __24c); __15c.push(__24);\n    }\n   const __15 = blop.h('div', __15a, __15c); return __15;\n};\n\nIndex = (state) => {\n  const __26c = []; const __26a = {}; __26a['state'] = state; const __26 = blop.c(TranslationPage, __26a, __26c, '__26'); return __26;\n};\n\n\n\nmodule.exports = { main, EditModal, getTranslation, TranslationList, TranslationPage, Index };\n\n\n//# sourceURL=webpack:///./src/index.blop?");

/***/ }),

/***/ "./src/lib/router.blop":
/*!*****************************!*\
  !*** ./src/lib/router.blop ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const blop = __webpack_require__(/*! ./node_modules/blop-language/src/runtime.js */ \"./node_modules/blop-language/src/runtime.js\");\nlet mockWindow;\n\nfunction escapeRegExp(str) {\n  return str.replace(/[.*+?^${}()|[\\]\\\\\\/]/g, '\\\\$&')\n};\n\nfunction createRegExp(str) {let escapedStr, names;\n  escapedStr = escapeRegExp(str);\n  names = [];\n  escapedStr = escapedStr.replace(/\\:(\\w+)/g, (_a, b) => {\n    names.push(b);\n    return '([\\\\w\\\\.\\\\-\\\\_]+)'\n  });\n  return ({ regexp: `^${escapedStr}`, names })\n};\n\nmockWindow = ({\n  addEventListener: () => {},\n  location: ({ pathname: '/' }),\n  history: ({ pushState: () => {} })\n});\n\nclass Router {\n  constructor(initial, state, global=mockWindow) {\n    this.routes = [];\n    this.state = state;\n    this.state.$.router = this;\n    this.global = global;\n    global.addEventListener('popstate', (e) => {let matchedRoute;\n      if (e.state === null) {\n        initial && initial();\n      } else {\n        matchedRoute = this.routes.find(\n          (route) =>route.path === e.state.path);\n        matchedRoute && matchedRoute.handler(e.state.params, this.state);\n      }\n    });\n  }\n\n  init() {\n    this.go(this.global.location.pathname, true);\n  }\n\n  add(route) {\n    let { regexp, names } = createRegExp(route.path);\n    route.reg = new RegExp(regexp);\n    route.params = names;\n    this.routes.push(route);\n  }\n\n  match(path) {let m, params, matchedRoute;\n    m = null;\n    params = ({});\n    matchedRoute = this.routes.find((route) => {\n      m = path.match(route.reg);\n      if (m) {\n        if (route.params) {\n          let __1 = route.params; let index=0; for(; index < __1.length; index++) { let value = __1[index];\n            params[value] = m[1 + index];\n          };\n        }\n        return true\n      }\n    });\n    if (matchedRoute) {\n      return ({ route: matchedRoute, params: params })\n    }\n  }\n\n  async go(path, push=true) {let m;\n    m = this.match(path);\n    if (!m) {\n      console.log(`No route for path ${path}`);\n      return \n    }\n    if (push) {\n      this.global.history.pushState(({\n          name: m.route.name,\n          path: m.route.path,\n          params: m.params\n        }),\n        m.route.name, path);\n    }\n    if (m.route.handler) {\n      await m.route.handler(m.params, this.state);\n    }\n  }\n\n }\n\nmodule.exports = { escapeRegExp, createRegExp, mockWindow, Router };\n\n\n//# sourceURL=webpack:///./src/lib/router.blop?");

/***/ }),

/***/ "./src/lib/state.blop":
/*!****************************!*\
  !*** ./src/lib/state.blop ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const blop = __webpack_require__(/*! ./node_modules/blop-language/src/runtime.js */ \"./node_modules/blop-language/src/runtime.js\");\nfunction isObject(value) {\n  if (value === null || value === undefined) {\n    return false\n  }\n  return value.constructor === Object || typeof value === 'object'\n};\n\nfunction create(state, options=({ readOnly: false })) {let modificationTable, callbacks, hasBeenFlushed, root;\n  modificationTable = [];\n  callbacks = [];\n  let { readOnly } = options;\n  hasBeenFlushed = false;\n  function flush() {\n    modificationTable = [];\n    hasBeenFlushed = true;\n  };\n  function listen(callback) {\n    callbacks.push(callback);\n  };\n  function trigger(path) {\n    callbacks.forEach((fct) =>fct(path));\n  };\n  root = ({\n    flush,\n    listen,\n    trigger,\n    modificationTable,\n    raw: state\n  });\n  function handler(currentState, path='', _parentState) {\n    function hasChanged(extrapath='') {let completePath;\n      // just to return true on the first time\n      if (!hasBeenFlushed) {\n        return true\n      }\n      completePath = `${path}${extrapath}`;\n      return !!modificationTable.find(\n        (modification) =>modification.path.startsWith(completePath))\n    };\n    return ({\n      get: (function (obj, prop) {\n        if (prop === '$') {\n          return root\n        }\n        if (prop === 'hasChanged') {\n          return hasChanged\n        }\n        // be sure to not double wrap a Proxy\n        if (isObject(obj[prop]) && !obj[prop].$) {\n          return new Proxy(\n            currentState[prop],\n            handler(currentState[prop],\n            `${path}.${prop}`, currentState))\n        }\n        return obj[prop]\n      }),\n      set: (function (obj, prop, value) {\n        if (readOnly) {\n          throw new Error(`${obj}.${prop} is read only`)\n        }\n        if (prop === '$') {\n          throw new Error('You cannot redefine the $ property in a proxied state')\n        }\n        modificationTable.push(({ path: `${path}.${prop}`, action: 'set', value }));\n        obj[prop] = value;\n        trigger(`${path}.${prop}`);\n        return true\n      }),\n      deleteProperty: (function (target, prop) {\n        if (readOnly) {\n          throw new Error(`target.${prop} is read only`)\n        }\n        if (target.hasOwnProperty(prop)) {\n          modificationTable.push(({ path: `${path}.${prop}`, action: 'delete' }));\n          delete target[prop];\n        } else {\n          return false\n        }\n        trigger(`${path}.${prop}`);\n        return true\n      })\n    })\n  };\n  return new Proxy(state, handler(state))\n};\n\nmodule.exports = { isObject, create };\n\n\n//# sourceURL=webpack:///./src/lib/state.blop?");

/***/ }),

/***/ "./src/main.css":
/*!**********************!*\
  !*** ./src/main.css ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\n//# sourceURL=webpack:///./src/main.css?");

/***/ }),

/***/ "./src/modal.blop":
/*!************************!*\
  !*** ./src/modal.blop ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const blop = __webpack_require__(/*! ./node_modules/blop-language/src/runtime.js */ \"./node_modules/blop-language/src/runtime.js\");\nlet previousValues, EditModal;\n\n\nasync function putTranslation(state, lang) {let _response;\n  state.loadingTranslation = true;\n  try {\n    _response = await fetch('/update-translation', ({\n      method: 'PUT',\n      headers: ({\n        'Content-Type': 'application/json'\n      }),\n      body: JSON.stringify(lang)\n    }));\n  } catch(_e) {\n    state.loadingTranslation = false;\n    return \n  }\n  state.loadingTranslation = false;\n};\n\nfunction getValue(trans, path) {let v;\n  v = trans;\n  let __2 = path; let __3 = Object.keys(__2); let _i__1; for(let __4=0; __4 < __3.length; __4++) { _i__1 = __3[__4]; let p = __2[_i__1];\n    v = v[p];\n    if (!v) {\n      return v\n    }\n  };\n  return v\n};\n\nfunction putValue(lang, path, value) {let v, last, parent, parentPath, ordered;\n  v = lang.content;\n  path = [...path];\n  last = path.pop();\n  parent = null;\n  parentPath = null;\n  let __6 = path; let __7 = Object.keys(__6); let _i__5; for(let __8=0; __8 < __7.length; __8++) { _i__5 = __7[__8]; let p = __6[_i__5];\n    parent = v;\n    parentPath = p;\n    v = v[p];\n  };\n  v[last] = value;\n  if (parent) {\n    ordered = ({});\n    Object.keys(v).sort().forEach((key) => {\n      ordered[key] = v[key];\n    });\n    parent[parentPath] = ordered;\n  }\n};\n\n// this make the component a singeton\npreviousValues = [];\n\nEditModal = (params, _children, node) => {let path, value, __35;\n  let { state } = params;\n  let { edit } = state;\n  path = edit.split('.').splice(1);\n  node.mount(() => {\n    console.log('mount');\n    previousValues = [];\n    let __10 = state.translations; let __11 = Object.keys(__10); let _i__9; for(let __12=0; __12 < __11.length; __12++) { _i__9 = __11[__12]; let _lang = __10[_i__9];\n      previousValues.push(getValue(_lang.content, path));\n    };\n  });\n\n  function cancel() {let i;\n    state.edit = null;\n    i = 0;\n    let __14 = state.translations; let __15 = Object.keys(__14); let _i__13; for(let __16=0; __16 < __15.length; __16++) { _i__13 = __15[__16]; let lang = __14[_i__13];\n      putValue(lang, path, previousValues[i]);\n      i = i + 1;\n    };\n  };\n\n  function save() {\n    let __18 = state.translations; let __19 = Object.keys(__18); let _i__17; for(let __20=0; __20 < __19.length; __20++) { _i__17 = __19[__20]; let _lang = __18[_i__17];\n      putTranslation(state, _lang);\n    };\n    state.edit = null;\n  };\n\n  function change(lang) {\n    return (e) => {\n      putValue(lang, path, e.target.value);\n    }\n  };\n\n  const __21c = []; const __21a = {}; __21a['class'] = 'modal'; __21a['tabindex'] = '-1'; __21a['role'] = 'dialog';\n    const __22c = []; const __22a = {}; __22a['class'] = 'modal-dialog'; __22a['role'] = 'document';\n      const __23c = []; const __23a = {}; __23a['class'] = 'modal-content';\n        const __24c = []; const __24a = {}; __24a['class'] = 'modal-header';\n          const __25c = []; const __25a = {}; __25a['class'] = 'modal-title'; const __26 = `Edit key ${edit}`; Array.isArray(__26) ? __25c.push(...__26) : __25c.push(__26); const __25 = blop.h('h5', __25a, __25c); __24c.push(__25);\n          const __27c = []; const __27a = {}; __27a['type'] = 'button'; __27a['class'] = 'close'; __27a['data-dismiss'] = 'modal'; __27a['aria-label'] = 'Close'; __27a['on'] = ({ click: cancel });\n            const __28c = []; const __28a = {}; __28a['aria-hidden'] = 'true'; const __28 = blop.h('span', __28a, __28c); __27c.push(__28);\n           const __27 = blop.h('button', __27a, __27c); __24c.push(__27);\n         const __24 = blop.h('div', __24a, __24c); __23c.push(__24);\n        const __29c = []; const __29a = {}; __29a['class'] = 'modal-body';\n          let __31 = state.translations; let __32 = Object.keys(__31); let _i__30; for(let __33=0; __33 < __32.length; __33++) { _i__30 = __32[__33]; let lang = __31[_i__30];\n            value = getValue(lang.content, path);\n            const __34c = []; const __34a = {}; __34a['class'] = 'modal-translation';\n              __35 = lang.file; Array.isArray(__35) ? __34c.push(...__35) : __34c.push(__35); ;\n              const __36c = []; const __36a = {}; __36a['type'] = 'text'; __36a['on'] = ({ change: change(lang) }); __36a['class'] = 'translation-value form-control form-control-sm'; __36a['value'] = value; const __36 = blop.h('input', __36a, __36c); __34c.push(__36);\n             const __34 = blop.h('label', __34a, __34c); __29c.push(__34);\n          };\n         const __29 = blop.h('div', __29a, __29c); __23c.push(__29);\n        const __37c = []; const __37a = {}; __37a['class'] = 'modal-footer';\n          const __38c = []; const __38a = {}; __38a['type'] = 'button'; __38a['class'] = 'btn btn-secondary'; __38a['data-dismiss'] = 'modal'; __38a['on'] = ({ click: cancel }); const __39 = 'Close and cancel'; Array.isArray(__39) ? __38c.push(...__39) : __38c.push(__39); const __38 = blop.h('button', __38a, __38c); __37c.push(__38);\n          const __40c = []; const __40a = {}; __40a['type'] = 'button'; __40a['class'] = 'btn btn-primary'; __40a['on'] = ({ click: save }); const __41 = 'Save changes'; Array.isArray(__41) ? __40c.push(...__41) : __40c.push(__41); const __40 = blop.h('button', __40a, __40c); __37c.push(__40);\n         const __37 = blop.h('div', __37a, __37c); __23c.push(__37);\n       const __23 = blop.h('div', __23a, __23c); __22c.push(__23);\n     const __22 = blop.h('div', __22a, __22c); __21c.push(__22);\n   const __21 = blop.h('div', __21a, __21c); return __21;\n  };\nmodule.exports = { putTranslation, getValue, putValue, previousValues, EditModal };\n\n\n//# sourceURL=webpack:///./src/modal.blop?");

/***/ }),

/***/ "./src/routing.blop":
/*!**************************!*\
  !*** ./src/routing.blop ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const blop = __webpack_require__(/*! ./node_modules/blop-language/src/runtime.js */ \"./node_modules/blop-language/src/runtime.js\");\nlet { Router } = __webpack_require__(/*! ./lib/router.blop */ \"./src/lib/router.blop\");\n\nasync function indexHandler(_params, state) {\n  state.page = 'index';\n  console.log('indexHandler called');\n};\n\nfunction createRouter(state, global) {let router;\n  router = new Router(null, state, global);\n\n  router.add(({ path: '/404/:reason/', name: '404', handler: (params) => {\n      state.page = '';\n      state.reason = params.reason;\n    }\n  }));\n  router.add(({ path: '/', name: 'root', handler: indexHandler }));\n  return router\n};\nmodule.exports = { Router, indexHandler, createRouter };\n\n\n//# sourceURL=webpack:///./src/routing.blop?");

/***/ }),

/***/ "./src/server.blop":
/*!*************************!*\
  !*** ./src/server.blop ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const blop = __webpack_require__(/*! ./node_modules/blop-language/src/runtime.js */ \"./node_modules/blop-language/src/runtime.js\");\nlet app, savedState, render, locales, GREEN, NC;\nlet express = __webpack_require__(/*! express */ \"express\");\nlet { Index } = __webpack_require__(/*! ./index.blop */ \"./src/index.blop\");\nlet { createState } = __webpack_require__(/*! ./state.blop */ \"./src/state.blop\");\nlet { createRouter } = __webpack_require__(/*! ./routing.blop */ \"./src/routing.blop\");\nlet webpack = __webpack_require__(/*! webpack */ \"webpack\");\nlet middleware = __webpack_require__(/*! webpack-dev-middleware */ \"webpack-dev-middleware\");\nlet toHTML = __webpack_require__(/*! snabbdom-to-html */ \"snabbdom-to-html\");\nlet nodepath = __webpack_require__(/*! path */ \"path\");\nlet webpackClientConf = __webpack_require__(/*! ../webpack.client.js */ \"./webpack.client.js\");\nlet bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\nlet fs = __webpack_require__(/*! fs */ \"fs\");\nlet pathModule = __webpack_require__(/*! path */ \"path\");\nlet process = __webpack_require__(/*! process */ \"process\");\n\napp = express();\napp.use(bodyParser.json());\n\n/* If there is any client state that needs\n   to be saved on the server (session data),\n   this should go in there */\nsavedState = null;\n\nrender = async (path) => {let state, router, tree;\n  state = createState(null);\n  router = createRouter(state);\n  await router.go(path);\n  tree = Index(state);\n  console.log(`Server render executed for ${path}`);\n  return tree\n};\n\nfunction escapeJSON(json) {\n  return JSON.stringify(json).replace(/</gm, '&lt;')\n};\n\nlocales = [];\n\napp.get('/raw-json', (_req, res) => {let files;\n  files = [];\n  let __2 = locales; let _i__1=0; for(; _i__1 < __2.length; _i__1++) { let local = __2[_i__1];\n    files.push(({\n      file: local,\n      content: JSON.parse(fs.readFileSync(local).toString())\n    }));\n  };\n  res.json(files);\n});\n\napp.put('/update-translation', (req, res) => {\n  fs.writeFileSync(req.body.file, `${JSON.stringify(req.body.content, null, 2)}\\n`);\n  res.json(({}));\n});\n\napp.get('/', async (req, res) => {let html, state;\n  html = toHTML(await render(req.path));\n  state = createState(savedState);\n  res.send(`\n    <html>\n      <head>\n        <title>Translation tool</title>\n        <link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css\" integrity=\"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T\" crossorigin=\"anonymous\">\n      </head>\n      <body>\n        <div id=\"app\">\n          ${html}\n        </div>\n      </body>\n      <script>window.INITIAL_STATE = ${escapeJSON(savedState || state)}</script>\n      <script src=\"/bundle/client.js\"></script>\n      <script src=\"https://code.jquery.com/jquery-3.3.1.slim.min.js\" integrity=\"sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo\" crossorigin=\"anonymous\"></script>\n      <script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js\" integrity=\"sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1\" crossorigin=\"anonymous\"></script>\n      <script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js\" integrity=\"sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM\" crossorigin=\"anonymous\"></script>\n    </html>\n  `);\n});\n\nGREEN = '\\x1b[32m';\nNC = '\\x1B[0m';\n\nfunction run(port=3000, config) {let compiler, instance;\n  function serverReady() {\n    console.log(`${GREEN}[server]${NC} Running on http://localhost:${port}`);\n  };\n  // we only rebuild the client config\n  locales = config.locales;\n  compiler = webpack(webpackClientConf);\n  instance = middleware(compiler, ({\n    publicPath: '/bundle'\n  }));\n  app.use(instance);\n  instance.waitUntilValid(serverReady);\n  app.listen(port, serverReady);\n};\n\nif (process.env.RUN) {\n  run(3000, ({ locales: [\n    './src/translation/en.json',\n    './src/translation/fr.json'\n  ]\n  }));\n}\n\nfunction runStatic(port=3000, config) {let file;\n  file = pathModule.resolve(__dirname, '..', 'dist', 'client.js');\n  app.get('/bundle/client.js', (_req, res) => {\n    res.send(fs.readFileSync(file).toString());\n  });\n  function serverReady() {\n    console.log(`${GREEN}[server]${NC} Running on http://localhost:${port}`);\n  };\n  locales = config.locales;\n  app.listen(port, serverReady);\n};\n\nmodule.exports = { express, Index, createState, createRouter, webpack, middleware, toHTML, nodepath, webpackClientConf, bodyParser, fs, pathModule, process, app, savedState, render, escapeJSON, locales, GREEN, NC, run, runStatic };\n\n\n//# sourceURL=webpack:///./src/server.blop?");

/***/ }),

/***/ "./src/service.blop":
/*!**************************!*\
  !*** ./src/service.blop ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const blop = __webpack_require__(/*! ./node_modules/blop-language/src/runtime.js */ \"./node_modules/blop-language/src/runtime.js\");\nlet loadingTranslation;\nlet { default: fetch } = __webpack_require__(/*! node-fetch */ \"node-fetch\");\nloadingTranslation = false;\n\nasync function getTranslation(state) {let response;\n  loadingTranslation = true;\n  try {\n    response = await fetch('/raw-json');\n  } catch(e) {\n    loadingTranslation = false;\n    state.failed = e;\n    return \n  }\n  loadingTranslation = false;\n  state.translations = await response.json();\n};\nmodule.exports = { fetch, loadingTranslation, getTranslation };\n\n\n//# sourceURL=webpack:///./src/service.blop?");

/***/ }),

/***/ "./src/state.blop":
/*!************************!*\
  !*** ./src/state.blop ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const blop = __webpack_require__(/*! ./node_modules/blop-language/src/runtime.js */ \"./node_modules/blop-language/src/runtime.js\");\nlet state;\nlet create = __webpack_require__(/*! ./lib/state.blop */ \"./src/lib/state.blop\").create;\n\nstate = ({\n  page: 'index',\n  pages: ({\n    index: ({\n      content: 'Hello World!'\n    })\n  })\n});\n\nfunction createState(initialState) {\n  return create(initialState || state)\n};\n\nmodule.exports = { create, state, createState };\n\n\n//# sourceURL=webpack:///./src/state.blop?");

/***/ }),

/***/ "./webpack.client.js":
/*!***************************!*\
  !*** ./webpack.client.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const path = __webpack_require__(/*! path */ \"path\");\n/* eslint-disable import/no-extraneous-dependencies */\nconst webpack = __webpack_require__(/*! webpack */ \"webpack\");\n/* eslint-enable import/no-extraneous-dependencies */\n\nconst clientConfig = {\n  mode: 'development',\n  devtool: 'eval-source-map',\n  stats: 'normal',\n  target: 'web',\n  entry: './src/client.blop',\n  output: {\n    path: path.resolve(__dirname, 'dist'),\n    filename: 'client.js',\n  },\n  module: {\n    rules: [\n      {\n        test: /\\.blop$/,\n        use: [\n          {\n            loader: 'blop-language/src/loader',\n            options: {\n              debug: !!process.env.BLOP_DEBUG,\n              sourceMap: true,\n              strictness: 'perfect',\n            },\n          },\n        ],\n      },\n      {\n        test: /\\.css$/i,\n        use: ['style-loader', 'css-loader'],\n      },\n    ],\n  },\n  plugins: [\n    new webpack.SourceMapDevToolPlugin({}),\n    new webpack.DefinePlugin({\n      SERVER: false,\n    }),\n  ],\n};\n\nmodule.exports = clientConfig;\n\n\n//# sourceURL=webpack:///./webpack.client.js?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "node-fetch":
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"node-fetch\");\n\n//# sourceURL=webpack:///external_%22node-fetch%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"process\");\n\n//# sourceURL=webpack:///external_%22process%22?");

/***/ }),

/***/ "snabbdom":
/*!***************************!*\
  !*** external "snabbdom" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"snabbdom\");\n\n//# sourceURL=webpack:///external_%22snabbdom%22?");

/***/ }),

/***/ "snabbdom-to-html":
/*!***********************************!*\
  !*** external "snabbdom-to-html" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"snabbdom-to-html\");\n\n//# sourceURL=webpack:///external_%22snabbdom-to-html%22?");

/***/ }),

/***/ "snabbdom/h":
/*!*****************************!*\
  !*** external "snabbdom/h" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"snabbdom/h\");\n\n//# sourceURL=webpack:///external_%22snabbdom/h%22?");

/***/ }),

/***/ "snabbdom/modules/attributes":
/*!**********************************************!*\
  !*** external "snabbdom/modules/attributes" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"snabbdom/modules/attributes\");\n\n//# sourceURL=webpack:///external_%22snabbdom/modules/attributes%22?");

/***/ }),

/***/ "snabbdom/modules/class":
/*!*****************************************!*\
  !*** external "snabbdom/modules/class" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"snabbdom/modules/class\");\n\n//# sourceURL=webpack:///external_%22snabbdom/modules/class%22?");

/***/ }),

/***/ "snabbdom/modules/eventlisteners":
/*!**************************************************!*\
  !*** external "snabbdom/modules/eventlisteners" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"snabbdom/modules/eventlisteners\");\n\n//# sourceURL=webpack:///external_%22snabbdom/modules/eventlisteners%22?");

/***/ }),

/***/ "snabbdom/modules/style":
/*!*****************************************!*\
  !*** external "snabbdom/modules/style" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"snabbdom/modules/style\");\n\n//# sourceURL=webpack:///external_%22snabbdom/modules/style%22?");

/***/ }),

/***/ "snabbdom/tovnode":
/*!***********************************!*\
  !*** external "snabbdom/tovnode" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"snabbdom/tovnode\");\n\n//# sourceURL=webpack:///external_%22snabbdom/tovnode%22?");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack\");\n\n//# sourceURL=webpack:///external_%22webpack%22?");

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-dev-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-dev-middleware%22?");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0EiLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvc2VydmVyLmJsb3BcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9