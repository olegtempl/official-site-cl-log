(function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function callAfter(fn, i) {
		if (i === 0) fn();
		return () => {
			if (!--i) fn();
		};
	}

	function addLoc(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		fn();
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function destroyEach(iterations, detach) {
		for (var i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detach);
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function createComment() {
		return document.createComment('');
	}

	function addListener(node, event, handler) {
		node.addEventListener(event, handler, false);
	}

	function removeListener(node, event, handler) {
		node.removeEventListener(event, handler, false);
	}

	function setAttribute(node, attribute, value) {
		node.setAttribute(attribute, value);
	}

	function setData(text, data) {
		text.data = '' + data;
	}

	function blankObject() {
		return Object.create(null);
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = noop;

		this._fragment.d(detach !== false);
		this._fragment = null;
		this._state = {};
	}

	function destroyDev(detach) {
		destroy.call(this, detach);
		this.destroy = function() {
			console.warn('Component was already destroyed');
		};
	}

	function _differs(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function _differsImmutable(a, b) {
		return a != a ? b == b : a !== b;
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			var handler = handlers[i];

			if (!handler.__calling) {
				try {
					handler.__calling = true;
					handler.call(this, data);
				} finally {
					handler.__calling = false;
				}
			}
		}
	}

	function flush(component) {
		component._lock = true;
		callAll(component._beforecreate);
		callAll(component._oncreate);
		callAll(component._aftercreate);
		component._lock = false;
	}

	function get() {
		return this._state;
	}

	function init(component, options) {
		component._handlers = blankObject();
		component._slots = blankObject();
		component._bind = options._bind;
		component._staged = {};

		component.options = options;
		component.root = options.root || component;
		component.store = options.store || component.root.store;

		if (!options.root) {
			component._beforecreate = [];
			component._oncreate = [];
			component._aftercreate = [];
		}
	}

	function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		flush(this.root);
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		newState = assign(this._staged, newState);
		this._staged = {};

		for (var key in newState) {
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			this.fire("state", { changed: changed, current: this._state, previous: oldState });
			this._fragment.p(changed, this._state);
			this.fire("update", { changed: changed, current: this._state, previous: oldState });
		}
	}

	function _stage(newState) {
		assign(this._staged, newState);
	}

	function setDev(newState) {
		if (typeof newState !== 'object') {
			throw new Error(
				this._debugName + '.set was called without an object of data key-values to update.'
			);
		}

		this._checkReadOnly(newState);
		set.call(this, newState);
	}

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
	}

	function _mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	function removeFromStore() {
		this.store._remove(this);
	}

	var protoDev = {
		destroy: destroyDev,
		get,
		fire,
		on,
		set: setDev,
		_recompute: noop,
		_set,
		_stage,
		_mount,
		_differs
	};

	var methodsDataEn = {
	  exampleHeadline: "Text output in the console in",
	  exampleSpan: " color",
	  methodName: "method",
	  exampleToUseHeadline: "example to use",
	  exampleCommandTextUseMethod: "cl.yel('Hi, I'm ",
	  resultTextUseMethod: "Hi, I'm "
	};

	var methodRedEn = {
	  colorName: "red",
	  methodName: "red",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodGreEn = {
	  colorName: "green",
	  methodName: "gre",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodYelEn = {
	  colorName: "yellow",
	  methodName: "yel",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodBluEn = {
	  colorName: "blue",
	  methodName: "blu",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodMagEn = {
	  colorName: "magenta",
	  methodName: "mag",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodCyaEn = {
	  colorName: "cyan",
	  methodName: "cya",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodWhiEn = {
	  colorName: "white",
	  methodName: "whi",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodLogEn = {
	  colorName: "usual console.log",
	  methodName: "log",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodsDataRu = {
	  exampleHeadline: "Text output in the console in",
	  exampleSpan: " color",
	  exampleToUseHeadline: "example to use",
	  exampleCommandTextUseMethod: "cl.yel('Hi, I'm ",
	  resultTextUseMethod: "Hi, I'm "
	};

	var methodRedRu = {
	  colorName: "red",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodGreRu = {
	  colorName: "green",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodYelRu = {
	  colorName: "yellow",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodBluRu = {
	  colorName: "blue",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodMagRu = {
	  colorName: "magenta",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodCyaRu = {
	  colorName: "cyan",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodWhiRu = {
	  colorName: "white",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodLogRu = {
	  colorName: "usual console.log",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodsDataBy = {
	  exampleHeadline: "Text output in the console in",
	  exampleSpan: " color",
	  exampleToUseHeadline: "example to use",
	  exampleCommandTextUseMethod: "cl.yel('Hi, I'm ",
	  resultTextUseMethod: "Hi, I'm "
	};

	var methodRedBy = {
	  colorName: "red",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodGreBy = {
	  colorName: "green",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodYelBy = {
	  colorName: "yellow",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodBluBy = {
	  colorName: "blue",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodMagBy = {
	  colorName: "magenta",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodCyaBy = {
	  colorName: "cyan",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodWhiBy = {
	  colorName: "white",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	var methodLogBy = {
	  colorName: "usual console.log",
	  exampleText:
	    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
	};

	/**
	 *  добавить слово импорт)
	 *  перевести для дирректорий ru и by
	 */

	const allData = {
	  // Text on english language
	  methodsDataEn,
	  methodRedEn,
	  methodGreEn,
	  methodYelEn,
	  methodBluEn,
	  methodMagEn,
	  methodCyaEn,
	  methodWhiEn,
	  methodLogEn,
	  methodsDataRu,
	  methodRedRu,
	  methodGreRu,
	  methodYelRu,
	  methodBluRu,
	  methodMagRu,
	  methodCyaRu,
	  methodWhiRu,
	  methodLogRu,
	  methodsDataBy,
	  methodRedBy,
	  methodGreBy,
	  methodYelBy,
	  methodBluBy,
	  methodMagBy,
	  methodCyaBy,
	  methodWhiBy,
	  methodLogBy
	};

	/**
	 * 	@description The constructor cl (Colorful console log) - (short for colorLog) is syntactic sugar,
	 * It is intended to create a shortened record of a frequently used command console.log ().
	 * It also has a number of methods for color output of information. Methods have short-
	 * First names, first three letters of color in which the information will be displayed.
	 * @param {bla} - (abbreviated from 'black'), the information is highlighted in black.
	 * @param {red} - information is highlighted in red.
	 * @param {gre} - (short for 'green'), the information is highlighted in green.
	 * @param {yel} - (short for 'yellow'), the information is highlighted in yellow.
	 * @param {blu} - (abbreviated from 'blue'), the information is highlighted in blue.
	 * @param {mag} - (short for 'magenta'), the information is highlighted in the color of the magenta.
	 * @param {cya} - (abbreviated from 'cyan'), the information is highlighted in the color of cyan.
	 * @param {whi} - (abbreviated from 'white'), the information is highlighted in white.
	 * There are also other methods.
	 * @param {methods} - lists all methods for color output of information.
	 * @param {log} - normal logging as with console.log ().
	 * @param {dir} - displays the list of properties of the specified object, as with console.dir
	 * @description Takes only one argument.
	 * @param {content} - what you need to output to the console..
	 */

	/* src/components/documentation/checkboxes/Red.html generated by Svelte v2.14.1 */

	function data() {
	  return {
	    classeColorCheckbox: "color-checkbox__input_color_red",
	    classesColorText: "color-text__method-red",
	    // labelForIdCheckboxes: "red",
	    // idCheckboxes: "red",
	    methodName: allData.methodRedEn.methodName
	  }
	}
	var methods = {
	  printInfoForMethodRed() {
	    store.set({
	      classColorText: "color-text__method-red",
	      classSection: "red-command",
	      methodName: allData.methodRedEn.methodName,
	      colorNameOnPage: allData.methodRedEn.colorName,
	      exampleTextOnPage: allData.methodRedEn.exampleText
	      // colorNameRu: allData.methodRedRu.colorName,
	      // exampleTextRu: allData.methodRedRu.exampleText,
	      // colorNameBy: allData.methodRedBy.colorName,
	      // exampleTextBy: allData.methodRedBy.exampleText,
	    });
	    // cl.red(`Hi, I'm red color text!`)
	  }
	};

	const file = "src/components/documentation/checkboxes/Red.html";

	function create_main_fragment(component, ctx) {
		var div, p, input, text0, text1, current;

		function click_handler(event) {
			component.printInfoForMethodRed();
		}

		return {
			c: function create() {
				div = createElement("div");
				p = createElement("p");
				input = createElement("input");
				text0 = createText("\n    ");
				text1 = createText(ctx.methodName);
				addListener(input, "click", click_handler);
				input.name = "color";
				setAttribute(input, "type", "radio");
				input.checked = true;
				addLoc(input, file, 10, 4, 318);
				p.className = "" + ctx.classesColorText + " svelte-j6un2j";
				addLoc(p, file, 9, 2, 283);
				div.className = "container-checkbox";
				addLoc(div, file, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, p);
				append(p, input);
				append(p, text0);
				append(p, text1);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.methodName) {
					setData(text1, ctx.methodName);
				}

				if (changed.classesColorText) {
					p.className = "" + ctx.classesColorText + " svelte-j6un2j";
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "click", click_handler);
			}
		};
	}

	function Red(options) {
		this._debugName = '<Red>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data(), options.data);
		if (!('classesColorText' in this._state)) console.warn("<Red> was created without expected data property 'classesColorText'");
		if (!('methodName' in this._state)) console.warn("<Red> was created without expected data property 'methodName'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Red.prototype, protoDev);
	assign(Red.prototype, methods);

	Red.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/components/documentation/checkboxes/Gre.html generated by Svelte v2.14.1 */

	function data$1() {
	  return {
	    classeColorCheckbox: "color-checkbox__input_color_green",
	    classesColorText: "color-text__method-green",
	    // labelForIdCheckboxes: "green",
	    // idCheckboxes: "green",
	    methodName: allData.methodGreEn.methodName
	  }
	}
	var methods$1 = {
	  printInfoForMethodGre() {
	    store.set({
	      classColorText: "color-text__method-green",
	      classSection: "gre-command",
	      methodName: allData.methodGreEn.methodName,
	      colorNameOnPage: allData.methodGreEn.colorName,
	      exampleTextOnPage: allData.methodGreEn.exampleText
	      // colorNameRu: allData.methodGreRu.colorName,
	      // exampleTextRu: allData.methodGreRu.exampleText,
	      // colorNameBy: allData.methodGreBy.colorName,
	      // exampleTextBy: allData.methodGreBy.exampleText
	    });
	    // cl.gre(`Hi, I'm green color text!`)
	  }
	};

	const file$1 = "src/components/documentation/checkboxes/Gre.html";

	function create_main_fragment$1(component, ctx) {
		var div, p, input, text0, text1, p_class_value, current;

		function click_handler(event) {
			component.printInfoForMethodGre();
		}

		return {
			c: function create() {
				div = createElement("div");
				p = createElement("p");
				input = createElement("input");
				text0 = createText("\n    ");
				text1 = createText(ctx.methodName);
				addListener(input, "click", click_handler);
				input.name = "color";
				setAttribute(input, "type", "radio");
				addLoc(input, file$1, 11, 4, 341);
				p.className = p_class_value = "color " + ctx.classesColorText + " svelte-tx01hu";
				addLoc(p, file$1, 10, 2, 300);
				div.className = "container-checkbox";
				addLoc(div, file$1, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, p);
				append(p, input);
				append(p, text0);
				append(p, text1);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.methodName) {
					setData(text1, ctx.methodName);
				}

				if ((changed.classesColorText) && p_class_value !== (p_class_value = "color " + ctx.classesColorText + " svelte-tx01hu")) {
					p.className = p_class_value;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "click", click_handler);
			}
		};
	}

	function Gre(options) {
		this._debugName = '<Gre>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$1(), options.data);
		if (!('classesColorText' in this._state)) console.warn("<Gre> was created without expected data property 'classesColorText'");
		if (!('methodName' in this._state)) console.warn("<Gre> was created without expected data property 'methodName'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$1(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Gre.prototype, protoDev);
	assign(Gre.prototype, methods$1);

	Gre.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/components/documentation/checkboxes/Yel.html generated by Svelte v2.14.1 */

	function data$2() {
	  return {
	    classeColorCheckbox: "color-checkbox__input_color_yellow",
	    classesColorText: "color-text__method-yellow",
	    // labelForIdCheckboxes: "yellow",
	    // idCheckboxes: "yellow",
	    methodName: allData.methodYelEn.methodName
	  }
	}
	var methods$2 = {
	  printInfoForMethodYel() {
	    store.set({
	      classColorText: "color-text__method-yellow",
	      classSection: "yel-command",
	      methodName: allData.methodYelEn.methodName,
	      colorNameOnPage: allData.methodYelEn.colorName,
	      exampleTextOnPage: allData.methodYelEn.exampleText
	      // colorNameRu: allData.methodYelRu.colorName,
	      // exampleTextRu: allData.methodYelRu.exampleText,
	      // colorNameBy: allData.methodYelBy.colorName,
	      // exampleTextBy: allData.methodYelBy.exampleText
	    });
	    // cl.yel(`Hi, I'm yellow color text!`)
	  }
	};

	const file$2 = "src/components/documentation/checkboxes/Yel.html";

	function create_main_fragment$2(component, ctx) {
		var div, p, input, text0, text1, current;

		function click_handler(event) {
			component.printInfoForMethodYel();
		}

		return {
			c: function create() {
				div = createElement("div");
				p = createElement("p");
				input = createElement("input");
				text0 = createText("\n    ");
				text1 = createText(ctx.methodName);
				addListener(input, "click", click_handler);
				input.name = "color";
				setAttribute(input, "type", "radio");
				addLoc(input, file$2, 11, 4, 384);
				p.className = "" + ctx.classesColorText + " svelte-5z9j9w";
				addLoc(p, file$2, 10, 2, 349);
				div.className = "container-checkbox";
				addLoc(div, file$2, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, p);
				append(p, input);
				append(p, text0);
				append(p, text1);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.methodName) {
					setData(text1, ctx.methodName);
				}

				if (changed.classesColorText) {
					p.className = "" + ctx.classesColorText + " svelte-5z9j9w";
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "click", click_handler);
			}
		};
	}

	function Yel(options) {
		this._debugName = '<Yel>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$2(), options.data);
		if (!('classesColorText' in this._state)) console.warn("<Yel> was created without expected data property 'classesColorText'");
		if (!('methodName' in this._state)) console.warn("<Yel> was created without expected data property 'methodName'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$2(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Yel.prototype, protoDev);
	assign(Yel.prototype, methods$2);

	Yel.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/components/documentation/checkboxes/Mag.html generated by Svelte v2.14.1 */

	function data$3() {
	  return {
	    classeColorCheckbox: "color-checkbox__input_color_magenta",
	    classesColorText: "color-text__method-magenta",
	    // labelForIdCheckboxes: "magenta",
	    // idCheckboxes: "magenta",
	    methodName: allData.methodMagEn.methodName
	    // text: "mag"
	  }
	}
	var methods$3 = {
	  printInfoForMethodMag() {
	    store.set({
	      classColorText: "color-text__method-magenta",
	      classSection: "mag-command",
	      methodName: allData.methodMagEn.methodName,
	      colorNameOnPage: allData.methodMagEn.colorName,
	      exampleTextOnPage: allData.methodMagEn.exampleText
	      // colorNameRu: allData.methodMagRu.colorName,
	      // exampleTextRu: allData.methodMagRu.exampleText,
	      // colorNameBy: allData.methodMagBy.colorName,
	      // exampleTextBy: allData.methodMagBy.exampleText
	    });
	    // cl.mag(`Hi, I'm magenta color text!`)
	  }
	};

	const file$3 = "src/components/documentation/checkboxes/Mag.html";

	function create_main_fragment$3(component, ctx) {
		var div, p, input, text0, text1, current;

		function click_handler(event) {
			component.printInfoForMethodMag();
		}

		return {
			c: function create() {
				div = createElement("div");
				p = createElement("p");
				input = createElement("input");
				text0 = createText("\n    ");
				text1 = createText(ctx.methodName);
				addListener(input, "click", click_handler);
				input.name = "color";
				setAttribute(input, "type", "radio");
				addLoc(input, file$3, 11, 4, 384);
				p.className = "" + ctx.classesColorText + " svelte-gwjic0";
				addLoc(p, file$3, 10, 2, 349);
				div.className = "container-checkbox";
				addLoc(div, file$3, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, p);
				append(p, input);
				append(p, text0);
				append(p, text1);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.methodName) {
					setData(text1, ctx.methodName);
				}

				if (changed.classesColorText) {
					p.className = "" + ctx.classesColorText + " svelte-gwjic0";
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "click", click_handler);
			}
		};
	}

	function Mag(options) {
		this._debugName = '<Mag>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$3(), options.data);
		if (!('classesColorText' in this._state)) console.warn("<Mag> was created without expected data property 'classesColorText'");
		if (!('methodName' in this._state)) console.warn("<Mag> was created without expected data property 'methodName'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$3(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Mag.prototype, protoDev);
	assign(Mag.prototype, methods$3);

	Mag.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/components/documentation/checkboxes/Cya.html generated by Svelte v2.14.1 */

	function data$4() {
	  return {
	    classeColorCheckbox: "color-checkbox__input_color_cyan",
	    classesColorText: "color-text__method-cyan",
	    // labelForIdCheckboxes: "cyan",
	    // idCheckboxes: "cyan",
	    methodName: allData.methodCyaEn.methodName
	  }
	}
	var methods$4 = {
	  printInfoForMethodCya() {
	    store.set({
	      classColorText: "color-text__method-cyan",
	      classSection: "cya-command",
	      methodName: allData.methodCyaEn.methodName,
	      colorNameOnPage: allData.methodCyaEn.colorName,
	      exampleTextEn: allData.methodCyaEn.exampleText
	      // colorNameRu: allData.methodCyaRu.colorName,
	      // exampleTextRu: allData.methodCyaRu.exampleText,
	      // colorNameBy: allData.methodCyaBy.colorName,
	      // exampleTextBy: allData.methodCyaBy.exampleText
	    });
	    // cl.cya(`Hi, I'm cyan color text!`)
	  }
	};

	const file$4 = "src/components/documentation/checkboxes/Cya.html";

	function create_main_fragment$4(component, ctx) {
		var div, p, input, text0, text1, current;

		function click_handler(event) {
			component.printInfoForMethodCya();
		}

		return {
			c: function create() {
				div = createElement("div");
				p = createElement("p");
				input = createElement("input");
				text0 = createText("\n    ");
				text1 = createText(ctx.methodName);
				addListener(input, "click", click_handler);
				input.name = "color";
				setAttribute(input, "type", "radio");
				addLoc(input, file$4, 12, 4, 393);
				p.className = "" + ctx.classesColorText + " svelte-in47c";
				addLoc(p, file$4, 11, 2, 358);
				div.className = "container-checkbox";
				addLoc(div, file$4, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, p);
				append(p, input);
				append(p, text0);
				append(p, text1);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.methodName) {
					setData(text1, ctx.methodName);
				}

				if (changed.classesColorText) {
					p.className = "" + ctx.classesColorText + " svelte-in47c";
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "click", click_handler);
			}
		};
	}

	function Cya(options) {
		this._debugName = '<Cya>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$4(), options.data);
		if (!('classesColorText' in this._state)) console.warn("<Cya> was created without expected data property 'classesColorText'");
		if (!('methodName' in this._state)) console.warn("<Cya> was created without expected data property 'methodName'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$4(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Cya.prototype, protoDev);
	assign(Cya.prototype, methods$4);

	Cya.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/components/documentation/checkboxes/Whi.html generated by Svelte v2.14.1 */

	function data$5() {
	  return {
	    classeColorCheckbox: "color-checkbox__input_color_white",
	    classesColorText: "color-text__method-white",
	    // labelForIdCheckboxes: "white",
	    // idCheckboxes: "white",
	    methodName: allData.methodWhiEn.methodName
	  }
	}
	var methods$5 = {
	  printInfoForMethodWhi() {
	    store.set({
	      classColorText: "color-text__method-white",
	      classSection: "whi-command",
	      methodName: allData.methodWhiEn.methodName,
	      colorNameOnPage: allData.methodWhiEn.colorName,
	      exampleTextOnPage: allData.methodWhiEn.exampleText
	      // colorNameRu: allData.methodWhiRu.colorName,
	      // exampleTextRu: allData.methodWhiRu.exampleText,
	      // colorNameBy: allData.methodWhiBy.colorName,
	      // exampleTextBy: allData.methodWhiBy.exampleText
	    });
	    // cl.whi(`Hi, I'm white color text!`)
	  }
	};

	const file$5 = "src/components/documentation/checkboxes/Whi.html";

	function create_main_fragment$5(component, ctx) {
		var div, p, input, text0, text1, current;

		function click_handler(event) {
			component.printInfoForMethodWhi();
		}

		return {
			c: function create() {
				div = createElement("div");
				p = createElement("p");
				input = createElement("input");
				text0 = createText("\n    ");
				text1 = createText(ctx.methodName);
				addListener(input, "click", click_handler);
				input.name = "color";
				setAttribute(input, "type", "radio");
				addLoc(input, file$5, 11, 4, 384);
				p.className = ctx.classesColorText;
				addLoc(p, file$5, 10, 2, 349);
				div.className = "container-checkbox";
				addLoc(div, file$5, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, p);
				append(p, input);
				append(p, text0);
				append(p, text1);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.methodName) {
					setData(text1, ctx.methodName);
				}

				if (changed.classesColorText) {
					p.className = ctx.classesColorText;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "click", click_handler);
			}
		};
	}

	function Whi(options) {
		this._debugName = '<Whi>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$5(), options.data);
		if (!('classesColorText' in this._state)) console.warn("<Whi> was created without expected data property 'classesColorText'");
		if (!('methodName' in this._state)) console.warn("<Whi> was created without expected data property 'methodName'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$5(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Whi.prototype, protoDev);
	assign(Whi.prototype, methods$5);

	Whi.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/components/documentation/checkboxes/Log.html generated by Svelte v2.14.1 */

	function data$6() {
	  return {
	    classeColorCheckbox: "color-checkbox__input_color_log",
	    classesColorText: "color-text__method-log",
	    // labelForIdCheckboxes: "log",
	    // idCheckboxes: "log",
	    methodName: allData.methodLogEn.methodName
	  }
	}
	var methods$6 = {
	  printInfoForMethodLog() {
	    store.set({
	      classColorText: "color-text__method-log",
	      classSection: "log-command",
	      methodName: allData.methodLogEn.methodName,
	      colorNameOnPage: allData.methodLogEn.colorName,
	      exampleTextOnPage: allData.methodLogEn.exampleText
	      // colorNameRu: allData.methodLogRu.colorName,
	      // exampleTextRu: allData.methodLogRu.exampleText,
	      // colorNameBy: allData.methodLogBy.colorName,
	      // exampleTextBy: allData.methodLogBy.exampleText
	    });

	    // cl.log(`Hi, I'm usual console.log!`)
	  }
	};

	const file$6 = "src/components/documentation/checkboxes/Log.html";

	function create_main_fragment$6(component, ctx) {
		var div, p, input, text0, text1, current;

		function click_handler(event) {
			component.printInfoForMethodLog();
		}

		return {
			c: function create() {
				div = createElement("div");
				p = createElement("p");
				input = createElement("input");
				text0 = createText("\n    ");
				text1 = createText(ctx.methodName);
				addListener(input, "click", click_handler);
				input.name = "color";
				setAttribute(input, "type", "radio");
				addLoc(input, file$6, 12, 4, 385);
				p.className = "" + ctx.classesColorText + " svelte-13l8bzz";
				addLoc(p, file$6, 11, 2, 350);
				div.className = "container-checkbox";
				addLoc(div, file$6, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, p);
				append(p, input);
				append(p, text0);
				append(p, text1);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.methodName) {
					setData(text1, ctx.methodName);
				}

				if (changed.classesColorText) {
					p.className = "" + ctx.classesColorText + " svelte-13l8bzz";
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "click", click_handler);
			}
		};
	}

	function Log(options) {
		this._debugName = '<Log>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$6(), options.data);
		if (!('classesColorText' in this._state)) console.warn("<Log> was created without expected data property 'classesColorText'");
		if (!('methodName' in this._state)) console.warn("<Log> was created without expected data property 'methodName'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$6(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Log.prototype, protoDev);
	assign(Log.prototype, methods$6);

	Log.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/components/documentation/ButtonAllMethods.html generated by Svelte v2.14.1 */

	function data$7() {
	  return {
	    methodsAttributes: [
	      {
	        classColorText: "color-text__method-red",
	        classSection: "red-command",
	        methodName: allData.methodRedEn.methodName,
	        colorNameOnPage: allData.methodRedEn.colorName,
	        exampleTextOnPage: allData.methodRedEn.exampleText
	      },
	      {
	        classColorText: "color-text__method-green",
	        classSection: "gre-command",
	        methodName: allData.methodGreEn.methodName,
	        colorNameOnPage: allData.methodGreEn.colorName,
	        exampleTextOnPage: allData.methodGreEn.exampleText
	      },
	      {
	        classColorText: "color-text__method-yellow",
	        classSection: "yel-command",
	        methodName: allData.methodYelEn.methodName,
	        colorNameOnPage: allData.methodYelEn.colorName,
	        exampleTextOnPage: allData.methodYelEn.exampleText
	      },
	      {
	        classColorText: "color-text__method-blue",
	        classSection: "blu-command",
	        methodName: allData.methodBluEn.methodName,
	        colorNameEn: allData.methodBluEn.colorName,
	        exampleTextEn: allData.methodBluEn.exampleText
	      },
	      {
	        classColorText: "color-text__method-magenta",
	        classSection: "mag-command",
	        methodName: allData.methodMagEn.methodName,
	        colorNameOnPage: allData.methodMagEn.colorName,
	        exampleTextOnPage: allData.methodMagEn.exampleText
	      },
	      {
	        classColorText: "color-text__method-cyan",
	        classSection: "cya-command",
	        methodName: allData.methodCyaEn.methodName,
	        colorNameOnPage: allData.methodCyaEn.colorName,
	        exampleTextEn: allData.methodCyaEn.exampleText
	      },
	      {
	        classColorText: "color-text__method-white",
	        classSection: "whi-command",
	        methodName: allData.methodWhiEn.methodName,
	        colorNameOnPage: allData.methodWhiEn.colorName,
	        exampleTextOnPage: allData.methodWhiEn.exampleText
	      },
	      {
	        classColorText: "color-text__method-log",
	        classSection: "log-command",
	        methodName: allData.methodLogEn.methodName,
	        colorNameOnPage: allData.methodLogEn.colorName,
	        exampleTextOnPage: allData.methodLogEn.exampleText
	      }
	    ]
	  }
	}
	var methods$7 = {
	  printAllMethods() {
	    store.set({
	      // hiddenAllMethods: !hiddenAllMethods,
	      // hiddenInfoForMethod: !hiddenInfoForMethod
	    });

	    // console.log(store.get())

	    // cl.red(`Hi, I'm red color text!`)
	    // cl.gre(`Hi, I'm green color text!`)
	    // cl.yel(`Hi, I'm yellow color text!`)
	    // cl.blu(`Hi, I'm blu color text!`)
	    // cl.mag(`Hi, I'm magenta color text!`)
	    // cl.cya(`Hi, I'm cyan color text!`)
	    // cl.log(`Hi, I'm usual console.log!`)
	    // cl.whi(`Hi, I'm white color text!`)
	  }
	};

	const file$7 = "src/components/documentation/ButtonAllMethods.html";

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.method = list[i];
		child_ctx.each_value = list;
		child_ctx.method_index = i;
		return child_ctx;
	}

	function create_main_fragment$7(component, ctx) {
		var button, text_1, each_anchor, current;

		function click_handler(event) {
			component.printAllMethods();
		}

		var each_value = ctx.methodsAttributes;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
		}

		return {
			c: function create() {
				button = createElement("button");
				button.textContent = "All methods";
				text_1 = createText("\n\n\n\n");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_anchor = createComment();
				addListener(button, "click", click_handler);
				addLoc(button, file$7, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);
				insert(target, text_1, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_anchor, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.methodsAttributes || changed.$exampleToUseHeadlineOnPage) {
					each_value = ctx.methodsAttributes;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(each_anchor.parentNode, each_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(button);
				}

				removeListener(button, "click", click_handler);
				if (detach) {
					detachNode(text_1);
				}

				destroyEach(each_blocks, detach);

				if (detach) {
					detachNode(each_anchor);
				}
			}
		};
	}

	// (5:0) {#each methodsAttributes as method}
	function create_each_block(component, ctx) {
		var section, h3, text0, text1, span, text2_value = ctx.method.colorNameOnPage, text2, span_class_value, text3, text4, p0, text5_value = ctx.method.exampleTextOnPage, text5, text6, div2, h5, text7, h5_class_value, text8, div1, code, text9, br, text10, text11_value = ctx.method.methodName, text11, text12, text13_value = ctx.method.colorNameOnPage, text13, text14, text15, div0, p1, p1_class_value, text16, p2, text17, text18_value = ctx.method.colorNameOnPage, text18, text19, p2_class_value, text20, section_class_value;

		return {
			c: function create() {
				section = createElement("section");
				h3 = createElement("h3");
				text0 = createText(ctx.$exampleToUseHeadlineOnPage);
				text1 = createText("\n    ");
				span = createElement("span");
				text2 = createText(text2_value);
				text3 = createText(" color");
				text4 = createText("\n  ");
				p0 = createElement("p");
				text5 = createText(text5_value);
				text6 = createText("\n  ");
				div2 = createElement("div");
				h5 = createElement("h5");
				text7 = createText("example to use:");
				text8 = createText("\n    ");
				div1 = createElement("div");
				code = createElement("code");
				text9 = createText("const cl = require('node-cl-log'); ");
				br = createElement("br");
				text10 = createText("\n        cl.");
				text11 = createText(text11_value);
				text12 = createText("('Hi, I'm ");
				text13 = createText(text13_value);
				text14 = createText(" text!');");
				text15 = createText("\n      ");
				div0 = createElement("div");
				p1 = createElement("p");
				text16 = createText("\n        ");
				p2 = createElement("p");
				text17 = createText("Hi, I'm ");
				text18 = createText(text18_value);
				text19 = createText(" color text!'");
				text20 = createText("\n");
				span.className = span_class_value = "" + ctx.method.classColorText + " svelte-3pll7p";
				addLoc(span, file$7, 8, 4, 254);
				h3.className = "example__headline";
				addLoc(h3, file$7, 6, 2, 185);
				p0.className = "example__text";
				addLoc(p0, file$7, 10, 2, 340);
				h5.className = h5_class_value = "example-to-use__headline " + ctx.method.classColorText + " svelte-3pll7p";
				addLoc(h5, file$7, 12, 4, 432);
				addLoc(br, file$7, 17, 43, 646);
				code.className = "example-command__text";
				addLoc(code, file$7, 16, 6, 566);
				p1.className = p1_class_value = "arrow " + ctx.method.classColorText + " svelte-3pll7p";
				addLoc(p1, file$7, 21, 8, 789);
				p2.className = p2_class_value = "result-text " + ctx.method.classColorText + " svelte-3pll7p";
				addLoc(p2, file$7, 22, 8, 843);
				div0.className = "result-command-wrap";
				addLoc(div0, file$7, 20, 6, 747);
				div1.className = "example-command";
				addLoc(div1, file$7, 15, 4, 530);
				div2.className = "example-to-use ";
				addLoc(div2, file$7, 11, 2, 398);
				section.className = section_class_value = "example " + ctx.method.classSection + " svelte-3pll7p";
				section.hidden = "";
				addLoc(section, file$7, 5, 0, 125);
			},

			m: function mount(target, anchor) {
				insert(target, section, anchor);
				append(section, h3);
				append(h3, text0);
				append(h3, text1);
				append(h3, span);
				append(span, text2);
				append(h3, text3);
				append(section, text4);
				append(section, p0);
				append(p0, text5);
				append(section, text6);
				append(section, div2);
				append(div2, h5);
				append(h5, text7);
				append(div2, text8);
				append(div2, div1);
				append(div1, code);
				append(code, text9);
				append(code, br);
				append(code, text10);
				append(code, text11);
				append(code, text12);
				append(code, text13);
				append(code, text14);
				append(div1, text15);
				append(div1, div0);
				append(div0, p1);
				append(div0, text16);
				append(div0, p2);
				append(p2, text17);
				append(p2, text18);
				append(p2, text19);
				append(section, text20);
			},

			p: function update(changed, ctx) {
				if (changed.$exampleToUseHeadlineOnPage) {
					setData(text0, ctx.$exampleToUseHeadlineOnPage);
				}

				if ((changed.methodsAttributes) && text2_value !== (text2_value = ctx.method.colorNameOnPage)) {
					setData(text2, text2_value);
				}

				if ((changed.methodsAttributes) && span_class_value !== (span_class_value = "" + ctx.method.classColorText + " svelte-3pll7p")) {
					span.className = span_class_value;
				}

				if ((changed.methodsAttributes) && text5_value !== (text5_value = ctx.method.exampleTextOnPage)) {
					setData(text5, text5_value);
				}

				if ((changed.methodsAttributes) && h5_class_value !== (h5_class_value = "example-to-use__headline " + ctx.method.classColorText + " svelte-3pll7p")) {
					h5.className = h5_class_value;
				}

				if ((changed.methodsAttributes) && text11_value !== (text11_value = ctx.method.methodName)) {
					setData(text11, text11_value);
				}

				if ((changed.methodsAttributes) && text13_value !== (text13_value = ctx.method.colorNameOnPage)) {
					setData(text13, text13_value);
				}

				if ((changed.methodsAttributes) && p1_class_value !== (p1_class_value = "arrow " + ctx.method.classColorText + " svelte-3pll7p")) {
					p1.className = p1_class_value;
				}

				if ((changed.methodsAttributes) && text18_value !== (text18_value = ctx.method.colorNameOnPage)) {
					setData(text18, text18_value);
				}

				if ((changed.methodsAttributes) && p2_class_value !== (p2_class_value = "result-text " + ctx.method.classColorText + " svelte-3pll7p")) {
					p2.className = p2_class_value;
				}

				if ((changed.methodsAttributes) && section_class_value !== (section_class_value = "example " + ctx.method.classSection + " svelte-3pll7p")) {
					section.className = section_class_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(section);
				}
			}
		};
	}

	function ButtonAllMethods(options) {
		this._debugName = '<ButtonAllMethods>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(assign(this.store._init(["exampleToUseHeadlineOnPage"]), data$7()), options.data);
		this.store._add(this, ["exampleToUseHeadlineOnPage"]);
		if (!('methodsAttributes' in this._state)) console.warn("<ButtonAllMethods> was created without expected data property 'methodsAttributes'");
		if (!('$exampleToUseHeadlineOnPage' in this._state)) console.warn("<ButtonAllMethods> was created without expected data property '$exampleToUseHeadlineOnPage'");
		this._intro = !!options.intro;

		this._handlers.destroy = [removeFromStore];

		this._fragment = create_main_fragment$7(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(ButtonAllMethods.prototype, protoDev);
	assign(ButtonAllMethods.prototype, methods$7);

	ButtonAllMethods.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/components/documentation/PrintInfoForMethod.html generated by Svelte v2.14.1 */

	function data$8() {
	  return {}
	}
	var methods$8 = {};

	const file$8 = "src/components/documentation/PrintInfoForMethod.html";

	function create_main_fragment$8(component, ctx) {
		var section, h3, text0, text1, span, text2, text3, text4, p0, text5, text6, div2, h5, text7, h5_class_value, text8, div1, code, text9, br, text10, text11, text12, text13, text14, text15, div0, p1, p1_class_value, text16, p2, text17, text18, text19, p2_class_value, section_class_value, current;

		return {
			c: function create() {
				section = createElement("section");
				h3 = createElement("h3");
				text0 = createText(ctx.$exampleToUseHeadlineOnPage);
				text1 = createText("\n    ");
				span = createElement("span");
				text2 = createText(ctx.$colorNameOnPage);
				text3 = createText(" color");
				text4 = createText("\n  ");
				p0 = createElement("p");
				text5 = createText(ctx.$exampleTextOnPage);
				text6 = createText("\n  ");
				div2 = createElement("div");
				h5 = createElement("h5");
				text7 = createText("example to use:");
				text8 = createText("\n    ");
				div1 = createElement("div");
				code = createElement("code");
				text9 = createText("const cl = require('node-cl-log'); ");
				br = createElement("br");
				text10 = createText("\n        cl.");
				text11 = createText(ctx.$methodName);
				text12 = createText("('Hi, I'm ");
				text13 = createText(ctx.$colorNameOnPage);
				text14 = createText(" text!');");
				text15 = createText("\n      ");
				div0 = createElement("div");
				p1 = createElement("p");
				text16 = createText("\n        ");
				p2 = createElement("p");
				text17 = createText("Hi, I'm ");
				text18 = createText(ctx.$colorNameOnPage);
				text19 = createText(" color text!'");
				span.className = "" + ctx.$classColorText + " svelte-v6h88x";
				addLoc(span, file$8, 13, 4, 329);
				h3.className = "example__headline";
				addLoc(h3, file$8, 11, 2, 260);
				p0.className = "example__text";
				addLoc(p0, file$8, 15, 2, 403);
				h5.className = h5_class_value = "example-to-use__headline " + ctx.$classColorText + " svelte-v6h88x";
				addLoc(h5, file$8, 17, 4, 489);
				addLoc(br, file$8, 20, 43, 685);
				code.className = "example-command__text";
				addLoc(code, file$8, 19, 6, 605);
				p1.className = p1_class_value = "arrow " + ctx.$classColorText + " svelte-v6h88x";
				addLoc(p1, file$8, 24, 8, 816);
				p2.className = p2_class_value = "result-text " + ctx.$classColorText + " svelte-v6h88x";
				addLoc(p2, file$8, 25, 8, 864);
				div0.className = "result-command-wrap";
				addLoc(div0, file$8, 23, 6, 774);
				div1.className = "example-command";
				addLoc(div1, file$8, 18, 4, 569);
				div2.className = "example-to-use ";
				addLoc(div2, file$8, 16, 2, 455);
				section.className = section_class_value = "example " + ctx.$classSection + " svelte-v6h88x";
				section.hidden = ctx.$hiddenInfoForMethod;
				addLoc(section, file$8, 10, 0, 184);
			},

			m: function mount(target, anchor) {
				insert(target, section, anchor);
				append(section, h3);
				append(h3, text0);
				append(h3, text1);
				append(h3, span);
				append(span, text2);
				append(h3, text3);
				append(section, text4);
				append(section, p0);
				append(p0, text5);
				append(section, text6);
				append(section, div2);
				append(div2, h5);
				append(h5, text7);
				append(div2, text8);
				append(div2, div1);
				append(div1, code);
				append(code, text9);
				append(code, br);
				append(code, text10);
				append(code, text11);
				append(code, text12);
				append(code, text13);
				append(code, text14);
				append(div1, text15);
				append(div1, div0);
				append(div0, p1);
				append(div0, text16);
				append(div0, p2);
				append(p2, text17);
				append(p2, text18);
				append(p2, text19);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.$exampleToUseHeadlineOnPage) {
					setData(text0, ctx.$exampleToUseHeadlineOnPage);
				}

				if (changed.$colorNameOnPage) {
					setData(text2, ctx.$colorNameOnPage);
				}

				if (changed.$classColorText) {
					span.className = "" + ctx.$classColorText + " svelte-v6h88x";
				}

				if (changed.$exampleTextOnPage) {
					setData(text5, ctx.$exampleTextOnPage);
				}

				if ((changed.$classColorText) && h5_class_value !== (h5_class_value = "example-to-use__headline " + ctx.$classColorText + " svelte-v6h88x")) {
					h5.className = h5_class_value;
				}

				if (changed.$methodName) {
					setData(text11, ctx.$methodName);
				}

				if (changed.$colorNameOnPage) {
					setData(text13, ctx.$colorNameOnPage);
				}

				if ((changed.$classColorText) && p1_class_value !== (p1_class_value = "arrow " + ctx.$classColorText + " svelte-v6h88x")) {
					p1.className = p1_class_value;
				}

				if (changed.$colorNameOnPage) {
					setData(text18, ctx.$colorNameOnPage);
				}

				if ((changed.$classColorText) && p2_class_value !== (p2_class_value = "result-text " + ctx.$classColorText + " svelte-v6h88x")) {
					p2.className = p2_class_value;
				}

				if ((changed.$classSection) && section_class_value !== (section_class_value = "example " + ctx.$classSection + " svelte-v6h88x")) {
					section.className = section_class_value;
				}

				if (changed.$hiddenInfoForMethod) {
					section.hidden = ctx.$hiddenInfoForMethod;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(section);
				}
			}
		};
	}

	function PrintInfoForMethod(options) {
		this._debugName = '<PrintInfoForMethod>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(assign(this.store._init(["classSection","hiddenInfoForMethod","exampleToUseHeadlineOnPage","classColorText","colorNameOnPage","exampleTextOnPage","methodName"]), data$8()), options.data);
		this.store._add(this, ["classSection","hiddenInfoForMethod","exampleToUseHeadlineOnPage","classColorText","colorNameOnPage","exampleTextOnPage","methodName"]);
		if (!('$classSection' in this._state)) console.warn("<PrintInfoForMethod> was created without expected data property '$classSection'");
		if (!('$hiddenInfoForMethod' in this._state)) console.warn("<PrintInfoForMethod> was created without expected data property '$hiddenInfoForMethod'");
		if (!('$exampleToUseHeadlineOnPage' in this._state)) console.warn("<PrintInfoForMethod> was created without expected data property '$exampleToUseHeadlineOnPage'");
		if (!('$classColorText' in this._state)) console.warn("<PrintInfoForMethod> was created without expected data property '$classColorText'");
		if (!('$colorNameOnPage' in this._state)) console.warn("<PrintInfoForMethod> was created without expected data property '$colorNameOnPage'");
		if (!('$exampleTextOnPage' in this._state)) console.warn("<PrintInfoForMethod> was created without expected data property '$exampleTextOnPage'");
		if (!('$methodName' in this._state)) console.warn("<PrintInfoForMethod> was created without expected data property '$methodName'");
		this._intro = !!options.intro;

		this._handlers.destroy = [removeFromStore];

		this._fragment = create_main_fragment$8(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(PrintInfoForMethod.prototype, protoDev);
	assign(PrintInfoForMethod.prototype, methods$8);

	PrintInfoForMethod.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/components/documentation/Documentation.html generated by Svelte v2.14.1 */

	// import PrintAllMethods from './PrintAllMethods.html'

	function data$9() {
	  return {}
	}
	var methods$9 = {};

	const file$9 = "src/components/documentation/Documentation.html";

	function create_main_fragment$9(component, ctx) {
		var main, div, fieldset, text0, text1, text2, text3, text4, text5, text6, current;

		var checkboxred = new Red({
			root: component.root,
			store: component.store
		});

		var checkboxgre = new Gre({
			root: component.root,
			store: component.store
		});

		var checkboxyel = new Yel({
			root: component.root,
			store: component.store
		});

		var checkboxmag = new Mag({
			root: component.root,
			store: component.store
		});

		var checkboxcya = new Cya({
			root: component.root,
			store: component.store
		});

		var checkboxwhi = new Whi({
			root: component.root,
			store: component.store
		});

		var checkboxlog = new Log({
			root: component.root,
			store: component.store
		});

		var printinfoformethod = new PrintInfoForMethod({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				main = createElement("main");
				div = createElement("div");
				fieldset = createElement("fieldset");
				checkboxred._fragment.c();
				text0 = createText("\n      ");
				checkboxgre._fragment.c();
				text1 = createText("\n      ");
				checkboxyel._fragment.c();
				text2 = createText("\n      ");
				checkboxmag._fragment.c();
				text3 = createText("\n      ");
				checkboxcya._fragment.c();
				text4 = createText("\n      ");
				checkboxwhi._fragment.c();
				text5 = createText("\n      ");
				checkboxlog._fragment.c();
				text6 = createText("\n\n  ");
				printinfoformethod._fragment.c();
				fieldset.className = "color-methods";
				addLoc(fieldset, file$9, 27, 4, 1143);
				div.className = "color-methods-panel";
				addLoc(div, file$9, 26, 2, 1105);
				addLoc(main, file$9, 25, 0, 1096);
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);
				append(main, div);
				append(div, fieldset);
				checkboxred._mount(fieldset, null);
				append(fieldset, text0);
				checkboxgre._mount(fieldset, null);
				append(fieldset, text1);
				checkboxyel._mount(fieldset, null);
				append(fieldset, text2);
				checkboxmag._mount(fieldset, null);
				append(fieldset, text3);
				checkboxcya._mount(fieldset, null);
				append(fieldset, text4);
				checkboxwhi._mount(fieldset, null);
				append(fieldset, text5);
				checkboxlog._mount(fieldset, null);
				append(main, text6);
				printinfoformethod._mount(main, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 8);

				if (checkboxred) checkboxred._fragment.o(outrocallback);
				if (checkboxgre) checkboxgre._fragment.o(outrocallback);
				if (checkboxyel) checkboxyel._fragment.o(outrocallback);
				if (checkboxmag) checkboxmag._fragment.o(outrocallback);
				if (checkboxcya) checkboxcya._fragment.o(outrocallback);
				if (checkboxwhi) checkboxwhi._fragment.o(outrocallback);
				if (checkboxlog) checkboxlog._fragment.o(outrocallback);
				if (printinfoformethod) printinfoformethod._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(main);
				}

				checkboxred.destroy();
				checkboxgre.destroy();
				checkboxyel.destroy();
				checkboxmag.destroy();
				checkboxcya.destroy();
				checkboxwhi.destroy();
				checkboxlog.destroy();
				printinfoformethod.destroy();
			}
		};
	}

	function Documentation(options) {
		this._debugName = '<Documentation>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$9(), options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$9(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Documentation.prototype, protoDev);
	assign(Documentation.prototype, methods$9);

	Documentation.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/App.html generated by Svelte v2.14.1 */

	function create_main_fragment$a(component, ctx) {
		var current;

		var main = new Documentation({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				main._fragment.c();
			},

			m: function mount(target, anchor) {
				main._mount(target, anchor);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (main) main._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				main.destroy(detach);
			}
		};
	}

	function App(options) {
		this._debugName = '<App>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$a(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(App.prototype, protoDev);

	App.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	function Store(state, options) {
		this._handlers = {};
		this._dependents = [];

		this._computed = blankObject();
		this._sortedComputedProperties = [];

		this._state = assign({}, state);
		this._differs = options && options.immutable ? _differsImmutable : _differs;
	}

	assign(Store.prototype, {
		_add(component, props) {
			this._dependents.push({
				component: component,
				props: props
			});
		},

		_init(props) {
			const state = {};
			for (let i = 0; i < props.length; i += 1) {
				const prop = props[i];
				state['$' + prop] = this._state[prop];
			}
			return state;
		},

		_remove(component) {
			let i = this._dependents.length;
			while (i--) {
				if (this._dependents[i].component === component) {
					this._dependents.splice(i, 1);
					return;
				}
			}
		},

		_set(newState, changed) {
			const previous = this._state;
			this._state = assign(assign({}, previous), newState);

			for (let i = 0; i < this._sortedComputedProperties.length; i += 1) {
				this._sortedComputedProperties[i].update(this._state, changed);
			}

			this.fire('state', {
				changed,
				previous,
				current: this._state
			});

			this._dependents
				.filter(dependent => {
					const componentState = {};
					let dirty = false;

					for (let j = 0; j < dependent.props.length; j += 1) {
						const prop = dependent.props[j];
						if (prop in changed) {
							componentState['$' + prop] = this._state[prop];
							dirty = true;
						}
					}

					if (dirty) {
						dependent.component._stage(componentState);
						return true;
					}
				})
				.forEach(dependent => {
					dependent.component.set({});
				});

			this.fire('update', {
				changed,
				previous,
				current: this._state
			});
		},

		_sortComputedProperties() {
			const computed = this._computed;
			const sorted = this._sortedComputedProperties = [];
			const visited = blankObject();
			let currentKey;

			function visit(key) {
				const c = computed[key];

				if (c) {
					c.deps.forEach(dep => {
						if (dep === currentKey) {
							throw new Error(`Cyclical dependency detected between ${dep} <-> ${key}`);
						}

						visit(dep);
					});

					if (!visited[key]) {
						visited[key] = true;
						sorted.push(c);
					}
				}
			}

			for (const key in this._computed) {
				visit(currentKey = key);
			}
		},

		compute(key, deps, fn) {
			let value;

			const c = {
				deps,
				update: (state, changed, dirty) => {
					const values = deps.map(dep => {
						if (dep in changed) dirty = true;
						return state[dep];
					});

					if (dirty) {
						const newValue = fn.apply(null, values);
						if (this._differs(newValue, value)) {
							value = newValue;
							changed[key] = true;
							state[key] = value;
						}
					}
				}
			};

			this._computed[key] = c;
			this._sortComputedProperties();

			const state = assign({}, this._state);
			const changed = {};
			c.update(state, changed, true);
			this._set(state, changed);
		},

		fire,

		get,

		on,

		set(newState) {
			const oldState = this._state;
			const changed = this._changed = {};
			let dirty = false;

			for (const key in newState) {
				if (this._computed[key]) throw new Error(`'${key}' is a read-only computed property`);
				if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
			}
			if (!dirty) return;

			this._set(newState, changed);
		}
	});

	/* { filename: 'main.js' } */

	const store$1 = new Store({
	  colorNameOnPage: "red",
	  exampleTextOnPage: "", //this.exampleTextEn
	  exampleTextEn: "",
	  exampleTextRu: "",
	  exampleTextBy: "",
	  classColorText: "color-text__method-red",
	  classSection: "red-command",
	  exampleHeadline: "",
	  exampleSpan: "",
	  methodName: "",
	  hiddenAl: "true",
	  hiddenAllMethods: true,
	  hiddenInfoForMethod: false,
	  // change the language version
	  exampleHeadline: "",
	  exampleSpan: "",
	  exampleToUseHeadlineOnPage: "Text output in the console in", // translate on other languages
	  exampleToUseHeadlineEn: "",
	  exampleToUseHeadlineRu: "",
	  exampleToUseHeadlineBy: "",
	  // language versions
	  logoHeadline: "The main task of color is to serve expressiveness"
	});

	const app = new App({
	  target: document.querySelector("body"),
	  store: store$1
	});

	window.store = store$1;

	// colorNameEn: allData.methodGreEn.colorName,
	// colorNameBy: allData.methodGreBy.colorName,
	// colorNameRu: allData.methodGreRu.colorName,
	// exampleTextEn: allData.methodGreEn.exampleText,
	// exampleTextRu: allData.methodGreRu.exampleText,
	// exampleTextBy: allData.methodGreBy.exampleText,
	// exampleHeadlineEn: allData.methodsDataEn.exampleHeadline,
	// exampleHeadlineRu: allData.methodsDataRu.exampleHeadline,
	// exampleHeadlineBy: allData.methodsDataBy.exampleHeadline,
	// exampleSpanEn:  allData.methodsDataEn.exampleSpan,
	// exampleSpanRu:  allData.methodsDataRu.exampleSpan,
	// exampleSpanBy:  allData.methodsDataBy.exampleSpan,
	// exampleToUseHeadlineEn: allData.methodsDataEn.exampleToUseHeadline,
	// exampleToUseHeadlineRu: allData.methodsDataRu.exampleToUseHeadline,
	// exampleToUseHeadlineBy: allData.methodsDataBy.exampleToUseHeadline,
	// exampleCommandTextUseMethodEn: allData.methodsDataEn.exampleCommandTextUseMethod,
	// exampleCommandTextUseMethodRu: allData.methodsDataRu.exampleCommandTextUseMethod,
	// exampleCommandTextUseMethodBy: allData.methodsDataBy.exampleCommandTextUseMethod,
	// resultTextUseMethodEn:  allData.methodsDataEn.resultTextUseMethod,
	// resultTextUseMethodRu:  allData.methodsDataRu.resultTextUseMethod,
	// resultTextUseMethodBy:  allData.methodsDataBy.resultTextUseMethod,

}());
//# sourceMappingURL=bundle.js.map
