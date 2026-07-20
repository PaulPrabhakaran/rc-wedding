/* ============================================================
   Charles Samuel & Rupal Grace — website interaction
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1) Clone the lace floral template into both corner slots ----------------
  var laceTpl = document.getElementById("laceTemplate");
  if (laceTpl) {
    document.querySelectorAll(".lace-slot").forEach(function (slot) {
      slot.appendChild(laceTpl.content.cloneNode(true));
    });
  }

  // 2) Ambient falling leaves over every ".leaves" field --------------------
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

  // 3) Intro — royal envelope opener ----------------------------------------
  var body = document.body;
  var intro = document.getElementById("intro");
  var invite = document.getElementById("invite");     // ← add this
  var waxSeal = document.getElementById("seal");      // ← was "waxSeal", your button's real id is "seal"
  var envParticles = document.getElementById("envParticles");
  var hero = document.getElementById("hero");

  // golden dust / sparkles released as the envelope opens
  if (envParticles && !reduceMotion) {
    var epFrag = document.createDocumentFragment();
    for (var ep = 0; ep < 16; ep++) {
      var epd = document.createElement("span");
      epd.className = "env-p";
      var eps = (4 + Math.random() * 7).toFixed(0);
      epd.style.width = eps + "px";
      epd.style.height = eps + "px";
      epd.style.left = (25 + Math.random() * 50).toFixed(1) + "%";
      epd.style.top = (40 + Math.random() * 30).toFixed(1) + "%";
      epd.style.setProperty("--pdx", (Math.random() * 120 - 60).toFixed(0) + "px");
      epd.style.setProperty("--pdur", (3 + Math.random() * 2.6).toFixed(1) + "s");
      epd.style.setProperty("--pdelay", (Math.random() * 2).toFixed(1) + "s");
      epFrag.appendChild(epd);
    }
    envParticles.appendChild(epFrag);
  }

  function startHeroReveal() {
    if (hero) hero.classList.add("reveal-ready");
  }

  var envOpened = false;
  function openEnvelope() {
    if (envOpened || !intro) return;
    envOpened = true;
    invite.classList.add("open");     // ← was intro.classList.add("opening")

    // after the full cinematic sequence, dissolve the overlay + reveal the site
    var settle = reduceMotion ? 400 : 1700;   // your doors/seal CSS transitions run ~1.5s, not 3.7s
    window.setTimeout(function () {
      intro.classList.add("dismissed");
      body.classList.remove("locked");
      startHeroReveal();
    }, settle);
  }

  if (waxSeal) {
    waxSeal.addEventListener("click", openEnvelope);
    waxSeal.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
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

  // 6a) Grow the timeline line once it scrolls into view --------------------
  var timeline = document.querySelector(".timeline");
  if (timeline) {
    if ("IntersectionObserver" in window) {
      var lineIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("lit");
            lineIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      lineIO.observe(timeline);
    } else {
      timeline.classList.add("lit");
    }
  }

  // 6b) Highlight the timeline card crossing the viewport centre (story focus)
  if ("IntersectionObserver" in window && !reduceMotion) {
    var activeIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("active", entry.isIntersecting);
      });
    }, { rootMargin: "-42% 0px -42% 0px", threshold: 0 });
    document.querySelectorAll(".tl-item").forEach(function (it) { activeIO.observe(it); });
  }

  // 7) Timeline cards: tap-to-flip on touch / non-hover devices -------------
  //    (desktop keeps the CSS :hover flip). One 360° spin per tap, then back.
  var hoverCapable = window.matchMedia && window.matchMedia("(hover: hover)").matches;
  if (!reduceMotion && !hoverCapable) {
    document.querySelectorAll(".tl-card").forEach(function (card) {
      var inner = card.querySelector(".tl-card-inner");
      if (!inner) return;
      card.addEventListener("click", function () {
        if (inner.classList.contains("flipping")) return;   // ignore taps mid-spin
        inner.classList.add("flipping");
      });
      inner.addEventListener("animationend", function () {
        inner.classList.remove("flipping");                 // restore default front
      });
    });
  }

  // 8) Gallery — floating memory orbs, tilt/ripple, lightbox, Three.js depth
  var gallery = document.getElementById("gallery");
  var galleryInner = document.getElementById("galleryInner");
  var orbsField = document.getElementById("orbsField");
  var orbs = orbsField ? Array.prototype.slice.call(orbsField.querySelectorAll(".orb")) : [];
  var hoverCap = window.matchMedia && window.matchMedia("(hover: hover)").matches;

  // run float/ring animations only while the gallery is on screen
  if (gallery && "IntersectionObserver" in window && !reduceMotion) {
    var atmosIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { gallery.classList.toggle("atmos-live", e.isIntersecting); });
    }, { threshold: 0 });
    atmosIO.observe(gallery);
  } else if (gallery) {
    gallery.classList.add("atmos-live");
  }

  // venue: run the route-line + ambient animations only while it is on screen
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

  // 9) Finale — live countdown, ambient, scroll-to-top ----------------------
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

  // reveal header, then the orbs
  var galleryRevealed = false;
  function revealGallery() {
    if (galleryRevealed) return;
    galleryRevealed = true;
    if (galleryInner) galleryInner.classList.add("revealed");
    window.setTimeout(function () { if (orbsField) orbsField.classList.add("revealed"); }, reduceMotion ? 40 : 450);
  }
  if (gallery) {
    if ("IntersectionObserver" in window) {
      var gIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { revealGallery(); gIO.unobserve(e.target); } });
      }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
      gIO.observe(gallery);
    } else {
      revealGallery();
    }
  }

  // cursor tilt (desktop) — gently rotate each orb toward the pointer
  if (hoverCap && !reduceMotion) {
    orbs.forEach(function (orb) {
      var tilt = orb.querySelector(".orb-tilt");
      if (!tilt) return;
      orb.addEventListener("pointermove", function (ev) {
        var r = orb.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
        var py = (ev.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--ry", (px * 16).toFixed(1) + "deg");
        tilt.style.setProperty("--rx", (-py * 16).toFixed(1) + "deg");
      });
      orb.addEventListener("pointerleave", function () {
        tilt.style.setProperty("--ry", "0deg");
        tilt.style.setProperty("--rx", "0deg");
      });
    });
  }

  // fullscreen lightbox viewer
  var lb = document.getElementById("lightbox");
  if (lb && orbs.length) {
    var lbImg = document.getElementById("lbImg");
    var lbCount = document.getElementById("lbCount");
    var idx = 0;

    function orbImgSrc(i) {
      var im = orbs[i].querySelector("img");
      return im ? im.getAttribute("src") : "";
    }
    function showAt(i) {
      idx = (i + orbs.length) % orbs.length;
      // use a larger version for the fullscreen view
      lbImg.src = orbImgSrc(idx).replace(/w=\d+/, "w=1400");
      var im = orbs[idx].querySelector("img");
      lbImg.alt = im ? (im.alt || "") : "";
      if (lbCount) lbCount.textContent = (idx + 1) + " / " + orbs.length;
    }
    function openLb(i) {
      showAt(i);
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
    }
    function closeLb() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    }

    orbs.forEach(function (orb, i) {
      orb.addEventListener("click", function () {
        if (!hoverCap) {   // mobile: soft ripple, then open
          var ripple = document.createElement("span");
          ripple.className = "orb-ripple";
          orb.appendChild(ripple);
          ripple.addEventListener("animationend", function () {
            if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
          });
          window.setTimeout(function () { openLb(i); }, 160);
        } else {
          openLb(i);
        }
      });
    });
    document.getElementById("lbClose").addEventListener("click", closeLb);
    document.getElementById("lbPrev").addEventListener("click", function () { showAt(idx - 1); });
    document.getElementById("lbNext").addEventListener("click", function () { showAt(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") showAt(idx - 1);
      else if (e.key === "ArrowRight") showAt(idx + 1);
    });

    // swipe: horizontal to navigate, downward to close
    var sx = 0, sy = 0;
    lb.addEventListener("touchstart", function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) showAt(idx + (dx < 0 ? 1 : -1));
      else if (dy > 70 && Math.abs(dy) > Math.abs(dx)) closeLb();
    }, { passive: true });
  }

  // ---- Three.js depth layer (optional, lightweight, viewport-gated) ----
  function initGalleryThree() {
    var canvas = document.getElementById("galleryThree");
    if (!canvas || !gallery || reduceMotion || !window.THREE) return;

    var THREE = window.THREE;
    var w = gallery.clientWidth, h = gallery.clientHeight;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(w, h, false);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 14;

    var group = new THREE.Group();
    scene.add(group);

    // a few translucent glass rings
    var ringMat = new THREE.MeshBasicMaterial({ color: 0xc9a86a, transparent: true, opacity: 0.28 });
    var ringMat2 = new THREE.MeshBasicMaterial({ color: 0xc9a2b6, transparent: true, opacity: 0.22 });
    var rings = [];
    for (var r = 0; r < 4; r++) {
      var geo = new THREE.TorusGeometry(3 + r * 1.6, 0.05, 8, 90);
      var m = new THREE.Mesh(geo, r % 2 ? ringMat2 : ringMat);
      m.position.set((r - 1.5) * 3, (r % 2 ? 1 : -1) * 2, -r * 2);
      m.rotation.x = Math.random() * Math.PI;
      m.rotation.y = Math.random() * Math.PI;
      group.add(m);
      rings.push(m);
    }

    // soft floating particles with depth
    var pGeo = new THREE.BufferGeometry();
    var COUNT = 70, pos = new Float32Array(COUNT * 3);
    for (var i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var pMat = new THREE.PointsMaterial({ color: 0xffe9c2, size: 0.12, transparent: true, opacity: 0.7, depthWrite: false });
    var points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    var mx = 0, my = 0, tmx = 0, tmy = 0, visible = false, raf = 0;
    window.addEventListener("pointermove", function (e) {
      tmx = (e.clientX / window.innerWidth - 0.5);
      tmy = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });

    function resize() {
      w = gallery.clientWidth; h = gallery.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);

    function render() {
      raf = 0;
      if (!visible) return;                 // paused when off-screen
      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;   // eased parallax
      group.rotation.y += 0.0016;
      group.rotation.x = my * 0.3;
      group.position.x = mx * 1.6;
      points.rotation.y += 0.0006;
      camera.position.x = mx * 1.2;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          visible = e.isIntersecting;
          if (visible && !raf) raf = requestAnimationFrame(render);
        });
      }, { threshold: 0 }).observe(gallery);
    } else {
      visible = true; raf = requestAnimationFrame(render);
    }
  }
  // Three.js is loaded with `defer`, so init once everything is ready
  if (document.readyState === "complete") initGalleryThree();
  else window.addEventListener("load", initGalleryThree);
})();
