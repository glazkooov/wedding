/* ==========================================================================
   SCRIPT.JS
   --------------------------------------------------------------------------
   Этот файл ничего не нужно редактировать вручную.
   Все тексты сайт берёт из объекта WEDDING_CONFIG, который находится
   в самом верху index.html — там их и надо менять.

   Что делает этот файл:
   1. Подставляет данные из WEDDING_CONFIG в нужные места на странице.
   2. Запускает обратный отсчёт до свадьбы.
   3. Плавно показывает блоки при прокрутке страницы (fade-in).
   4. Делает лёгкий эффект параллакса на первом экране.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  fillContentFromConfig();
  startCountdown();
  initScrollReveal();
  initParallax();
  initScrollCue();
});


/* --------------------------------------------------------------------------
   1. ПОДСТАНОВКА ТЕКСТОВ ИЗ WEDDING_CONFIG
   -------------------------------------------------------------------------- */
function fillContentFromConfig() {
  const cfg = WEDDING_CONFIG;

  // Имена в hero-блоке
  setText('js-groom-name', cfg.groomName);
  setText('js-bride-name', cfg.brideName);

  // Тексты приглашения
  setText('js-invitation-intro', cfg.invitationIntro);
  setText('js-invitation-body', cfg.invitationBody);

  // Дата в hero
  setText('js-hero-date', cfg.dateForHumans);

  // Программа дня — регистрация
  setText('js-registration-time', cfg.registrationTime);
  setText('js-registration-place', cfg.registrationPlace);
  setText('js-registration-hall', cfg.registrationHall);

  // Программа дня — прогулка
  setText('js-walk-time', cfg.walkTime);
  setText('js-walk-place', cfg.walkPlace);

  // Программа дня — банкет
  setText('js-banquet-time', cfg.banquetTime);
  setText('js-banquet-place', cfg.banquetPlace);

  // Футер
  setText('js-footer-groom', cfg.groomName);
  setText('js-footer-bride', cfg.brideName);
  setText('js-footer-date', cfg.dateForHumans);

  // Заголовок вкладки браузера
  document.title = cfg.groomName + ' и ' + cfg.brideName + ' — ' + cfg.dateForHumans;
}

// Небольшой помощник: находит элемент по id и подставляет туда текст,
// если значение передано.
function setText(elementId, value) {
  const el = document.getElementById(elementId);
  if (el && value) {
    el.textContent = value;
  }
}


/* --------------------------------------------------------------------------
   2. ОБРАТНЫЙ ОТСЧЁТ ДО СВАДЬБЫ
   -------------------------------------------------------------------------- */
function startCountdown() {
  const targetDate = new Date(WEDDING_CONFIG.dateISO);

  // Если дата в настройках указана неверно — просто не показываем отсчёт
  if (isNaN(targetDate.getTime())) {
    const countdownBlock = document.getElementById('js-countdown');
    if (countdownBlock) countdownBlock.style.display = 'none';
    return;
  }

  updateCountdown(targetDate);
  // Обновляем раз в минуту — этого достаточно, лишняя частота отвлекает
  setInterval(function () { updateCountdown(targetDate); }, 60 * 1000);
}

function updateCountdown(targetDate) {
  const now = new Date();
  let diff = targetDate.getTime() - now.getTime();

  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  setText('cd-days', String(days).padStart(2, '0'));
  setText('cd-hours', String(hours).padStart(2, '0'));
  setText('cd-minutes', String(minutes).padStart(2, '0'));
}


/* --------------------------------------------------------------------------
   3. ПЛАВНОЕ ПОЯВЛЕНИЕ БЛОКОВ ПРИ ПРОКРУТКЕ (fade-in)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.fade-in');

  // Если браузер очень старый и не поддерживает IntersectionObserver —
  // просто показываем все блоки сразу, без анимации.
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // анимация проигрывается один раз
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  items.forEach(function (el) { observer.observe(el); });
}


/* --------------------------------------------------------------------------
   4. ЛЁГКИЙ ПАРАЛЛАКС НА ГЛАВНОМ ЭКРАНЕ
   -------------------------------------------------------------------------- */
function initParallax() {
  const layers = document.querySelectorAll('.hero-layer, .hero-colonnade');
  if (!layers.length) return;

  // Уважаем настройку "меньше анимаций" в системе пользователя
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        applyParallax(layers);
        ticking = false;
      });
      ticking = true;
    }
  });
}

function applyParallax(layers) {
  const scrollY = window.scrollY || window.pageYOffset;

  layers.forEach(function (layer) {
    const speed = parseFloat(layer.getAttribute('data-speed')) || 0.2;
    const offset = scrollY * speed;
    layer.style.transform = 'translateY(' + offset + 'px)';
  });
}


/* --------------------------------------------------------------------------
   5. КНОПКА "ЛИСТАЙТЕ ВНИЗ" НА ГЛАВНОМ ЭКРАНЕ
   -------------------------------------------------------------------------- */
function initScrollCue() {
  const button = document.getElementById('js-scroll-cue');
  const nextSection = document.querySelector('.invitation');
  if (!button || !nextSection) return;

  button.addEventListener('click', function () {
    nextSection.scrollIntoView({ behavior: 'smooth' });
  });
}
