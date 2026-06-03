/* global gsap, ScrollTrigger, Swiper */

// Configuration generale de l'experience.
const START_DATE = "2023-02-14T20:30:00";
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Repli local pour permettre l'ouverture directe de index.html sans serveur.
const FALLBACK_REASONS = [
  "J'aime la facon dont tu rends une journee normale beaucoup plus belle sans meme essayer.",
  "J'aime ton rire, surtout quand il arrive sans prevenir.",
  "J'aime le calme que je ressens quand je suis avec toi.",
  "J'aime ta facon d'ecouter vraiment, sans faire semblant.",
  "J'aime la douceur que tu mets dans les petites choses.",
  "J'aime quand un simple message de toi peut changer toute ma journee.",
  "J'aime ta facon d'etre toi, sans jouer un role.",
  "J'aime le bien que tu fais autour de toi presque naturellement.",
  "J'aime nos discussions serieuses autant que nos moments ou on raconte n'importe quoi.",
  "J'aime la confiance que je ressens quand je te parle.",
  "J'aime la place que tu as prise dans ma vie sans bruit, mais pour de vrai.",
  "J'aime ta sensibilite, meme quand tu essaies de la cacher.",
  "J'aime ta force dans les moments compliques.",
  "J'aime la facon dont tu prends soin de ceux que tu aimes.",
  "J'aime quand tu me fais sentir a ma place, juste en etant la.",
  "J'aime nos habitudes, meme les plus simples.",
  "J'aime la personne que je suis quand je suis avec toi.",
  "J'aime ta facon de rassurer sans grands discours.",
  "J'aime notre complicite dans les details que personne ne remarque.",
  "J'aime l'idee de vivre encore plein de moments avec toi."
];

const state = {
  audioAllowed: false,
  audioEnabled: false,
  audioAutoplayAttempted: false,
  reasons: [],
  remainingReasons: [],
  reasonCount: 0,
  typingStarted: false,
  confettiBursts: []
};

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  initHeroText();
  initAmbientParticles();
  initSkyCanvas();
  initIntroTransition();
  initEnvelope();
  initMemoriesSwiper();
  initReasons();
  initBirthdayCake();
  initAudio();
  initGlobalRevealAnimations();
});

function initHeroText() {
  const lines = document.querySelectorAll(".hero-line");

  lines.forEach((line) => {
    const rawText = line.dataset.text || line.textContent || "";
    const chars = rawText.split("");
    const fragment = document.createDocumentFragment();

    chars.forEach((char) => {
      const span = document.createElement("span");
      span.className = char === " " ? "char space" : "char";
      span.textContent = char === " " ? "\u00A0" : char;
      fragment.appendChild(span);
    });

    line.innerHTML = "";
    line.appendChild(fragment);
  });

  if (REDUCED_MOTION) {
    gsap.set(".hero-line .char", { opacity: 1, y: 0, scale: 1 });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  lines.forEach((line, index) => {
    tl.to(
      line.querySelectorAll(".char"),
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.03
      },
      index === 0 ? 0.2 : "-=0.4"
    );
  });
}

