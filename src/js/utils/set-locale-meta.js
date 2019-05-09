import locale from './../ui/locale';

/**
 * Sets localized version meta tag.
 *
 * @param  {string} path The path of the current url.
 */
export default function(path) {
  const lang = (locale.getLang() == 'ja' ? 'en' : 'ja');
  const domain = (lang == 'en' ? process.env.EN_URL : process.env.JA_URL);
  const url = domain + path;

  const link = '<link rel="alternate" hreflang="'+lang+'" href="'+url+'" />';

  document.documentElement.lang = locale.getLang();
  document.head.innerHTML += link;
}
