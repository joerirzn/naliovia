const heroVideo = document.querySelector(".hero-video");
if (heroVideo) {
  const tryPlayHeroVideo = () => heroVideo.play().catch(() => {});
  tryPlayHeroVideo();
  document.addEventListener("touchstart", tryPlayHeroVideo, { once: true });
  document.addEventListener("click", tryPlayHeroVideo, { once: true });
}

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".work-card:not(.work-card--locked)").forEach((card) => {
  const magnitude = 0.75 + Math.random() * 1.25;
  const sign = Math.random() < 0.5 ? -1 : 1;
  card.style.setProperty("--hover-rotate", `${(magnitude * sign).toFixed(2)}deg`);
});

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  backToTop.classList.toggle("visible", window.scrollY > scrollableHeight * 0.6);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const proximityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-active", entry.isIntersecting);
      });
    },
    { rootMargin: "-35% 0px -35% 0px" }
  );

  document.querySelectorAll(".work-card, .about-photo").forEach((el) => proximityObserver.observe(el));
}

const videoModal = document.getElementById("videoModal");
const videoPlayer = document.getElementById("videoPlayer");
const videoEmbed = document.getElementById("videoEmbed");
const videoLoading = document.getElementById("videoLoading");
const videoEmptyMessage = videoModal.querySelector(".video-modal-empty");
const videoTag = videoModal.querySelector(".video-modal-tag");
const videoTitle = videoModal.querySelector(".video-modal-title");
const videoDescription = videoModal.querySelector(".video-modal-description");
const videoCredit = videoModal.querySelector(".video-modal-credit");

function getEmbedUrl(link) {
  const url = new URL(link);

  if (url.hostname.includes("youtu.be")) {
    return `https://www.youtube.com/embed/${url.pathname.slice(1)}?autoplay=1`;
  }
  if (url.hostname.includes("youtube.com")) {
    const id = url.searchParams.get("v") || url.pathname.split("/").pop();
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  if (url.hostname.includes("instagram.com")) {
    const match = url.pathname.match(/\/reel\/([^/]+)/);
    return `https://www.instagram.com/reel/${match ? match[1] : ""}/embed`;
  }
  return link;
}

function openVideoModal(card) {
  const src = card.dataset.video;
  const link = card.dataset.link;

  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.hidden = true;
  videoEmbed.src = "";
  videoEmbed.hidden = true;
  videoEmptyMessage.hidden = true;

  videoLoading.hidden = true;

  if (link) {
    videoEmbed.src = getEmbedUrl(link);
    videoEmbed.hidden = false;
  } else if (src) {
    videoPlayer.src = src;
    videoPlayer.hidden = false;
    videoLoading.hidden = false;
    videoPlayer.play();
  } else {
    videoEmptyMessage.hidden = false;
  }

  videoTag.textContent = card.querySelector(".tag").textContent;
  videoTitle.textContent = card.querySelector("h3").textContent;
  videoDescription.textContent = card.dataset.description;
  videoCredit.textContent = card.dataset.credit;

  videoModal.classList.add("open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeVideoModal() {
  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();
  videoEmbed.src = "";
  videoEmbed.hidden = true;
  videoLoading.hidden = true;
  videoModal.classList.remove("open");
  videoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

videoPlayer.addEventListener("waiting", () => {
  videoLoading.hidden = false;
});

videoPlayer.addEventListener("playing", () => {
  videoLoading.hidden = true;
});

videoPlayer.addEventListener("canplay", () => {
  videoLoading.hidden = true;
});

document.querySelectorAll(".work-thumb").forEach((thumb) => {
  const card = thumb.closest(".work-card");
  if (card.classList.contains("work-card--locked")) return;

  thumb.addEventListener("click", () => {
    openVideoModal(card);
  });
});

videoModal.querySelectorAll("[data-video-modal-close]").forEach((el) => {
  el.addEventListener("click", closeVideoModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeVideoModal();
});
