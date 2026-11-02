(() => {
  const banner = document.querySelector('.consent-banner');
  if (!banner) return;
  const id = banner.dataset.gaId;
  const key = 'ct-analytics-consent';
  const read = () => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (value) => { try { localStorage.setItem(key, value); } catch {} };
  const show = (visible) => { banner.hidden = !visible; };
  const loadAnalytics = () => {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
  };
  const clearAnalyticsCookies = () => {
    const domains = ['', location.hostname, `.${location.hostname.replace(/^www\./, '')}`];
    document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((name) => name.startsWith('_ga')).forEach((name) => {
      domains.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ''}`;
      });
    });
  };
  banner.querySelector('.consent-accept').addEventListener('click', () => {
    write('granted');
    show(false);
    loadAnalytics();
  });
  banner.querySelector('.consent-decline').addEventListener('click', () => {
    const wasLoaded = Boolean(window.gtag);
    write('denied');
    clearAnalyticsCookies();
    show(false);
    if (wasLoaded) location.reload();
  });
  document.querySelectorAll('.consent-open').forEach((button) => button.addEventListener('click', () => show(true)));
  const choice = read();
  if (choice === 'granted') loadAnalytics();
  else if (choice !== 'denied') show(true);
})();
