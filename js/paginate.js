/**
 * App-like page pager for RPGym — modeled directly on the reference
 * (nitais-brand-vault.base44.app), which does NOT use native document
 * scrolling at all: #pager is a fixed 100vh viewport with the content
 * track shifted by `transform: translateY()`.
 */
(function () {
  var track = document.getElementById("pager-track");
  var dotsWrap = document.getElementById("pager-dots");
  if (!track || !dotsWrap) return;

  var pages = Array.prototype.slice.call(track.children);
  if (!pages.length) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  var current = 0;
  var isAnimating = false;
  var unlockTimer = null;
  var vh = window.innerHeight;

  var dots = pages.map(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "pager-dot";
    dot.setAttribute("aria-label", "Go to section " + (i + 1));
    dot.addEventListener("click", function () {
      goTo(i);
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function updateDots() {
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });
  }

  function applyTransform() {
    track.style.transform = "translateY(" + -current * vh + "px)";
  }

  function goTo(index) {
    index = Math.max(0, Math.min(pages.length - 1, index));
    if (index === current) return;
    current = index;
    isAnimating = true;
    wheelAccum = 0;
    applyTransform();
    updateDots();
    clearTimeout(unlockTimer);
    var duration = prefersReducedMotion ? 0 : 1150;
    unlockTimer = setTimeout(function () {
      isAnimating = false;
    }, duration);
  }

  var WHEEL_THRESHOLD = 90;
  var WHEEL_GESTURE_GAP_MS = 160;
  var wheelAccum = 0;
  var lastWheelAt = 0;

  function onWheel(e) {
    e.preventDefault();
    if (isAnimating) return;

    var now = Date.now();
    if (now - lastWheelAt > WHEEL_GESTURE_GAP_MS) {
      wheelAccum = 0;
    }
    lastWheelAt = now;
    wheelAccum += e.deltaY;

    if (wheelAccum > WHEEL_THRESHOLD) {
      goTo(current + 1);
    } else if (wheelAccum < -WHEEL_THRESHOLD) {
      goTo(current - 1);
    }
  }

  function onKeydown(e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (isAnimating) return;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      goTo(current + 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      goTo(current - 1);
    }
  }

  var touchStartX = null;
  var touchStartY = null;
  var touchDirection = null;
  var pageAtTouchStart = 0;
  var isPullToRefreshGesture = false;

  function onTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchDirection = null;
    pageAtTouchStart = current;
    isPullToRefreshGesture = false;
  }

  function onTouchMove(e) {
    if (touchStartY === null) return;
    var t = e.touches[0];
    var dx = t.clientX - touchStartX;
    var dy = t.clientY - touchStartY;

    if (touchDirection === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      touchDirection = Math.abs(dy) > Math.abs(dx) ? "vertical" : "horizontal";
      if (touchDirection === "vertical") {
        isPullToRefreshGesture = pageAtTouchStart === 0 && dy > 0;
      }
    }

    if (touchDirection === "vertical" && !isPullToRefreshGesture && e.cancelable) {
      e.preventDefault();
    }
  }

  function onTouchEnd(e) {
    var direction = touchDirection;
    var startY = touchStartY;
    var wasRefreshGesture = isPullToRefreshGesture;
    touchStartX = null;
    touchStartY = null;
    touchDirection = null;
    isPullToRefreshGesture = false;

    if (
      startY === null ||
      isAnimating ||
      direction !== "vertical" ||
      wasRefreshGesture
    )
      return;
    var dy = startY - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 60) return;
    if (dy > 0) goTo(current + 1);
    else goTo(current - 1);
  }

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("resize", function () {
    vh = window.innerHeight;
    applyTransform();
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1);
      var idx = pages.findIndex(function (el) {
        return el.id === id;
      });
      if (idx !== -1) {
        e.preventDefault();
        goTo(idx);
      }
    });
  });

  updateDots();
})();