function initAmbientParticles() {
  const particlesHost = document.getElementById("global-particles");
  const heartsHost = document.getElementById("floating-hearts");

  for (let index = 0; index < 24; index += 1) {
    const particle = document.createElement("span");
    const size = gsap.utils.random(4, 10, 1);
    particle.className = "particle";
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${gsap.utils.random(0, 100)}%`;
    particle.style.top = `${gsap.utils.random(0, 100)}%`;
    particlesHost.appendChild(particle);

    if (!REDUCED_MOTION) {
      gsap.to(particle, {
        y: `-=${gsap.utils.random(30, 80, 1)}`,
        x: `+=${gsap.utils.random(-30, 30, 1)}`,
        opacity: gsap.utils.random(0.2, 0.85, 0.05),
        repeat: -1,
        yoyo: true,
        duration: gsap.utils.random(4, 9, 0.1),
        ease: "sine.inOut",
        delay: index * 0.08
      });
    }
  }

  for (let index = 0; index < 14; index += 1) {
    const heart = document.createElement("i");
    heart.className = "floating-heart fa-solid fa-heart";
    heart.style.left = `${gsap.utils.random(5, 95)}%`;
    heart.style.top = `${gsap.utils.random(60, 100)}%`;
    heart.style.fontSize = `${gsap.utils.random(12, 28, 1)}px`;
    heartsHost.appendChild(heart);

    if (!REDUCED_MOTION) {
      gsap.to(heart, {
        y: -window.innerHeight * gsap.utils.random(0.4, 1.1, 0.01),
        x: gsap.utils.random(-60, 60, 1),
        rotate: gsap.utils.random(-20, 20, 1),
        opacity: 0.12,
        duration: gsap.utils.random(8, 16, 0.1),
        ease: "none",
        repeat: -1,
        delay: index * 0.7
      });
    }
  }
}

function initSkyCanvas() {
  const canvas = document.getElementById("sky-canvas");
  const context = canvas.getContext("2d");
  const stars = [];
  let animationFrameId = null;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const populateStars = () => {
    stars.length = 0;
    const count = Math.max(60, Math.floor(window.innerWidth / 14));
    for (let index = 0; index < count; index += 1) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.6 + 0.35,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.003
      });
    }
  };

  const render = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(16, 6, 33, 0.92)");
    gradient.addColorStop(1, "rgba(20, 8, 24, 0.78)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      star.alpha += star.speed;
      if (star.alpha >= 1 || star.alpha <= 0.15) {
        star.speed *= -1;
      }

      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      context.fill();
    });

    if (!REDUCED_MOTION) {
      animationFrameId = requestAnimationFrame(render);
    }
  };

  resizeCanvas();
  populateStars();
  render();

  window.addEventListener("resize", () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    resizeCanvas();
    populateStars();
    render();
  });
}

function initIntroTransition() {
  const enterButton = document.getElementById("enter-experience");
  const hero = document.getElementById("hero");
  const letterSection = document.getElementById("love-letter");

  enterButton.addEventListener("click", async () => {
    allowAudioFromUserGesture();

    if (REDUCED_MOTION) {
      letterSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const tl = gsap.timeline();
    tl.to(hero.querySelector(".glass-panel"), {
      scale: 0.95,
      y: -30,
      opacity: 0.2,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        letterSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.getElementById("letter-read-button").addEventListener("click", () => {
    document.getElementById("memories").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function initEnvelope() {
  const scene = document.getElementById("envelope-scene");
  const flap = scene.querySelector(".envelope-flap");
  const letter = scene.querySelector(".letter-paper");
  const seal = scene.querySelector(".seal");
  const glow = scene.querySelector(".envelope-glow");
  const typedLetter = document.getElementById("typed-letter");
  const fullText = typedLetter.dataset.fullText || "";

  const openEnvelope = () => {
    if (scene.dataset.opened === "true") {
      return;
    }

    scene.dataset.opened = "true";
    scene.classList.add("is-open");
    scene.setAttribute("aria-expanded", "true");
    allowAudioFromUserGesture();

    if (REDUCED_MOTION) {
      flap.style.transform = "rotateX(180deg)";
      letter.style.transform = "translateX(-50%) translateY(-14%)";
      glow.style.opacity = "1";
      startTypewriter(typedLetter, fullText);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => startTypewriter(typedLetter, fullText)
    });

    tl.to(seal, {
      scale: 0,
      opacity: 0,
      duration: 0.24,
      ease: "back.in"
    })
      .to(
        flap,
        {
          rotateX: 180,
          duration: 1,
          ease: "power3.inOut"
        },
        0
      )
      .to(
        glow,
        {
          scale: 1.25,
          opacity: 1,
          duration: 1,
          ease: "sine.out"
        },
        0.1
      )
      .to(
        letter,
        {
          yPercent: -48,
          duration: 1.15,
          ease: "power3.out"
        },
        0.25
      );
  };

  scene.addEventListener("click", openEnvelope);
  scene.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEnvelope();
    }
  });
}

function startTypewriter(container, text) {
  if (state.typingStarted) {
    return;
  }

  state.typingStarted = true;
  container.textContent = "";

  if (REDUCED_MOTION) {
    container.textContent = text;
    return;
  }

  let index = 0;
  const type = () => {
    container.textContent += text[index];
    index += 1;
    container.scrollTop = container.scrollHeight;

    if (index < text.length) {
      const char = text[index];
      const delay = char === "\n" ? 12 : 26;
      window.setTimeout(type, delay);
    }
  };

  type();
}

function initMemoriesSwiper() {
  const swiperElement = document.querySelector(".memories-swiper");
  const slides = document.querySelectorAll(".swiper-slide");

  const swiper = new Swiper(".memories-swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 1.1,
    spaceBetween: 16,
    autoplay: {
      delay: 3200,
      disableOnInteraction: false
    },
    coverflowEffect: {
      rotate: 10,
      stretch: 0,
      depth: 120,
      modifier: 1.15,
      scale: 0.9,
      slideShadows: false
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    breakpoints: {
      768: { slidesPerView: 1.5, spaceBetween: 24 },
      1024: { slidesPerView: 1.9, spaceBetween: 28 }
    },
    on: {
      init: () => animateSlidesIn(slides),
      slideChangeTransitionStart: () => animateActiveSlide(swiper.slides)
    }
  });

  animateSlidesIn(slides);

  ScrollTrigger.create({
    trigger: swiperElement,
    start: "top 70%",
    end: "bottom 20%",
    onEnter: () => fadeAudioIn(true, true),
    onEnterBack: () => fadeAudioIn(true, true),
    onLeave: () => fadeAudioOut(true),
    onLeaveBack: () => fadeAudioOut(true)
  });
}

function animateSlidesIn(slides) {
  if (REDUCED_MOTION) {
    gsap.set(slides, { opacity: 1, y: 0, scale: 1, rotate: 0 });
    return;
  }

  gsap.fromTo(
    slides,
    { opacity: 0, y: 50, scale: 0.9, rotate: -4 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out"
    }
  );
}

function animateActiveSlide(slides) {
  gsap.to(slides, {
    scale: 0.94,
    rotate: 0,
    duration: 0.45,
    ease: "power2.out"
  });

  const active = document.querySelector(".swiper-slide-active");
  if (!active) {
    return;
  }

  gsap.to(active, {
    scale: 1.02,
    rotate: 1.2,
    duration: 0.5,
    ease: "power2.out"
  });
}

async function initReasons() {
  state.reasons = await loadReasons();
  state.remainingReasons = shuffle([...state.reasons]);

  const button = document.getElementById("reason-button");
  const display = document.getElementById("reason-display");
  const progress = document.getElementById("reason-progress");

  button.addEventListener("click", () => {
    allowAudioFromUserGesture();

    if (state.remainingReasons.length === 0) {
      state.remainingReasons = shuffle([...state.reasons]);
    }

    const nextReason = state.remainingReasons.pop();
    state.reasonCount += 1;
    progress.textContent = `${state.reasonCount} raison${state.reasonCount > 1 ? "s" : ""} decouverte${state.reasonCount > 1 ? "s" : ""}`;

    display.innerHTML = `<p class="text-lg leading-8 text-white/90">${nextReason}</p>`;
    animateReason(display);
  });
}

async function loadReasons() {
  try {
    const response = await fetch("assets/data/reasons.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Requete refusee");
    }

    const json = await response.json();
    return Array.isArray(json) && json.length ? json : FALLBACK_REASONS;
  } catch (error) {
    return FALLBACK_REASONS;
  }
}

function animateReason(element) {
  const variants = [
    () =>
      gsap.fromTo(element, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }),
    () =>
      gsap.fromTo(element, { opacity: 0, scale: 0.84 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }),
    () =>
      gsap.fromTo(element, { opacity: 0, rotate: -3 }, { opacity: 1, rotate: 0, duration: 0.55, ease: "power2.out" }),
    () =>
      gsap.fromTo(element, { opacity: 0, rotationX: -90, transformOrigin: "top center" }, { opacity: 1, rotationX: 0, duration: 0.65, ease: "power3.out" })
  ];

  const animation = variants[Math.floor(Math.random() * variants.length)];
  animation();
}

function initBirthdayCake() {
  const cakeScene = document.getElementById("cake-scene");
  const candles = cakeScene.querySelectorAll(".cake-candle");
  const flames = cakeScene.querySelectorAll(".candle-flame");
  const blowButton = document.getElementById("blow-candles-button");
  const resetButton = document.getElementById("reset-cake-button");
  const message = document.getElementById("cake-message");
  const status = document.getElementById("cake-status");
  const overlay = document.getElementById("celebration-overlay");
  const fireworksCanvas = document.getElementById("celebration-fireworks");
  const particlesCanvas = document.getElementById("celebration-particles");
  const fireworksContext = fireworksCanvas?.getContext("2d");
  const particlesContext = particlesCanvas?.getContext("2d");
  const heartsHost = document.getElementById("celebration-hearts");
  const bubblesHost = document.getElementById("celebration-bubbles");
  const starsHost = document.getElementById("celebration-stars");
  const celebrationCenter = overlay?.querySelector(".celebration-center");
  const celebrationMessage = document.getElementById("celebration-message");
  let blown = false;
  let celebrationFrame = null;
  let overlayTimeout = null;
  let fireworksInterval = null;
  let heartsInterval = null;
  let bubblesInterval = null;
  let particlesInterval = null;

  const celebrationState = {
    confetti: [],
    sparkles: [],
    fireworks: []
  };

  if (celebrationMessage) {
    wrapCharacters(celebrationMessage);
  }

  if (starsHost) {
    populateCelebrationStars(starsHost);
  }

  const resizeCanvases = () => {
    resizeCanvasToViewport(fireworksCanvas, fireworksContext);
    resizeCanvasToViewport(particlesCanvas, particlesContext);
  };

  resizeCanvases();
  window.addEventListener("resize", resizeCanvases);

  const startCelebrationLoop = () => {
    if (REDUCED_MOTION || celebrationFrame || !fireworksContext || !particlesContext) {
      return;
    }

    const render = () => {
      renderCelebrationParticles(particlesContext, particlesCanvas, celebrationState);
      renderFireworks(fireworksContext, fireworksCanvas, celebrationState);
      celebrationFrame = requestAnimationFrame(render);
    };

    render();
  };

  const stopCelebrationLoop = () => {
    if (celebrationFrame) {
      cancelAnimationFrame(celebrationFrame);
      celebrationFrame = null;
    }

    celebrationState.confetti = [];
    celebrationState.sparkles = [];
    celebrationState.fireworks = [];

    if (fireworksContext && fireworksCanvas) {
      fireworksContext.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    }

    if (particlesContext && particlesCanvas) {
      particlesContext.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    }
  };

  const clearCelebrationTimers = () => {
    [overlayTimeout, fireworksInterval, heartsInterval, bubblesInterval, particlesInterval].forEach((timerId) => {
      if (timerId) {
        window.clearTimeout(timerId);
        window.clearInterval(timerId);
      }
    });

    overlayTimeout = null;
    fireworksInterval = null;
    heartsInterval = null;
    bubblesInterval = null;
    particlesInterval = null;
  };

  const getCakeOrigin = () => {
    const rect = cakeScene.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height * 0.28
    };
  };

  const clearCelebrationLayer = () => {
    if (heartsHost) {
      heartsHost.innerHTML = "";
    }

    if (bubblesHost) {
      bubblesHost.innerHTML = "";
    }
  };

  const hideCelebrationOverlay = () => {
    clearCelebrationTimers();

    if (!overlay) {
      return;
    }

    gsap.killTweensOf(celebrationCenter);
    overlay.classList.remove("is-active");
    overlay.setAttribute("aria-hidden", "true");
    clearCelebrationLayer();
    stopCelebrationLoop();
  };

  const runCelebrationMessage = () => {
    if (!celebrationCenter || !celebrationMessage) {
      return;
    }

    wrapCharacters(celebrationMessage);
    const chars = celebrationMessage.querySelectorAll(".char");

    gsap.set(celebrationCenter, { opacity: 1, scale: 0.78, y: 16 });

    const tl = gsap.timeline();
    tl.to(celebrationCenter, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.65,
      ease: "back.out(1.4)"
    }).to(
      chars,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.035,
        ease: "power3.out"
      },
      0.08
    ).to(
      celebrationMessage,
      {
        textShadow:
          "0 0 26px rgba(255,255,255,0.45), 0 0 56px rgba(255,77,141,0.45), 0 0 96px rgba(255,215,0,0.3)",
        duration: 1.2,
        repeat: 1,
        yoyo: true,
        ease: "sine.inOut"
      },
      0.2
    );
  };

  const startCelebration = () => {
    if (!overlay) {
      return;
    }

    const origin = getCakeOrigin();

    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");
    startCelebrationLoop();
    runCelebrationMessage();

    createHeartsBurst(heartsHost, origin, REDUCED_MOTION ? 10 : 18);
    createBubbleBurst(bubblesHost, origin, REDUCED_MOTION ? 8 : 14);
    addConfettiBurst(celebrationState, origin, REDUCED_MOTION ? 36 : 140);
    addSparkleBurst(celebrationState, origin, REDUCED_MOTION ? 18 : 70);
    addFireworkBurst(celebrationState, window.innerWidth * 0.28, window.innerHeight * 0.32);
    addFireworkBurst(celebrationState, window.innerWidth * 0.72, window.innerHeight * 0.27);

    if (!REDUCED_MOTION) {
      fireworksInterval = window.setInterval(() => {
        addFireworkBurst(
          celebrationState,
          gsap.utils.random(window.innerWidth * 0.18, window.innerWidth * 0.82, 1),
          gsap.utils.random(window.innerHeight * 0.14, window.innerHeight * 0.48, 1)
        );
      }, 820);

      heartsInterval = window.setInterval(() => {
        createHeartsBurst(heartsHost, getCakeOrigin(), 6);
      }, 680);

      bubblesInterval = window.setInterval(() => {
        createBubbleBurst(bubblesHost, getCakeOrigin(), 6);
      }, 920);

      particlesInterval = window.setInterval(() => {
        const nextOrigin = getCakeOrigin();
        addSparkleBurst(celebrationState, nextOrigin, 18);
        addConfettiBurst(celebrationState, nextOrigin, 32);
      }, 560);
    }

    overlayTimeout = window.setTimeout(() => {
      hideCelebrationOverlay();
    }, REDUCED_MOTION ? 4200 : 7600);
  };

  const updateCakeMessage = (title, body, toneClass = "text-goldLight") => {
    message.innerHTML = `
      <h3 class="font-display text-2xl ${toneClass}">${title}</h3>
      <p class="mt-4 text-base leading-8 text-white/85">
        ${body}
      </p>
    `;

    gsap.fromTo(
      message,
      { opacity: 0, y: 20, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
    );
  };

  const blowCandles = () => {
    if (blown) {
      return;
    }

    blown = true;
    cakeScene.setAttribute("aria-pressed", "true");
    status.textContent = "Les bougies sont eteintes.";
    blowButton.disabled = true;
    playBlowSound();

    if (REDUCED_MOTION) {
      flames.forEach((flame, index) => {
        flame.style.opacity = "0";
        createSmokePuffs(candles[index]);
      });
    } else {
      gsap.to(flames, {
        opacity: 0,
        scale: 0.15,
        y: -24,
        duration: 0.55,
        stagger: 0.12,
        ease: "power2.in"
      });

      candles.forEach((candle, index) => {
        window.setTimeout(() => createSmokePuffs(candle), 120 + index * 110);
      });

      gsap.fromTo(
        cakeScene,
        { y: 0, scale: 1 },
        {
          y: -8,
          scale: 1.03,
          duration: 0.32,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut"
        }
      );
    }

    updateCakeMessage(
      "Et maintenant...",
      "Regarde bien. J'avais envie que ce moment ressemble a une vraie fete rien que pour toi.",
      "text-roseSoft"
    );

    window.setTimeout(() => {
      startCelebration();
      updateCakeMessage(
        "Joyeux anniversaire, mon amour",
        "Je te souhaite une annee lumineuse, pleine de paix, de joie, de belles surprises et de moments ou tu te sentiras aimee exactement comme tu le merites.",
        "text-goldLight"
      );
      blowButton.disabled = false;
    }, REDUCED_MOTION ? 260 : 640);
  };

  const relightCandles = () => {
    blown = false;
    cakeScene.setAttribute("aria-pressed", "false");
    status.textContent = "Les bougies sont allumees.";
    blowButton.disabled = false;
    hideCelebrationOverlay();
    candles.forEach((candle) => {
      candle.querySelectorAll(".candle-smoke").forEach((smoke) => smoke.remove());
    });

    if (REDUCED_MOTION) {
      flames.forEach((flame) => {
        flame.style.opacity = "1";
        flame.style.transform = "translateX(-50%)";
      });
    } else {
      gsap.to(flames, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.05,
        ease: "back.out(1.5)"
      });
    }

    updateCakeMessage(
      "Prends un instant",
      "Souffle les bougies quand tu veux. Cette fois, j'ai prepare une vraie pluie de lumiere pour toi.",
      "text-roseSoft"
    );
  };

  blowButton.addEventListener("click", blowCandles);
  resetButton.addEventListener("click", relightCandles);
  cakeScene.addEventListener("click", blowCandles);
  cakeScene.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      blowCandles();
    }
  });
}

function resizeCanvasToViewport(canvas, context) {
  if (!canvas || !context) {
    return;
  }

  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function wrapCharacters(element) {
  const rawText = element.dataset.text || element.textContent || "";
  const fragment = document.createDocumentFragment();

  rawText.split("").forEach((char) => {
    const span = document.createElement("span");
    span.className = char === " " ? "char space" : "char";
    span.textContent = char === " " ? "\u00A0" : char;
    fragment.appendChild(span);
  });

  element.innerHTML = "";
  element.appendChild(fragment);
}

function populateCelebrationStars(host) {
  host.innerHTML = "";

  for (let index = 0; index < 26; index += 1) {
    const star = document.createElement("span");
    const size = gsap.utils.random(5, 12, 1);
    star.className = "celebration-star";
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${gsap.utils.random(3, 97)}%`;
    star.style.top = `${gsap.utils.random(5, 95)}%`;
    host.appendChild(star);

    if (!REDUCED_MOTION) {
      gsap.to(star, {
        opacity: gsap.utils.random(0.25, 0.95, 0.05),
        scale: gsap.utils.random(0.8, 1.5, 0.05),
        duration: gsap.utils.random(1.2, 2.6, 0.1),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.08
      });
    }
  }
}

