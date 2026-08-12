(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const saved = localStorage.getItem('epe-site-theme');
  const initial = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('epe-site-theme', theme);
    document.querySelectorAll('[data-light-src][data-dark-src]').forEach((image) => {
      image.src = theme === 'dark' ? image.dataset.darkSrc : image.dataset.lightSrc;
    });
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '☀' : '☾';
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
    }
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#2d2c31' : '#eeeae2';
  }

  setTheme(initial);
  toggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  document.querySelectorAll('[data-store]').forEach((link) => {
    link.addEventListener('click', () => {
      const store = link.dataset.store;
      window.ym?.(111174454, 'reachGoal', `${store}_click`);
    });
  });

  if (location.hostname === 'maksimshdev.github.io') {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    script.addEventListener('load', () => {
      window.ym?.(111174454, 'init', {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});
      if (new URLSearchParams(location.search).get('utm_source') === 'threads') {
        window.ym?.(111174454, 'reachGoal', 'threads_landing_view');
      }
    });
    document.head.appendChild(script);
  }
})();
