(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Scrolly = {}));
}(this, function (exports) { 'use strict';

  /**
   * Copyright 2004-present Facebook. All Rights Reserved.
   *
   * @providesModule UserAgent_DEPRECATED
   */

  /**
   *  Provides entirely client-side User Agent and OS detection. You should prefer
   *  the non-deprecated UserAgent module when possible, which exposes our
   *  authoritative server-side PHP-based detection to the client.
   *
   *  Usage is straightforward:
   *
   *    if (UserAgent_DEPRECATED.ie()) {
   *      //  IE
   *    }
   *
   *  You can also do version checks:
   *
   *    if (UserAgent_DEPRECATED.ie() >= 7) {
   *      //  IE7 or better
   *    }
   *
   *  The browser functions will return NaN if the browser does not match, so
   *  you can also do version compares the other way:
   *
   *    if (UserAgent_DEPRECATED.ie() < 7) {
   *      //  IE6 or worse
   *    }
   *
   *  Note that the version is a float and may include a minor version number,
   *  so you should always use range operators to perform comparisons, not
   *  strict equality.
   *
   *  **Note:** You should **strongly** prefer capability detection to browser
   *  version detection where it's reasonable:
   *
   *    http://www.quirksmode.org/js/support.html
   *
   *  Further, we have a large number of mature wrapper functions and classes
   *  which abstract away many browser irregularities. Check the documentation,
   *  grep for things, or ask on javascript@lists.facebook.com before writing yet
   *  another copy of "event || window.event".
   *
   */

  var _populated = false;

  // Browsers
  var _ie, _firefox, _opera, _webkit, _chrome;

  // Actual IE browser for compatibility mode
  var _ie_real_version;

  // Platforms
  var _osx, _windows, _linux, _android;

  // Architectures
  var _win64;

  // Devices
  var _iphone, _ipad, _native;

  var _mobile;

  function _populate() {
    if (_populated) {
      return;
    }

    _populated = true;

    // To work around buggy JS libraries that can't handle multi-digit
    // version numbers, Opera 10's user agent string claims it's Opera
    // 9, then later includes a Version/X.Y field:
    //
    // Opera/9.80 (foo) Presto/2.2.15 Version/10.10
    var uas = navigator.userAgent;
    var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(uas);
    var os    = /(Mac OS X)|(Windows)|(Linux)/.exec(uas);

    _iphone = /\b(iPhone|iP[ao]d)/.exec(uas);
    _ipad = /\b(iP[ao]d)/.exec(uas);
    _android = /Android/i.exec(uas);
    _native = /FBAN\/\w+;/i.exec(uas);
    _mobile = /Mobile/i.exec(uas);

    // Note that the IE team blog would have you believe you should be checking
    // for 'Win64; x64'.  But MSDN then reveals that you can actually be coming
    // from either x64 or ia64;  so ultimately, you should just check for Win64
    // as in indicator of whether you're in 64-bit IE.  32-bit IE on 64-bit
    // Windows will send 'WOW64' instead.
    _win64 = !!(/Win64/.exec(uas));

    if (agent) {
      _ie = agent[1] ? parseFloat(agent[1]) : (
            agent[5] ? parseFloat(agent[5]) : NaN);
      // IE compatibility mode
      if (_ie && document && document.documentMode) {
        _ie = document.documentMode;
      }
      // grab the "true" ie version from the trident token if available
      var trident = /(?:Trident\/(\d+.\d+))/.exec(uas);
      _ie_real_version = trident ? parseFloat(trident[1]) + 4 : _ie;

      _firefox = agent[2] ? parseFloat(agent[2]) : NaN;
      _opera   = agent[3] ? parseFloat(agent[3]) : NaN;
      _webkit  = agent[4] ? parseFloat(agent[4]) : NaN;
      if (_webkit) {
        // We do not add the regexp to the above test, because it will always
        // match 'safari' only since 'AppleWebKit' appears before 'Chrome' in
        // the userAgent string.
        agent = /(?:Chrome\/(\d+\.\d+))/.exec(uas);
        _chrome = agent && agent[1] ? parseFloat(agent[1]) : NaN;
      } else {
        _chrome = NaN;
      }
    } else {
      _ie = _firefox = _opera = _chrome = _webkit = NaN;
    }

    if (os) {
      if (os[1]) {
        // Detect OS X version.  If no version number matches, set _osx to true.
        // Version examples:  10, 10_6_1, 10.7
        // Parses version number as a float, taking only first two sets of
        // digits.  If only one set of digits is found, returns just the major
        // version number.
        var ver = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(uas);

        _osx = ver ? parseFloat(ver[1].replace('_', '.')) : true;
      } else {
        _osx = false;
      }
      _windows = !!os[2];
      _linux   = !!os[3];
    } else {
      _osx = _windows = _linux = false;
    }
  }

  var UserAgent_DEPRECATED = {

    /**
     *  Check if the UA is Internet Explorer.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    ie: function() {
      return _populate() || _ie;
    },

    /**
     * Check if we're in Internet Explorer compatibility mode.
     *
     * @return bool true if in compatibility mode, false if
     * not compatibility mode or not ie
     */
    ieCompatibilityMode: function() {
      return _populate() || (_ie_real_version > _ie);
    },


    /**
     * Whether the browser is 64-bit IE.  Really, this is kind of weak sauce;  we
     * only need this because Skype can't handle 64-bit IE yet.  We need to remove
     * this when we don't need it -- tracked by #601957.
     */
    ie64: function() {
      return UserAgent_DEPRECATED.ie() && _win64;
    },

    /**
     *  Check if the UA is Firefox.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    firefox: function() {
      return _populate() || _firefox;
    },


    /**
     *  Check if the UA is Opera.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    opera: function() {
      return _populate() || _opera;
    },


    /**
     *  Check if the UA is WebKit.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    webkit: function() {
      return _populate() || _webkit;
    },

    /**
     *  For Push
     *  WILL BE REMOVED VERY SOON. Use UserAgent_DEPRECATED.webkit
     */
    safari: function() {
      return UserAgent_DEPRECATED.webkit();
    },

    /**
     *  Check if the UA is a Chrome browser.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    chrome : function() {
      return _populate() || _chrome;
    },


    /**
     *  Check if the user is running Windows.
     *
     *  @return bool `true' if the user's OS is Windows.
     */
    windows: function() {
      return _populate() || _windows;
    },


    /**
     *  Check if the user is running Mac OS X.
     *
     *  @return float|bool   Returns a float if a version number is detected,
     *                       otherwise true/false.
     */
    osx: function() {
      return _populate() || _osx;
    },

    /**
     * Check if the user is running Linux.
     *
     * @return bool `true' if the user's OS is some flavor of Linux.
     */
    linux: function() {
      return _populate() || _linux;
    },

    /**
     * Check if the user is running on an iPhone or iPod platform.
     *
     * @return bool `true' if the user is running some flavor of the
     *    iPhone OS.
     */
    iphone: function() {
      return _populate() || _iphone;
    },

    mobile: function() {
      return _populate() || (_iphone || _ipad || _android || _mobile);
    },

    nativeApp: function() {
      // webviews inside of the native apps
      return _populate() || _native;
    },

    android: function() {
      return _populate() || _android;
    },

    ipad: function() {
      return _populate() || _ipad;
    }
  };

  var UserAgent_DEPRECATED_1 = UserAgent_DEPRECATED;

  /**
   * Copyright (c) 2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ExecutionEnvironment
   */

  var canUseDOM = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );

  /**
   * Simple, lightweight module assisting with the detection and context of
   * Worker. Helps avoid circular dependencies and allows code to reason about
   * whether or not they are in a Worker, even if they never include the main
   * `ReactWorker` dependency.
   */
  var ExecutionEnvironment = {

    canUseDOM: canUseDOM,

    canUseWorkers: typeof Worker !== 'undefined',

    canUseEventListeners:
      canUseDOM && !!(window.addEventListener || window.attachEvent),

    canUseViewport: canUseDOM && !!window.screen,

    isInWorker: !canUseDOM // For now, this is true - might change in the future.

  };

  var ExecutionEnvironment_1 = ExecutionEnvironment;

  var useHasFeature;
  if (ExecutionEnvironment_1.canUseDOM) {
    useHasFeature =
      document.implementation &&
      document.implementation.hasFeature &&
      // always returns true in newer browsers as per the standard.
      // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
      document.implementation.hasFeature('', '') !== true;
  }

  /**
   * Checks if an event is supported in the current execution environment.
   *
   * NOTE: This will not work correctly for non-generic events such as `change`,
   * `reset`, `load`, `error`, and `select`.
   *
   * Borrows from Modernizr.
   *
   * @param {string} eventNameSuffix Event name, e.g. "click".
   * @param {?boolean} capture Check if the capture phase is supported.
   * @return {boolean} True if the event is supported.
   * @internal
   * @license Modernizr 3.0.0pre (Custom Build) | MIT
   */
  function isEventSupported(eventNameSuffix, capture) {
    if (!ExecutionEnvironment_1.canUseDOM ||
        capture && !('addEventListener' in document)) {
      return false;
    }

    var eventName = 'on' + eventNameSuffix;
    var isSupported = eventName in document;

    if (!isSupported) {
      var element = document.createElement('div');
      element.setAttribute(eventName, 'return;');
      isSupported = typeof element[eventName] === 'function';
    }

    if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
      // This is the only way to test support for the `wheel` event in IE9+.
      isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
    }

    return isSupported;
  }

  var isEventSupported_1 = isEventSupported;

  // Reasonable defaults
  var PIXEL_STEP  = 10;
  var LINE_HEIGHT = 40;
  var PAGE_HEIGHT = 800;

  /**
   * Mouse wheel (and 2-finger trackpad) support on the web sucks.  It is
   * complicated, thus this doc is long and (hopefully) detailed enough to answer
   * your questions.
   *
   * If you need to react to the mouse wheel in a predictable way, this code is
   * like your bestest friend. * hugs *
   *
   * As of today, there are 4 DOM event types you can listen to:
   *
   *   'wheel'                -- Chrome(31+), FF(17+), IE(9+)
   *   'mousewheel'           -- Chrome, IE(6+), Opera, Safari
   *   'MozMousePixelScroll'  -- FF(3.5 only!) (2010-2013) -- don't bother!
   *   'DOMMouseScroll'       -- FF(0.9.7+) since 2003
   *
   * So what to do?  The is the best:
   *
   *   normalizeWheel.getEventType();
   *
   * In your event callback, use this code to get sane interpretation of the
   * deltas.  This code will return an object with properties:
   *
   *   spinX   -- normalized spin speed (use for zoom) - x plane
   *   spinY   -- " - y plane
   *   pixelX  -- normalized distance (to pixels) - x plane
   *   pixelY  -- " - y plane
   *
   * Wheel values are provided by the browser assuming you are using the wheel to
   * scroll a web page by a number of lines or pixels (or pages).  Values can vary
   * significantly on different platforms and browsers, forgetting that you can
   * scroll at different speeds.  Some devices (like trackpads) emit more events
   * at smaller increments with fine granularity, and some emit massive jumps with
   * linear speed or acceleration.
   *
   * This code does its best to normalize the deltas for you:
   *
   *   - spin is trying to normalize how far the wheel was spun (or trackpad
   *     dragged).  This is super useful for zoom support where you want to
   *     throw away the chunky scroll steps on the PC and make those equal to
   *     the slow and smooth tiny steps on the Mac. Key data: This code tries to
   *     resolve a single slow step on a wheel to 1.
   *
   *   - pixel is normalizing the desired scroll delta in pixel units.  You'll
   *     get the crazy differences between browsers, but at least it'll be in
   *     pixels!
   *
   *   - positive value indicates scrolling DOWN/RIGHT, negative UP/LEFT.  This
   *     should translate to positive value zooming IN, negative zooming OUT.
   *     This matches the newer 'wheel' event.
   *
   * Why are there spinX, spinY (or pixels)?
   *
   *   - spinX is a 2-finger side drag on the trackpad, and a shift + wheel turn
   *     with a mouse.  It results in side-scrolling in the browser by default.
   *
   *   - spinY is what you expect -- it's the classic axis of a mouse wheel.
   *
   *   - I dropped spinZ/pixelZ.  It is supported by the DOM 3 'wheel' event and
   *     probably is by browsers in conjunction with fancy 3D controllers .. but
   *     you know.
   *
   * Implementation info:
   *
   * Examples of 'wheel' event if you scroll slowly (down) by one step with an
   * average mouse:
   *
   *   OS X + Chrome  (mouse)     -    4   pixel delta  (wheelDelta -120)
   *   OS X + Safari  (mouse)     -  N/A   pixel delta  (wheelDelta  -12)
   *   OS X + Firefox (mouse)     -    0.1 line  delta  (wheelDelta  N/A)
   *   Win8 + Chrome  (mouse)     -  100   pixel delta  (wheelDelta -120)
   *   Win8 + Firefox (mouse)     -    3   line  delta  (wheelDelta -120)
   *
   * On the trackpad:
   *
   *   OS X + Chrome  (trackpad)  -    2   pixel delta  (wheelDelta   -6)
   *   OS X + Firefox (trackpad)  -    1   pixel delta  (wheelDelta  N/A)
   *
   * On other/older browsers.. it's more complicated as there can be multiple and
   * also missing delta values.
   *
   * The 'wheel' event is more standard:
   *
   * http://www.w3.org/TR/DOM-Level-3-Events/#events-wheelevents
   *
   * The basics is that it includes a unit, deltaMode (pixels, lines, pages), and
   * deltaX, deltaY and deltaZ.  Some browsers provide other values to maintain
   * backward compatibility with older events.  Those other values help us
   * better normalize spin speed.  Example of what the browsers provide:
   *
   *                          | event.wheelDelta | event.detail
   *        ------------------+------------------+--------------
   *          Safari v5/OS X  |       -120       |       0
   *          Safari v5/Win7  |       -120       |       0
   *         Chrome v17/OS X  |       -120       |       0
   *         Chrome v17/Win7  |       -120       |       0
   *                IE9/Win7  |       -120       |   undefined
   *         Firefox v4/OS X  |     undefined    |       1
   *         Firefox v4/Win7  |     undefined    |       3
   *
   */
  function normalizeWheel(/*object*/ event) /*object*/ {
    var sX = 0, sY = 0,       // spinX, spinY
        pX = 0, pY = 0;       // pixelX, pixelY

    // Legacy
    if ('detail'      in event) { sY = event.detail; }
    if ('wheelDelta'  in event) { sY = -event.wheelDelta / 120; }
    if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
    if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }

    // side scrolling on FF with DOMMouseScroll
    if ( 'axis' in event && event.axis === event.HORIZONTAL_AXIS ) {
      sX = sY;
      sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ('deltaY' in event) { pY = event.deltaY; }
    if ('deltaX' in event) { pX = event.deltaX; }

    if ((pX || pY) && event.deltaMode) {
      if (event.deltaMode == 1) {          // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {                             // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }

    // Fall-back if spin cannot be determined
    if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
    if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

    return { spinX  : sX,
             spinY  : sY,
             pixelX : pX,
             pixelY : pY };
  }


  /**
   * The best combination if you prefer spinX + spinY normalization.  It favors
   * the older DOMMouseScroll for Firefox, as FF does not include wheelDelta with
   * 'wheel' event, making spin speed determination impossible.
   */
  normalizeWheel.getEventType = function() /*string*/ {
    return (UserAgent_DEPRECATED_1.firefox())
             ? 'DOMMouseScroll'
             : (isEventSupported_1('wheel'))
                 ? 'wheel'
                 : 'mousewheel';
  };

  var normalizeWheel_1 = normalizeWheel;

  var normalizeWheel$1 = normalizeWheel_1;

  // https://remysharp.com/2010/07/21/throttling-function-calls
  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last, deferTimer;
    return function() {
      var context = scope || this;

      var now = +new Date(),
        args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  function toPercent(n) {
    return n * 100 + '%';
  }

  // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
  // Test via a getter in the options object to see if the passive property is accessed
  var supportsPassiveEvents = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassiveEvents = true;
      },
    });
    window.addEventListener('test', null, opts);
  } catch (e) {}

  var supportsMutationObserver = 'MutationObserver' in window;

  var DOM_SUBTREE_MODIFIED_EVENT = 'DOMSubtreeModified';
  var PROPERTY_CHANGE_EVENT = 'propertychange';
  var MOUSE_WHEEL_EVENT = 'wheel';
  var KEY_DOWN_EVENT = 'keydown';
  var MOUSE_MOVE_EVENT = 'mousemove';
  var MOUSE_UP_EVENT = 'mouseup';
  var TOUCH_MOVE = 'touchmove';
  var TOUCH_START = 'touchstart';
  var TOUCH_END = 'touchend';
  var DOM_CHANGE_HANDLER_THROTTLING_RATE = 250;
  var PARENT_SCROLL_ACTIVATION_POINT = 25;

  var script = {
    name: 'scrolly',

    props: {
      parentScroll: {
        type: Boolean,
        default: true,
      },
      passiveScroll: {
        type: Boolean,
        default: false,
      },
    },

    data: function data() {
      return {
        container: null,
        viewport: null,
        barX: null,
        barY: null,
        onMouseWheelHandler: null,
        onDomChangeHandler: null,
        mutationObserver: null,
        isScrolling: false,
        touchStartX: null,
        touchStartY: null,
      };
    },

    computed: {
      classnames: function classnames() {
        return ['scrolly', this.isScrolling ? 'is-scrolling' : ''];
      },
    },

    mounted: function mounted() {
      this.$nextTick(function() {
        var container = this.$el,
          viewport,
          barX,
          barY;

        // Scan through child nodes to pick up viewport & scrollbars.
        var childNodes = container.childNodes;
        var childNode,
          i = 0;
        while ((childNode = childNodes[i++])) {
          var className = childNode.className;
          if (!className) { continue; }
          className.match('scrolly-viewport') && (viewport = childNode);
          className.match('axis-x') && (barX = childNode);
          className.match('axis-y') && (barY = childNode);
        }

        // If viewport or scrollbars do not exist, stop.
        if (!viewport || (!barX && !barY)) {
          return;
        }

        // Attach mouse wheel event
        var onMouseWheelHandler = this.onMouseWheel.bind(this);

        // If parentScroll is disabled, passiveScroll cannot be enabled.
        var passive = !this.parentScroll ? false : this.passiveScroll;

        container.addEventListener(
          MOUSE_WHEEL_EVENT,
          onMouseWheelHandler,
          // Unable to turn on passive: true if parentScroll is disabled.
          // Violation warning is expected in Chrome.
          supportsPassiveEvents ? { passive: passive } : false
        );

        // Attach key down event
        var onKeyDownHandler = this.onKeyDown.bind(this);

        container.addEventListener(
          KEY_DOWN_EVENT,
          onKeyDownHandler
        );

        container.addEventListener(
          TOUCH_START,
          this.onTouchStart
        );

        container.addEventListener(
          TOUCH_END,
          this.onTouchEnd
        );

        container.addEventListener(
          TOUCH_MOVE,
          this.onTouchMove,
          // Unable to turn on passive: true if parentScroll is disabled.
          // Violation warning is expected in Chrome.
          supportsPassiveEvents ? { passive: passive } : false
        );

        // Observe viewport for content changes
        var onDomChangeHandler = this.onDomChange.bind(this);
        var mutationObserver;
        if (supportsMutationObserver) {
          mutationObserver = new MutationObserver(onDomChangeHandler);
          mutationObserver.observe(viewport, {
            childList: true,
            characterData: true,
            subtree: true,
            attributes: true,
          });
        } else {
          // Fallback for browsers without mutationObserver support
          viewport.addEventListener(
            DOM_SUBTREE_MODIFIED_EVENT,
            onDomChangeHandler
          );
          viewport.addEventListener(PROPERTY_CHANGE_EVENT, onDomChangeHandler);
        }

        // Assign back to this
        Object.assign(this, {
          container: container,
          viewport: viewport,
          barX: barX,
          barY: barY,
          onMouseWheelHandler: onMouseWheelHandler,
          onDomChangeHandler: onDomChangeHandler,
          mutationObserver: mutationObserver,
        });
      });
    },

    methods: {
      onMouseEnter: function onMouseEnter() {
        this.refreshScrollLayout();
      },

      onMouseDown: function onMouseDown(ref) {
        var bar = ref.target;
        var initialPageX = ref.pageX;
        var initialPageY = ref.pageY;

        var className = bar.className;

        if (!className.match('scrolly-bar')) { return; }

        var scrollLayout = {};

        var self = this;
        var ref$1 = this;
        var barX = ref$1.barX;
        var barY = ref$1.barY;
        var ref$2 = this;
        var container = ref$2.container;
        var viewport = ref$2.viewport;
        var addEventListener = window.addEventListener;
        var removeEventListener = window.removeEventListener;
        var isAxisX = className.match('axis-x');
        var isAxisY = className.match('axis-y');
        var initialBarTop = bar.offsetTop;
        var initialBarLeft = bar.offsetLeft;

        self.isScrolling = true;

        function onMouseMove(event) {
          // Prevents text selection
          event.preventDefault();

          // Get current cursor position
          var pageX = event.pageX;
          var pageY = event.pageY;

          if (isAxisX) {
            // Get viewport dimension and scroll position
            var scrollLeft = viewport.scrollLeft;
            var scrollWidth = viewport.scrollWidth;
            var viewportWidth = viewport.offsetWidth;

            // Get computed bar width where the browser already
            // took account of min-width/max-width constraints.
            var barWidth = bar.offsetWidth;

            // Determine min/max bar position
            var minBarLeft = 0;
            var maxBarLeft = viewportWidth - barWidth;

            // Calculate new bar position
            var dx = pageX - initialPageX;
            var barLeft = initialBarLeft + dx;
            barLeft < minBarLeft && (barLeft = minBarLeft);
            barLeft > maxBarLeft && (barLeft = maxBarLeft);

            // Set scrollbar position
            bar.style.left = toPercent(barLeft / viewportWidth);

            // From the new scrollbar position,
            // set the new viewport scroll position.
            viewport.scrollLeft =
              barLeft / maxBarLeft * (scrollWidth - viewportWidth);

            // Determine if new bar position is on edge
            var onLeftEdge = barLeft < minBarLeft;
            var onRightEdge = barLeft > maxBarLeft;
            var onEdge = onLeftEdge || onRightEdge;

            // Determine other scroll layout properties
            var visible = true;
            var canUnlockParentScroll = false;
            var canScrollParent = false;

            // Create scroll layout
            scrollLayout.x = barX.scrollLayout = {
              barX: barX,
              scrollLeft: scrollLeft,
              scrollWidth: scrollWidth,
              viewportWidth: viewportWidth,
              barWidth: barWidth,
              barLeft: barLeft,
              minBarLeft: minBarLeft,
              maxBarLeft: maxBarLeft,
              visible: visible,
              onLeftEdge: onLeftEdge,
              onRightEdge: onRightEdge,
              onEdge: onEdge,
              canUnlockParentScroll: canUnlockParentScroll,
              canScrollParent: canScrollParent,
            };
          }

          if (isAxisY) {
            // Get viewport dimension and scroll position
            var scrollTop = viewport.scrollTop;
            var scrollHeight = viewport.scrollHeight;
            var viewportHeight = viewport.offsetHeight;

            // Get computed bar height where the browser already
            // took account of min-height/max-height constraints.
            var barHeight = bar.offsetHeight;

            // Determine min/max bar position
            var minBarTop = 0;
            var maxBarTop = viewportHeight - barHeight;

            // Calculate new bar position
            var dy = pageY - initialPageY;
            var barTop = initialBarTop + dy;
            barTop < minBarTop && (barTop = minBarTop);
            barTop > maxBarTop && (barTop = maxBarTop);

            // Set scrollbar position
            bar.style.top = toPercent(barTop / viewportHeight);

            // From the new scrollbar position,
            // set the new viewport scroll position.
            viewport.scrollTop =
              barTop / maxBarTop * (scrollHeight - viewportHeight);

            // Determine if new bar position is on edge
            var onTopEdge = barTop <= minBarTop;
            var onBottomEdge = barTop >= maxBarTop;
            var onEdge$1 = onTopEdge || onBottomEdge;

            // Determine other scroll layout properties
            var visible$1 = true;
            var canUnlockParentScroll$1 = false;
            var canScrollParent$1 = false;
            var scrolled$1 = true;

            // Create scroll layout
            scrollLayout.y = barY.scrollLayout = {
              barY: barY,
              scrollTop: scrollTop,
              scrollHeight: scrollHeight,
              viewportHeight: viewportHeight,
              barHeight: barHeight,
              barTop: barTop,
              minBarTop: minBarTop,
              maxBarTop: maxBarTop,
              onTopEdge: onTopEdge,
              onBottomEdge: onBottomEdge,
              onEdge: onEdge$1,
              visible: visible$1,
              canUnlockParentScroll: canUnlockParentScroll$1,
              canScrollParent: canScrollParent$1,
              scrolled: scrolled$1,
            };
          }

          // Emit scrollchange event
          self.$emit('scrollchange', scrollLayout);
        }

        function onMouseUp() {
          self.isScrolling = false;
          removeEventListener(MOUSE_UP_EVENT, onMouseUp);
          removeEventListener(MOUSE_MOVE_EVENT, onMouseMove);
        }

        addEventListener('mousemove', onMouseMove);
        addEventListener('mouseup', onMouseUp);
      },

      onTouchStart: function onTouchStart (event) {
        this.touchStartX = event.touches[0].pageX;
        this.touchStartY = event.touches[0].pageY;
      },

      onTouchEnd: function onTouchEnd () {
        this.touchStartX = null;
        this.touchStartY = null;
      },

      onTouchMove: function onTouchMove(event) {
        if (!this.touchStartX) {
          this.touchStartX = event.touches[0].pageX;
          this.touchStartY = event.touches[0].pageY;
        }

        var dx = -(event.touches[0].pageX - this.touchStartX);
        var dy = -(event.touches[0].pageY - this.touchStartY);
        this.touchStartX = event.touches[0].pageX;
        this.touchStartY = event.touches[0].pageY;

        var ref =
          // after refreshing scroll layout
          this.refreshScrollLayout(dx, dy);
        var scrollLayoutX = ref.x;
        var scrollLayoutY = ref.y;

        // If using passive scrolling, stop.
        if (this.passiveScroll) { return; }

        // Determine if scrolling of parent body should be prevented
        var canScrollParentX = scrollLayoutX && scrollLayoutX.canScrollParent;
        var canScrollParentY = scrollLayoutY && scrollLayoutY.canScrollParent;

        // If scrolling parent is not possible, prevent it.
        (!this.parentScroll || !(canScrollParentX || canScrollParentY)) &&
          event.preventDefault();
      },

      onMouseWheel: function onMouseWheel(event) {
        // Normalize wheel event and get scroll delta
        var ref = normalizeWheel$1(event);
        var dx = ref.pixelX;
        var dy = ref.pixelY;

        // Get scroll layout
        var ref$1 =
          // after refreshing scroll layout
          this.refreshScrollLayout(dx, dy);
        var scrollLayoutX = ref$1.x;
        var scrollLayoutY = ref$1.y;

        // If using passive scrolling, stop.
        if (this.passiveScroll) { return; }

        // Determine if scrolling of parent body should be prevented
        var canScrollParentX = scrollLayoutX && scrollLayoutX.canScrollParent;
        var canScrollParentY = scrollLayoutY && scrollLayoutY.canScrollParent;

        // If scrolling parent is not possible, prevent it.
        (!this.parentScroll || !(canScrollParentX || canScrollParentY)) &&
          event.preventDefault();
      },

      onMouseLeave: function onMouseLeave(event) {
        var ref = this;
        var barX = ref.barX;
        var barY = ref.barY;
        barX && (barX.scrollLayout = null);
        barY && (barY.scrollLayout = null);
      },

      onKeyDown: function onKeyDown(event) {
        var ref = this;
        var container = ref.container;

        switch (event.which) { // Figure out which one it is
          case 37:
              // Left Arrow
              this.refreshScrollLayout(-20, 0);
              break;
          case 38:
              // Up Arrow
              this.refreshScrollLayout(0, -20);
              break;
          case 39:
              // Right Arrow
              this.refreshScrollLayout(20, 0);
              break;
          case 40:
              // Down Arrow
              this.refreshScrollLayout(0, 20);
              break;
          case 33:
              // Page Up
              this.refreshScrollLayout(0, -container.clientHeight + 10);
              break;
          case 34:
              // Page Down
              this.refreshScrollLayout(0, container.clientHeight - 10);
              break;
          default:
              return;
        }
      },

      onDomChange: throttle(function() {
        this.refreshScrollLayout();
      }, DOM_CHANGE_HANDLER_THROTTLING_RATE),

      refreshScrollLayout: function refreshScrollLayout(dx, dy) {
        if ( dx === void 0 ) dx = 0;
        if ( dy === void 0 ) dy = 0;

        var scrollLayout = {};

        // Get viewport, barX, barY
        var ref = this;
        var viewport = ref.viewport;
        var barX = ref.barX;
        var barY = ref.barY;

        if (barX) {
          // Update scroll position
          var scrolled = dx !== 0;
          viewport.scrollLeft += dx;

          // Get viewport dimension and scroll position
          var scrollLeft = viewport.scrollLeft;
          var scrollWidth = viewport.scrollWidth;
          var viewportWidth = viewport.offsetWidth;

          // Get bar style
          var barStyle = barX.style;

          // Set the width of the bar to let the browser
          // adjust to min-width/max-width constraints.
          barStyle.visibility = 'hidden';
          barStyle.display = 'block';
          barStyle.width = toPercent(viewportWidth / scrollWidth);

          // Get computed bar width
          var barWidth = barX.offsetWidth;

          // Using the computed bar width,
          // determine minBarLeft and maxBarLeft.
          var minBarLeft = 0;
          var maxBarLeft = viewportWidth - barWidth;

          // Calculate new bar position
          var barLeft =
            scrollLeft / (scrollWidth - viewportWidth) * maxBarLeft || 0;

          // Determine if new bar position is on edge
          var onLeftEdge = barLeft < minBarLeft;
          var onRightEdge = barLeft > maxBarLeft;
          var onEdge = onLeftEdge || onRightEdge;

          // If new bar position is on edge,
          // ensure it stays within min/max position.
          onLeftEdge && (barLeft = minBarLeft);
          onRightEdge && (barLeft = maxBarLeft);

          // Set bar position
          barStyle.left = toPercent(barLeft / viewportWidth);

          // Determine if bar needs to be shown
          var visible = barWidth < viewportWidth;
          barStyle.display = visible ? 'block' : 'none';
          barStyle.visibility = 'visible';

          // Determine if there's enough inertia
          // to unlock parent scrolling.
          var canUnlockParentScroll =
            Math.abs(dx) > PARENT_SCROLL_ACTIVATION_POINT;

          // Get previous scroll layout to determine
          // if we can unlock parent scrolling
          var previousScrollLayout = barX.scrollLayout || {};
          var wasOnEdge = previousScrollLayout.onEdge;
          var couldUnlockParentScroll = previousScrollLayout.canUnlockParentScroll;
          var couldScrollParent = previousScrollLayout.canScrollParent;

          // Allow scrolling of parent...
          var canScrollParent = !!// ...if parent scrolling was previously unlocked,
          // continue let user scroll parent body.
          (
            couldScrollParent ||
            // ...if scrollbar reached the edge of the viewport,
            // and user scrolled with enough inertia with
            // the intention to scroll parent body.
            (wasOnEdge && couldUnlockParentScroll)
          );

          // Add to computedLayout
          scrollLayout.x = barX.scrollLayout = {
            barX: barX,
            scrollLeft: scrollLeft,
            scrollWidth: scrollWidth,
            viewportWidth: viewportWidth,
            barWidth: barWidth,
            barLeft: barLeft,
            minBarLeft: minBarLeft,
            maxBarLeft: maxBarLeft,
            visible: visible,
            onLeftEdge: onLeftEdge,
            onRightEdge: onRightEdge,
            onEdge: onEdge,
            visible: visible,
            canUnlockParentScroll: canUnlockParentScroll,
            canScrollParent: canScrollParent,
            scrolled: scrolled,
          };
        }

        if (barY) {
          // Update scroll position
          var scrolled$1 = dy !== 0;
          viewport.scrollTop += dy;

          // Get viewport dimension and scroll position
          var scrollTop = viewport.scrollTop;
          var scrollHeight = viewport.scrollHeight;
          var viewportHeight = viewport.offsetHeight;

          // Get bar style
          var barStyle$1 = barY.style;

          // Set the height of the bar to let the browser
          // adjust to min-height/max-height constraints.
          barStyle$1.visibility = 'hidden';
          barStyle$1.display = 'block';
          barStyle$1.height = toPercent(viewportHeight / scrollHeight);

          // Get computed bar height
          var barHeight = barY.offsetHeight;

          // From the computed bar height,
          // determine minBarTop and maxBarTop.
          var minBarTop = 0;
          var maxBarTop = viewportHeight - barHeight;

          // Calculate new bar position
          var barTop =
            scrollTop / (scrollHeight - viewportHeight) * maxBarTop || 0;

          // Determine if new bar position is on edge
          var onTopEdge = barTop <= minBarTop;
          var onBottomEdge = barTop >= maxBarTop;
          var onEdge$1 = onTopEdge || onBottomEdge;

          // If new bar position is on edge,
          // ensure it stays within min/max position.
          onTopEdge && (barTop = minBarTop);
          onBottomEdge && (barTop = maxBarTop);

          // Set bar position
          barStyle$1.top = toPercent(barTop / viewportHeight);

          // Determine if bar needs to be shown
          var visible$1 = barHeight < viewportHeight;
          barStyle$1.display = visible$1 ? 'block' : 'none';
          barStyle$1.visibility = 'visible';

          // Determine if there's enough inertia
          // to unlock parent scrolling.
          var canUnlockParentScroll$1 =
            Math.abs(dy) > PARENT_SCROLL_ACTIVATION_POINT;

          // Get previous scroll layout to determine
          // if we can unlock parent scrolling
          var previousScrollLayout$1 = barY.scrollLayout || {};
          var ref$1 = previousScrollLayout$1;
          var wasOnEdge$1 = ref$1.onEdge;
          var couldUnlockParentScroll$1 = ref$1.canUnlockParentScroll;
          var couldScrollParent$1 = ref$1.canScrollParent;

          // Allow scrolling of parent...
          var canScrollParent$1 = !!// ...if scrollbar is on edge and...
          (
            onEdge$1 &&
            // ...if parent scrolling was previously unlocked,
            // continue let user scroll parent body.
            (couldScrollParent$1 ||
              // ...if scrollbar reached the edge of the viewport,
              // and user scrolled with enough inertia with
              // the intention to scroll parent body.
              (wasOnEdge$1 && couldUnlockParentScroll$1))
          );

          // Add to computedLayout
          scrollLayout.y = barY.scrollLayout = {
            barY: barY,
            scrollTop: scrollTop,
            scrollHeight: scrollHeight,
            viewportHeight: viewportHeight,
            barHeight: barHeight,
            barTop: barTop,
            minBarTop: minBarTop,
            maxBarTop: maxBarTop,
            onTopEdge: onTopEdge,
            onBottomEdge: onBottomEdge,
            onEdge: onEdge$1,
            visible: visible$1,
            canUnlockParentScroll: canUnlockParentScroll$1,
            canScrollParent: canScrollParent$1,
            scrolled: scrolled$1,
          };
        }

        // Emit scrollchange event
        this.$emit('scrollchange', scrollLayout);

        return scrollLayout;
      },
    },

    beforeDestroy: function beforeDestroy() {
      var ref = this;
      var container = ref.container;
      var viewport = ref.viewport;
      var barX = ref.barX;
      var barY = ref.barY;
      var onMouseWheelHandler = ref.onMouseWheelHandler;
      var onDomChangeHandler = ref.onDomChangeHandler;
      var mutationObserver = ref.mutationObserver;

      // Disconnect mutation observer
      mutationObserver && mutationObserver.disconnect();

      // Detach onDomChangeHandler
      if (!supportsMutationObserver) {
        viewport.removeEventListener(
          DOM_SUBTREE_MODIFIED_EVENT,
          onDomChangeHandler
        );
        viewport.removeEventListener(PROPERTY_CHANGE_EVENT, onDomChangeHandler);
      }

      // Detach onMouseWheelHandler
      container.removeEventListener(MOUSE_WHEEL_EVENT, onMouseWheelHandler);
    },
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }
  var HEAD = document.head || document.getElementsByTagName('head')[0];
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) { style.element.setAttribute('media', css.media); }
        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) { style.element.removeChild(nodes[index]); }
        if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
      }
    }
  }

  var browser = createInjector;

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        class: _vm.classnames,
        attrs: { tabindex: "1" },
        on: {
          mouseenter: _vm.onMouseEnter,
          mousedown: _vm.onMouseDown,
          mouseleave: _vm.onMouseLeave,
          touchstart: _vm.onTouchStart
        }
      },
      [_vm._t("default")],
      2
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-466af7de_0", { source: ".scrolly {\n  position: relative;\n}\n.scrolly .scrolly-bar {\n    opacity: 0;\n}\n.scrolly:hover .scrolly-bar, .scrolly.is-scrolling .scrolly-bar {\n    opacity: 1;\n}\n.scrolly-viewport {\n  position: absolute;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n}\n.scrolly-bar {\n  position: absolute;\n  border: 7px solid transparent;\n  cursor: pointer;\n  z-index: 2;\n  transition: opacity .1s ease;\n}\n.scrolly-bar:before {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    content: \" \";\n    background: rgba(0, 0, 0, 0.3);\n    border-radius: 7px;\n    transition: background .2s ease;\n}\n.scrolly-bar:hover:before {\n    background: rgba(0, 0, 0, 0.6);\n}\n.scrolly-bar.axis-x {\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  height: 21px;\n  min-width: 20%;\n  max-width: 100%;\n}\n.scrolly-bar.axis-y {\n  top: 0;\n  right: 0;\n  width: 21px;\n  height: 100%;\n  min-height: 20%;\n  max-height: 100%;\n}\n\n/*# sourceMappingURL=Scrolly.vue.map */", map: {"version":3,"sources":["/home/leo/work/vue-scrolly/src/Scrolly.vue","Scrolly.vue"],"names":[],"mappings":"AAWA;EACA,kBAAA;AAAA;AADA;IAIA,UAAA;AAAA;AAJA;IAUA,UAAA;AAAA;AAKA;EACA,kBAAA;EACA,gBAAA;EACA,WAAA;EACA,YAAA;EACA,UAAA;AAAA;AAGA;EACA,kBAAA;EACA,6BAAA;EACA,eAAA;EACA,UAAA;EACA,4BAAA;AAAA;AALA;IAQA,kBAAA;IACA,WAAA;IACA,YAAA;IACA,YAAA;IACA,8BAAA;IACA,kBAtCA;IAuCA,+BAAA;AAAA;AAdA;IAmBA,8BAAA;AAAA;AAKA;EACA,OAAA;EACA,SAAA;EACA,WAAA;EACA,YAAA;EACA,cAAA;EACA,eAAA;AAAA;AAGA;EACA,MAAA;EACA,QAAA;EACA,WAAA;EACA,YAAA;EACA,eAAA;EACA,gBAAA;AAAA;;AC1BA,sCAAsC","file":"Scrolly.vue","sourcesContent":["<template>\n<div :class=\"classnames\" @mouseenter=\"onMouseEnter\" @mousedown=\"onMouseDown\" @mouseleave=\"onMouseLeave\" @touchstart=\"onTouchStart\" tabindex=\"1\">\n  <slot></slot>\n</div>\n</template>\n\n<script src=\"./Scrolly.js\"></script>\n\n<style lang=\"scss\">\n$scrolly-bar-size: 7px;\n\n.scrolly {\n  position: relative;\n\n  .scrolly-bar {\n    opacity: 0;\n  }\n\n  &:hover,\n  &.is-scrolling {\n    .scrolly-bar {\n      opacity: 1;\n    }\n  }\n}\n\n.scrolly-viewport {\n  position: absolute;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n}\n\n.scrolly-bar {\n  position: absolute;\n  border: $scrolly-bar-size solid transparent;\n  cursor: pointer;\n  z-index: 2;\n  transition: opacity .1s ease;\n\n  &:before {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    content: \" \";\n    background: rgba(0, 0, 0, 0.3);\n    border-radius: $scrolly-bar-size;\n    transition: background .2s ease;\n  }\n\n  &:hover {\n    &:before {\n      background: rgba(0, 0, 0, 0.6);\n    }\n  }\n}\n\n.scrolly-bar.axis-x {\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  height: $scrolly-bar-size * 3;\n  min-width: 20%;\n  max-width: 100%;\n}\n\n.scrolly-bar.axis-y {\n  top: 0;\n  right: 0;\n  width: $scrolly-bar-size * 3;\n  height: 100%;\n  min-height: 20%;\n  max-height: 100%;\n}\n</style>\n",".scrolly {\n  position: relative; }\n  .scrolly .scrolly-bar {\n    opacity: 0; }\n  .scrolly:hover .scrolly-bar, .scrolly.is-scrolling .scrolly-bar {\n    opacity: 1; }\n\n.scrolly-viewport {\n  position: absolute;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n  z-index: 1; }\n\n.scrolly-bar {\n  position: absolute;\n  border: 7px solid transparent;\n  cursor: pointer;\n  z-index: 2;\n  transition: opacity .1s ease; }\n  .scrolly-bar:before {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    content: \" \";\n    background: rgba(0, 0, 0, 0.3);\n    border-radius: 7px;\n    transition: background .2s ease; }\n  .scrolly-bar:hover:before {\n    background: rgba(0, 0, 0, 0.6); }\n\n.scrolly-bar.axis-x {\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  height: 21px;\n  min-width: 20%;\n  max-width: 100%; }\n\n.scrolly-bar.axis-y {\n  top: 0;\n  right: 0;\n  width: 21px;\n  height: 100%;\n  min-height: 20%;\n  max-height: 100%; }\n\n/*# sourceMappingURL=Scrolly.vue.map */"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = undefined;
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    

    
    var Scrolly = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      browser,
      undefined
    );

  //
  //
  //
  //

  var script$1 = {
    name: 'scrolly-viewport',

    computed: {
      classnames: function classnames() {
        return [
          'scrolly-viewport'
        ];
      },
    },
  };

  /* script */
  var __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { class: _vm.classnames }, [_vm._t("default")], 2)
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    var __vue_inject_styles__$1 = undefined;
    /* scoped */
    var __vue_scope_id__$1 = undefined;
    /* module identifier */
    var __vue_module_identifier__$1 = undefined;
    /* functional template */
    var __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var ScrollyViewport = normalizeComponent_1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      undefined,
      undefined
    );

  //
  //
  //
  //

  var script$2 = {
    name: 'scrolly-bar',

    props: {
      axis: {
        type: String,
        default: 'y'
      }
    },

    computed: {
      classnames: function classnames() {
        return [
          'scrolly-bar',
          'axis-' + this.axis
        ];
      },
    },
  };

  /* script */
  var __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { class: _vm.classnames }, [_vm._t("default")], 2)
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    var __vue_inject_styles__$2 = undefined;
    /* scoped */
    var __vue_scope_id__$2 = undefined;
    /* module identifier */
    var __vue_module_identifier__$2 = undefined;
    /* functional template */
    var __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var ScrollyBar = normalizeComponent_1(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      undefined,
      undefined
    );

  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.component('scrolly', Scrolly);
    window.Vue.component('scrolly-viewport', ScrollyViewport);
    window.Vue.component('scrolly-bar', ScrollyBar);
  }

  exports.Scrolly = Scrolly;
  exports.ScrollyViewport = ScrollyViewport;
  exports.ScrollyBar = ScrollyBar;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