function createSmokePuffs(candle) {
  if (!candle) {
    return;
  }

  for (let index = 0; index < 3; index += 1) {
    const smoke = document.createElement("span");
    smoke.className = "candle-smoke";
    candle.appendChild(smoke);

    gsap.fromTo(
      smoke,
      {
        opacity: 0.6,
        x: gsap.utils.random(-4, 4, 1),
        y: 0,
        scale: 0.45
      },
      {
        opacity: 0,
        x: gsap.utils.random(-14, 14, 1),
        y: -26 - index * 9,
        scale: 1.5 + index * 0.25,
        duration: 1.1 + index * 0.15,
        ease: "power1.out",
        delay: index * 0.08,
        onComplete: () => smoke.remove()
      }
    );
  }
}

function createHeartsBurst(host, origin, count) {
  if (!host) {
    return;
  }

  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement("i");
    heart.className = "celebration-heart fa-solid fa-heart";
    heart.style.left = `${origin.x}px`;
    heart.style.top = `${origin.y}px`;
    heart.style.fontSize = `${gsap.utils.random(14, 34, 1)}px`;
    host.appendChild(heart);

    gsap.fromTo(
      heart,
      {
        opacity: 0,
        x: gsap.utils.random(-18, 18, 1),
        y: gsap.utils.random(-8, 12, 1),
        scale: 0.45
      },
      {
        opacity: 0.95,
        x: gsap.utils.random(-window.innerWidth * 0.45, window.innerWidth * 0.45, 1),
        y: -gsap.utils.random(window.innerHeight * 0.2, window.innerHeight * 0.85, 1),
        rotate: gsap.utils.random(-30, 30, 1),
        scale: gsap.utils.random(0.9, 1.7, 0.05),
        duration: gsap.utils.random(2.8, 5.2, 0.1),
        ease: "power1.out",
        onComplete: () => heart.remove()
      }
    );

    gsap.to(heart, {
      opacity: 0,
      duration: 1,
      delay: gsap.utils.random(2.1, 3.8, 0.1)
    });
  }
}

