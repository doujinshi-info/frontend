import locale from './../ui/locale';

/**
 * Sets meta keywords
 *
 * @param  {Array} keywords Array of keywords.
 */
export default function setKeywords(keywords) {
  if (keywords == '') {
    keywords = [
      locale.t('doujinshi'),
      locale.t('statistics'),
      locale.t('information'),
      locale.t('artists')
    ];
  }

  keywords = keywords.join(', ');

  document.getElementsByTagName('meta')['keywords'].content = keywords;
}
