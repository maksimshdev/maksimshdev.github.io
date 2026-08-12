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

  // Keep short Russian prepositions and conjunctions with the following word.
  const typographyPattern = /(^|[\s([{«„"'])((?:а|без|в|во|да|для|до|за|и|из|или|к|ко|на|над|не|ни|но|о|об|от|по|под|при|про|с|со|у))[ \t\r\n]+(?=[\p{L}\p{N}])/giu;
  const typographyWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script, style, code, pre, textarea, noscript')) return NodeFilter.FILTER_REJECT;
      return node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const typographyNodes = [];
  while (typographyWalker.nextNode()) typographyNodes.push(typographyWalker.currentNode);
  typographyNodes.forEach((node) => {
    let value = node.nodeValue;
    let previous;
    do {
      previous = value;
      value = value.replace(typographyPattern, '$1$2\u00a0');
    } while (value !== previous);
    node.nodeValue = value;
  });

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