function createBubbleBurst(host, origin, count) {
  if (!host) {
    return;
  }

  for (let index = 0; index < count; index += 1) {
    const bubble = document.createElement("span");
    const size = gsap.utils.random(14, 48, 1);
    bubble.className = "celebration-bubble";
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${origin.x}px`;
    bubble.style.top = `${origin.y + gsap.utils.random(-10, 18, 1)}px`;
    host.appendChild(bubble);

    gsap.fromTo(
      bubble,
      {
        opacity: 0,
        x: gsap.utils.random(-12, 12, 1),
        y: 0,
        scale: 0.2
      },
      {
        opacity: 0.78,
        x: gsap.utils.random(-140, 140, 1),
        y: -gsap.utils.random(120, 320, 1),
        scale: gsap.utils.random(0.8, 1.25, 0.05),
        duration: gsap.utils.random(1.8, 3.6, 0.1),
        ease: "power1.out",
        onComplete: () => bubble.remove()
      }
    );

    gsap.to(bubble, {
      opacity: 0,
      duration: 0.8,
      delay: gsap.utils.random(1.6, 2.7, 0.1)
    });
  }
}

function addConfettiBurst(store, origin, count) {
  for (let index = 0; index < count; index += 1) {
    store.confetti.push({
      x: origin.x,
      y: origin.y,
      vx: gsap.utils.random(-7, 7, 0.1),
      vy: gsap.utils.random(-10, -2.5, 0.1),
      size: gsap.utils.random(4, 10, 1),
      alpha: 1,
      gravity: gsap.utils.random(0.12, 0.2, 0.01),
      rotation: gsap.utils.random(0, 360, 1),
      rotationSpeed: gsap.utils.random(-14, 14, 0.1),
      color: ["#FF4D8D", "#FFC1D6", "#8B5CF6", "#FFD700", "#FFFFFF"][index % 5]
    });
  }
}

function addSparkleBurst(store, origin, count) {
  for (let index = 0; index < count; index += 1) {
    store.sparkles.push({
      x: origin.x + gsap.utils.random(-24, 24, 1),
      y: origin.y + gsap.utils.random(-18, 18, 1),
      vx: gsap.utils.random(-3.4, 3.4, 0.1),
      vy: gsap.utils.random(-4.5, 0.5, 0.1),
      radius: gsap.utils.random(1.5, 4.5, 0.1),
      alpha: 1,
      color: ["#FFFFFF", "#FFD700", "#FFC1D6"][index % 3]
    });
  }
}

function addFireworkBurst(store, x, y) {
  const palette = ["#FF4D8D", "#FFC1D6", "#8B5CF6", "#FFD700", "#FFFFFF"];
  const color = palette[Math.floor(Math.random() * palette.length)];

  for (let index = 0; index < 34; index += 1) {
    const angle = (Math.PI * 2 * index) / 34;
    const speed = gsap.utils.random(1.8, 5.8, 0.1);
    store.fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      radius: gsap.utils.random(1.8, 3.6, 0.1),
      gravity: 0.03,
      color
    });
  }
}

function renderCelebrationParticles(context, canvas, store) {
  if (!context || !canvas) {
    return;
  }

  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  store.confetti = store.confetti.filter((piece) => piece.alpha > 0.02);
  store.confetti.forEach((piece) => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += piece.gravity;
    piece.rotation += piece.rotationSpeed;
    piece.alpha -= 0.012;

    context.save();
    context.translate(piece.x, piece.y);
    context.rotate((piece.rotation * Math.PI) / 180);
    context.globalAlpha = piece.alpha;
    context.fillStyle = piece.color;
    context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.7);
    context.restore();
  });

  store.sparkles = store.sparkles.filter((sparkle) => sparkle.alpha > 0.03);
  store.sparkles.forEach((sparkle) => {
    sparkle.x += sparkle.vx;
    sparkle.y += sparkle.vy;
    sparkle.vy += 0.03;
    sparkle.alpha -= 0.02;

    context.save();
    context.globalAlpha = sparkle.alpha;
    context.fillStyle = sparkle.color;
    context.beginPath();
    context.arc(sparkle.x, sparkle.y, sparkle.radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
}

function renderFireworks(context, canvas, store) {
  if (!context || !canvas) {
    return;
  }

  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  store.fireworks = store.fireworks.filter((particle) => particle.alpha > 0.03);

  store.fireworks.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.992;
    particle.vy = particle.vy * 0.992 + particle.gravity;
    particle.alpha -= 0.014;

    context.save();
    context.globalAlpha = particle.alpha;
    context.fillStyle = particle.color;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
}

function playBlowSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const duration = 0.65;
  const sampleRate = context.sampleRate;
  const frameCount = sampleRate * duration;
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    const progress = index / frameCount;
    data[index] = (Math.random() * 2 - 1) * (1 - progress) * 0.6;
  }

  const source = context.createBufferSource();
  source.buffer = buffer;

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, context.currentTime);
  filter.frequency.exponentialRampToValueAtTime(220, context.currentTime + duration);

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start();
  source.stop(context.currentTime + duration);
  source.onended = () => context.close();
}

function initAudio() {
  const audio = document.getElementById("love-audio");
  const toggle = document.getElementById("audio-toggle");

  toggle.addEventListener("click", async () => {
    allowAudioFromUserGesture();

    if (state.audioEnabled) {
      fadeAudioOut(true);
    } else {
      await fadeAudioIn(true);
    }
  });

  audio.addEventListener("ended", () => {
    state.audioEnabled = false;
    updateAudioToggle(false);
  });

  window.addEventListener(
    "pointerdown",
    () => {
      allowAudioFromUserGesture();
    },
    { once: true }
  );

  window.addEventListener(
    "keydown",
    () => {
      allowAudioFromUserGesture();
    },
    { once: true }
  );
}

function allowAudioFromUserGesture() {
  if (!state.audioAllowed) {
    state.audioAllowed = true;
  }
}

async function fadeAudioIn(force = false, ignoreGestureRequirement = false) {
  const audio = document.getElementById("love-audio");

  if ((!state.audioAllowed && !ignoreGestureRequirement) || (!force && state.audioEnabled && !audio.paused)) {
    return;
  }

  try {
    audio.volume = 0;
    await audio.play();
    state.audioEnabled = true;
    updateAudioToggle(true);

    gsap.killTweensOf(audio);
    gsap.to(audio, {
      volume: 1,
      duration: 2,
      ease: "power2.out"
    });
  } catch (error) {
    state.audioEnabled = false;
    updateAudioToggle(false);
  }
}

function fadeAudioOut(forcePause = false) {
  const audio = document.getElementById("love-audio");

  if (!state.audioEnabled && !forcePause) {
    return;
  }

  gsap.killTweensOf(audio);
  gsap.to(audio, {
    volume: 0,
    duration: 2,
    ease: "power2.out",
    onComplete: () => {
      audio.pause();
      if (forcePause) {
        state.audioEnabled = false;
        updateAudioToggle(false);
      }
    }
  });
}

function updateAudioToggle(isActive) {
  const toggle = document.getElementById("audio-toggle");
  const label = toggle.querySelector("span");
  toggle.setAttribute("aria-pressed", String(isActive));
  label.textContent = isActive ? "Musique active" : "Activer la musique";
}

function initGlobalRevealAnimations() {
  gsap.utils.toArray(".section-title, .section-copy, #cake-scene, #cake-message").forEach((element) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 92%"
        }
      }
    );
  });
}

function shuffle(items) {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }
  return array;
}
