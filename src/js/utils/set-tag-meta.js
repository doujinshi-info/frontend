import documentTitle from './document-title';
import setMetaKeywords from './set-keywords';
import setMetaDescription from './set-meta-description';
import locale from './../ui/locale';

/**
 * Sets meta data for tag objects.
 *
 * @param {object} data        The tag object.
 * @param {string} translation The translated string to use.
 */
export default function setTagMeta(data, translation) {
  /**
   * Set title
   */
  let docTitle = locale.name(data.name);

  if (translation == 'descriptions.tag_stats') {
    docTitle += ' : ' + locale.t('statistics');
  } else if (translation == 'descriptions.tag_changelog') {
    docTitle += ' : ' + locale.t('navi.changelog');
  } else {

  }

  documentTitle(docTitle);

  /**
   * Set description
   */
  const description = locale.t(translation, {
    tag: locale.name(data.name),
    type: locale.name(data.type.name).toLowerCase(),
  });

  setMetaDescription(description);

  /**
   * Set keywords
   */
  const keywords = [
    locale.name(data.name),
    locale.t('doujinshi'), locale.t('statistics'),
  ];

  data.tags.data.map((tag) => {
    keywords.push(locale.name(tag.name));
  });

  setMetaKeywords(keywords);
}
