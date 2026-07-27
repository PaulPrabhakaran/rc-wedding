/* ============================================================
   Charles Samuel & Rupal Grace — website interaction
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1) Ambient falling leaves over every ".leaves" field --------------------
  function populateLeaves(field, count) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var leaf = document.createElement("span");
      leaf.className = "leaf";
      var size = 10 + Math.random() * 18;                  // 10–28px, random
      var drift = (Math.random() * 180 - 90).toFixed(0);   // -90 to +90px, gentle
      var spin = (240 + Math.random() * 300).toFixed(0);   // 240–540deg, soft tumble
      leaf.style.left = (Math.random() * 100).toFixed(2) + "%";
      leaf.style.width = size + "px";
      leaf.style.height = size + "px";
      leaf.style.setProperty("--drift", drift + "px");
      leaf.style.setProperty("--spin", spin + "deg");
      // reduced opacity so leaves never compete with the text
      leaf.style.setProperty("--leaf-opacity", (0.18 + Math.random() * 0.3).toFixed(2));
      leaf.style.animationDuration = (13 + Math.random() * 12).toFixed(1) + "s"; // 13–25s, slower
      leaf.style.animationDelay = "-" + (Math.random() * 20).toFixed(1) + "s";
      frag.appendChild(leaf);
    }
    field.appendChild(frag);
  }
  if (!reduceMotion) {
    document.querySelectorAll(".leaves").forEach(function (field) {
      populateLeaves(field, 14);
    });
  }

  // // 2) Mouse heart trail — small hearts spawn as the cursor moves, spaced
  // //    out with a gap rather than a solid trail. Real-mouse (hover-capable)
  // //    devices only, and skipped entirely under reduced motion.
  // var heartHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
  // if (!reduceMotion && heartHover) {
  //   var lastHeartX = null, lastHeartY = null;
  //   var HEART_GAP = 46;   // px the pointer must travel before the next heart spawns
  //   document.addEventListener("mousemove", function (e) {
  //     if (lastHeartX !== null) {
  //       var dx = e.clientX - lastHeartX, dy = e.clientY - lastHeartY;
  //       if ((dx * dx + dy * dy) < HEART_GAP * HEART_GAP) return;
  //     }
  //     lastHeartX = e.clientX;
  //     lastHeartY = e.clientY;

  //     var heart = document.createElement("span");
  //     heart.className = "mouse-heart";
  //     heart.textContent = "💞";
  //     heart.style.left = e.clientX + "px";
  //     heart.style.top = e.clientY + "px";
  //     heart.style.fontSize = (11 + Math.random() * 7).toFixed(0) + "px";
  //     heart.style.setProperty("--hx", (Math.random() * 26 - 13).toFixed(0) + "px");
  //     document.body.appendChild(heart);
  //     heart.addEventListener("animationend", function () {
  //       if (heart.parentNode) heart.parentNode.removeChild(heart);
  //     });
  //   }, { passive: true });
  // }

  // 3) Intro — lace V-flap wax-seal envelope opener ------------------------
  var body = document.body;
  var intro = document.getElementById("intro");
  var waxSeal = document.getElementById("seal");
  var hero = document.getElementById("hero");
  var bgMusic = document.getElementById("bgMusic");
  var envEl = document.getElementById("env");
  var envLoader = document.getElementById("envLoader");

  // The envelope's images are large; on a first, cold-cache visit they can
  // otherwise paint in visibly row-by-row as they stream over the network.
  // Keep the whole envelope invisible (see .env in styles.css) until every
  // one of them has actually finished loading, then reveal it as one
  // complete image. A short safety timeout still reveals it regardless in
  // case an image fails outright, so a broken asset can never leave the
  // envelope permanently blank. #envLoader shows a spinner on the
  // placeholder veil for that same wait, so a slow load reads as "loading"
  // rather than a screen stuck on a flat colour.
  if (envEl) {
    var envAssets = ["assets/envelopBottom.png", "assets/envelopTop.png", "assets/envelopSeal.png"];
    var remaining = envAssets.length;
    var revealed = false;
    function revealEnv() {
      if (revealed) return;
      revealed = true;
      envEl.classList.add("ready");
      if (envLoader) envLoader.classList.add("done");
    }
    envAssets.forEach(function (src) {
      var img = new Image();
      img.onload = img.onerror = function () {
        remaining -= 1;
        if (remaining <= 0) revealEnv();
      };
      img.src = src;
    });
    window.setTimeout(revealEnv, 4000);
  }

  function startHeroReveal() {
    if (hero) hero.classList.add("reveal-ready");
  }

  // Sequence: brief press → flaps rotate open (intact seal rides the top
  // flap) → reveal the site the moment they finish. No break, no pause.
  // Each stage only toggles a class; all motion is CSS transform/opacity.
  var opened = false;
  function openInvite() {
    if (opened || !intro || !waxSeal) return;
    opened = true;

    // start the background music right on this tap — it's a genuine user
    // gesture, so autoplay-blocking browsers allow it; .catch swallows the
    // rare case where playback still gets refused (e.g. no audio file)
    if (bgMusic) {
      bgMusic.volume = 0.5;
      bgMusic.play().catch(function () { });
    }

    if (reduceMotion) {
      intro.classList.add("opening");
      window.setTimeout(function () {
        intro.classList.add("dismissed");
        body.classList.remove("locked");
        startHeroReveal();
      }, 360);
      return;
    }

    // Step 1 — a quick press on the intact seal
    waxSeal.classList.add("pressing");

    // Step 2 — the flap cracks open a small amount in 3D (1.6s, a bit
    // slower/more deliberate than a quick snap). The envelope's back panel
    // (env-base) never moves at all, at any point.
    window.setTimeout(function () {
      waxSeal.classList.remove("pressing");
      intro.classList.add("opening");
      body.classList.remove("locked");
    }, 160);

    // Step 3 — start fading the whole overlay away (flap + still-static
    // base) slightly BEFORE the flap's own lift finishes, so the fade
    // overlaps its tail motion instead of waiting for the flap to first
    // glide to a complete stop and only then begin fading — that dead
    // stop-then-fade handoff was reading as a stutter/pause. Overlapping
    // them means the flap is still visibly lifting as it dissolves into
    // the hero, so the reveal reads as one continuous motion.
    window.setTimeout(function () {
      intro.classList.add("dismissed");
      startHeroReveal();
    }, 160 + 1600 - 300);
  }

  if (waxSeal) {
    waxSeal.addEventListener("click", openInvite);
    waxSeal.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvite(); }
    });
  }

  // deep-link: skip the opener when the URL includes #invitation or #open
  var hash = window.location.hash;
  if (hash.indexOf("open") !== -1 || hash.indexOf("invitation") !== -1) {
    if (intro) intro.classList.add("dismissed");
    body.classList.remove("locked");
    startHeroReveal();
  }

  // 4) Reveal content when it scrolls into view -----------------------------
  //    Observe the CONTENT boxes (not the full-height sections) so each group
  //    animates as it actually enters the viewport, then only once.
  var revealTargets = document.querySelectorAll(".welcome-inner, .invitation");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -12% 0px" });
    revealTargets.forEach(function (t) { io.observe(t); });
  } else {
    revealTargets.forEach(function (t) { t.classList.add("in-view"); });
  }

  // 5) Per-element reveal (timeline items, headings) ------------------------
  var revealUps = document.querySelectorAll(".reveal-up");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
    revealUps.forEach(function (el) { io2.observe(el); });
  } else {
    revealUps.forEach(function (el) { el.classList.add("is-in"); });
  }

  // 6) venue: run the route-line + ambient animations only while it is on screen
  var venueEl = document.getElementById("venue");
  if (venueEl && "IntersectionObserver" in window && !reduceMotion) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { venueEl.classList.toggle("atmos-live", e.isIntersecting); });
    }, { threshold: 0 }).observe(venueEl);
  }

  // venue: gentle floating pearls
  var vAmbient = document.getElementById("vAmbient");
  if (vAmbient && !reduceMotion) {
    var vFrag = document.createDocumentFragment();
    for (var vp = 0; vp < 8; vp++) {
      var pr = document.createElement("span");
      pr.className = "v-pearl-f";
      var vs = (4 + Math.random() * 7).toFixed(0);
      pr.style.width = vs + "px";
      pr.style.height = vs + "px";
      pr.style.left = (Math.random() * 100).toFixed(1) + "%";
      pr.style.top = (60 + Math.random() * 45).toFixed(1) + "%";
      pr.style.setProperty("--fdx", (Math.random() * 60 - 30).toFixed(0) + "px");
      pr.style.setProperty("--fmax", (0.22 + Math.random() * 0.26).toFixed(2));
      pr.style.setProperty("--fdur", (12 + Math.random() * 10).toFixed(1) + "s");
      pr.style.setProperty("--fdelay", (Math.random() * 10).toFixed(1) + "s");
      vFrag.appendChild(pr);
    }
    vAmbient.appendChild(vFrag);
  }

  // 7) Finale — live countdown, ambient, scroll-to-top ----------------------
  var cdDays = document.getElementById("cdDays");
  if (cdDays) {
    var cdHours = document.getElementById("cdHours");
    var cdMins = document.getElementById("cdMins");
    var cdSecs = document.getElementById("cdSecs");
    var target = new Date(2026, 7, 21, 16, 30, 0).getTime();  // 21 Aug 2026, 4:30 PM
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var tick = function () {
      var diff = Math.max(0, target - Date.now());
      var s = Math.floor(diff / 1000);
      cdDays.textContent = pad(Math.floor(s / 86400));
      cdHours.textContent = pad(Math.floor((s % 86400) / 3600));
      cdMins.textContent = pad(Math.floor((s % 3600) / 60));
      cdSecs.textContent = pad(s % 60);
    };
    tick();
    window.setInterval(tick, 1000);
  }

  // finale: run float/glow/rings only while on screen
  var finaleEl = document.getElementById("finale");
  if (finaleEl && "IntersectionObserver" in window && !reduceMotion) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { finaleEl.classList.toggle("atmos-live", e.isIntersecting); });
    }, { threshold: 0 }).observe(finaleEl);
  }

  // finale: floating ambient pearls
  var finAmbient = document.getElementById("finAmbient");
  if (finAmbient && !reduceMotion) {
    var fFrag = document.createDocumentFragment();
    for (var fp = 0; fp < 9; fp++) {
      var fpr = document.createElement("span");
      fpr.className = "fin-pearl";
      var fs = (4 + Math.random() * 8).toFixed(0);
      fpr.style.width = fs + "px";
      fpr.style.height = fs + "px";
      fpr.style.left = (Math.random() * 100).toFixed(1) + "%";
      fpr.style.top = (60 + Math.random() * 45).toFixed(1) + "%";
      fpr.style.setProperty("--fdx", (Math.random() * 70 - 35).toFixed(0) + "px");
      fpr.style.setProperty("--fmax", (0.22 + Math.random() * 0.28).toFixed(2));
      fpr.style.setProperty("--fdur", (12 + Math.random() * 10).toFixed(1) + "s");
      fpr.style.setProperty("--fdelay", (Math.random() * 10).toFixed(1) + "s");
      fFrag.appendChild(fpr);
    }
    finAmbient.appendChild(fFrag);
  }

  // background-music toggle — reflects whatever state bgMusic is actually
  // in (it may have been blocked from autoplaying even after the seal tap
  // on some browsers, so this doesn't just assume it's playing)
  var musicToggle = document.getElementById("musicToggle");
  if (musicToggle && bgMusic) {
    musicToggle.addEventListener("click", function () {
      if (bgMusic.paused) {
        bgMusic.play().catch(function () { });
      } else {
        bgMusic.pause();
      }
    });
    var syncMusicToggle = function () {
      var playing = !bgMusic.paused;
      musicToggle.classList.toggle("muted", !playing);
      musicToggle.setAttribute("aria-pressed", String(playing));
      musicToggle.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
    };
    bgMusic.addEventListener("play", syncMusicToggle);
    bgMusic.addEventListener("pause", syncMusicToggle);
    syncMusicToggle();
  }

  // scroll-to-top button: appears once the hero has scrolled away
  var scrollTopBtn = document.getElementById("scrollTop");
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    var heroSec = document.getElementById("hero");
    if (heroSec && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { scrollTopBtn.classList.toggle("show", !e.isIntersecting); });
      }, { threshold: 0 }).observe(heroSec);
    } else {
      scrollTopBtn.classList.add("show");
    }
  }

})();
