(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const isEnglish = root.lang.toLowerCase().startsWith('en');
  const saved = localStorage.getItem('epe-site-theme');
  const initial = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const headerInner = document.querySelector('.header-inner');
  if (headerInner) {
    const basePath = '/easypeasy-eng';
    const currentPath = location.pathname.replace(/index\.html$/, '');
    const targetPath = isEnglish
      ? currentPath.replace(`${basePath}/en`, basePath)
      : currentPath.replace(`${basePath}/`, `${basePath}/en/`);
    const languageLink = document.createElement('a');
    languageLink.className = 'language-switch';
    languageLink.href = targetPath || `${basePath}/`;
    languageLink.hreflang = isEnglish ? 'ru' : 'en';
    languageLink.lang = isEnglish ? 'ru' : 'en';
    languageLink.textContent = isEnglish ? 'RU' : 'EN';
    languageLink.setAttribute('aria-label', isEnglish ? 'Открыть русскую версию' : 'Open the English version');
    headerInner.insertBefore(languageLink, toggle || null);
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('epe-site-theme', theme);
    document.querySelectorAll('[data-light-src][data-dark-src]').forEach((image) => {
      image.src = theme === 'dark' ? image.dataset.darkSrc : image.dataset.lightSrc;
    });
    document.querySelectorAll('[data-light-href][data-dark-href]').forEach((link) => {
      link.href = theme === 'dark' ? link.dataset.darkHref : link.dataset.lightHref;
    });
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '☀' : '☾';
      toggle.setAttribute('aria-label', isEnglish
        ? (theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')
        : (theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'));
    }
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#2d2c31' : '#eeeae2';
  }

  setTheme(initial);
  toggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  // Keep short function words with the word that follows in both site languages.
  const typographyPattern = isEnglish
    ? /(^|[\s([{«„"'])((?:a|an|and|as|at|by|for|from|i|in|into|of|on|or|the|to|with))[ \t\r\n]+(?=[\p{L}\p{N}])/giu
    : /(^|[\s([{«„"'])((?:а|без|в|во|да|для|до|за|и|из|или|к|ко|на|над|не|ни|но|о|об|от|по|под|при|про|с|со|у))[ \t\r\n]+(?=[\p{L}\p{N}])/giu;
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
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111174454', 'ym');

    ym(111174454, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
    if (new URLSearchParams(location.search).get('utm_source') === 'threads') {
      ym(111174454, 'reachGoal', 'threads_landing_view');
    }
  }
})();
