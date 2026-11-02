(() => {
  const mount = document.querySelector('.giscus-mount');
  if (!mount) return;
  const root = document.documentElement;
  const giscusTheme = () => (root.dataset.theme === 'dark' ? 'transparent_dark' : 'light');
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  Object.entries({
    repo: mount.dataset.repo,
    repoId: mount.dataset.repoId,
    category: mount.dataset.category,
    categoryId: mount.dataset.categoryId,
    mapping: 'pathname',
    strict: '1',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    theme: giscusTheme(),
    lang: 'en',
    loading: 'lazy',
  }).forEach(([name, value]) => { script.dataset[name] = value; });
  mount.appendChild(script);
  new MutationObserver(() => {
    const frame = document.querySelector('iframe.giscus-frame');
    if (frame) frame.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme() } } }, 'https://giscus.app');
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
})();
