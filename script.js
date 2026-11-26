const salon = window.SALON;
const themeToggle = document.querySelector("[data-theme-toggle]");

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("salon-theme");
} catch {}

if (savedTheme === "dark") {
  document.body.dataset.theme = "dark";
}

if (themeToggle) {
  const renderThemeButton = () => {
    const dark = document.body.dataset.theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
    themeToggle.innerHTML = dark
      ? '<svg class="theme-icon sun-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
      : '<svg class="theme-icon moon-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z"/></svg>';
  };

  renderThemeButton();

  themeToggle.addEventListener("click", () => {
    const dark = document.body.dataset.theme !== "dark";
    document.body.dataset.theme = dark ? "dark" : "light";

    if (!dark) delete document.body.dataset.theme;

    try {
      localStorage.setItem("salon-theme", dark ? "dark" : "light");
    } catch {}

    renderThemeButton();
  });
}

const moneyDigits = salon.whatsapp.replace(/\D/g, "");

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.href = `https://wa.me/${moneyDigits}?text=${encodeURIComponent("Olá, gostaria de saber mais sobre os serviços do Studio Janete Souza.")}`;
});

document.querySelectorAll("[data-phone]").forEach(el => {
  el.textContent = salon.phoneDisplay;
});

document.querySelectorAll("[data-phone-link]").forEach(link => {
  link.href = `https://wa.me/${moneyDigits}`;
});

document.querySelectorAll("[data-instagram]").forEach(el => {
  el.textContent = `@${salon.instagramHandle}`;
});

document.querySelectorAll("[data-instagram-link]").forEach(link => {
  link.href = salon.instagramUrl;
});

document.querySelectorAll("[data-address-link]").forEach(link => {
  link.href = salon.addressUrl;
});

document.querySelectorAll("[data-waze-link]").forEach(link => {
  link.href = salon.wazeUrl;
});

document.querySelectorAll("[data-review-link]").forEach(link => {
  link.href = salon.reviewUrl;
});

const mapFrame = document.querySelector("[data-map-frame]");
if (mapFrame) mapFrame.src = salon.mapsEmbedUrl;

const tabs = document.querySelector("#category-tabs");

salon.gallery.forEach((item, index) => {
  const card = document.createElement("article");
  card.className = `gallery-card gallery-card-${index + 1} reveal`;
  card.innerHTML = `<img class="gallery-photo" src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async">`;
  gallery.append(card);
});

const tabs = document.querySelector("#category-tabs");
const list = document.querySelector("#service-list");

function showCategory(index) {
  [...tabs.children].forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
    tab.setAttribute("aria-selected", i === index);
  });

  const category = salon.categories[index];

  list.innerHTML =
    `<div class="list-intro reveal"><span>${category.note}</span><span>${String(category.services.length).padStart(2,"0")} serviços</span></div>` +
    category.services.map(([name, price], i) =>
      `<div class="service-row reveal" style="--reveal-delay:${Math.min(i * 45, 360)}ms"><span class="service-number">${String(i + 1).padStart(2,"0")}</span><strong>${name}</strong><span class="service-dots"></span><span class="service-price">${price}</span></div>`
    ).join("");

  observeReveals(list.querySelectorAll(".reveal"));
}

salon.categories.forEach((category, index) => {
  const button = document.createElement("button");
  button.className = "category-tab";
  button.setAttribute("role", "tab");
  button.setAttribute("aria-selected", "false");
  button.innerHTML = `<span>0${index + 1}</span>${category.name}<b>↗</b>`;
  button.addEventListener("click", () => showCategory(index));
  tabs.append(button);
});

showCategory(0);

const revealTargets = document.querySelectorAll(
  ".hero-copy, .hero-art, .intro .section-kicker, .intro h2, .intro > p, .section-heading, .services-heading, .category-tabs, .price-note, .visit-copy, .visit-card, footer"
);

revealTargets.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${(index % 3) * 80}ms`);
});

function observeReveals(elements) {
  const targets = [...elements].filter(element => !element.classList.contains("reveal-ready"));

  if (!targets.length) return;

  targets.forEach(element => element.classList.add("reveal-ready"));

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    targets.forEach(element => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

  targets.forEach(element => observer.observe(element));
}

observeReveals(document.querySelectorAll(".reveal"));
