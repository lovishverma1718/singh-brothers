(function () {
  var body = document.body;
  var header = document.querySelector(".site-header");

  // Header state on scroll
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () { body.classList.remove("menu-open"); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") body.classList.remove("menu-open");
    });
  }

  // Hide images that fail to load; the .media container shows a styled fallback
  document.querySelectorAll(".media img").forEach(function (img) {
    function broken() { img.classList.add("is-broken"); }
    if (img.complete && img.naturalWidth === 0) broken();
    img.addEventListener("error", broken);
  });

  // Scroll reveal
  var items = document.querySelectorAll(".reveal, .reveal-img");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Floating image preview on the services index (desktop pointer only)
  var preview = document.querySelector(".svc-preview");
  if (preview && window.matchMedia("(hover: hover)").matches) {
    var pImg = preview.querySelector("img");
    var x = 0, y = 0, cx = 0, cy = 0, raf;
    function loop() {
      cx += (x - cx) * 0.14; cy += (y - cy) * 0.14;
      preview.style.left = cx + "px"; preview.style.top = cy + "px";
      raf = requestAnimationFrame(loop);
    }
    document.querySelectorAll(".svc-index a").forEach(function (a) {
      a.addEventListener("mouseenter", function (e) {
        pImg.classList.remove("is-broken");
        pImg.src = a.dataset.img;
        x = cx = e.clientX; y = cy = e.clientY;
        preview.classList.add("is-on");
        cancelAnimationFrame(raf); loop();
      });
      a.addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; });
      a.addEventListener("mouseleave", function () {
        preview.classList.remove("is-on"); cancelAnimationFrame(raf);
      });
    });
  }

  // Services page: highlight the section in view
  var svcLinks = document.querySelectorAll(".svc-nav a");
  if (svcLinks.length && "IntersectionObserver" in window) {
    var map = {};
    svcLinks.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          svcLinks.forEach(function (l) { l.classList.remove("is-active"); });
          if (map[en.target.id]) map[en.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll(".svc-block").forEach(function (s) { so.observe(s); });
  }

  // Contact form: opens the visitor's email app with the request filled in
  var form = document.querySelector("#quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var services = d.getAll("service").join(", ") || "Not specified";
      var lines = [
        "Name: " + (d.get("name") || ""),
        "Phone: " + (d.get("phone") || ""),
        "Email: " + (d.get("email") || ""),
        "Project location: " + (d.get("location") || ""),
        "Project type: " + (d.get("type") || ""),
        "Services: " + services,
        "",
        d.get("message") || ""
      ];
      var subject = "Quote request — " + (d.get("name") || "Website enquiry");
      window.location.href = "mailto:singhbrothers4832@gmail.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      var note = document.querySelector(".form-note");
      if (note) note.textContent = "Your email app should open with your request ready to send. If it doesn't, call or text 780-707-4832.";
    });
  }

  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
