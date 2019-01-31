import documentTitle from './document-title';
import setMetaKeywords from './set-keywords';
import setMetaDescription from './set-meta-description';
import setSocialTags from './set-social-tags';
import getTagSet from './get-tag-set';
import locale from './../ui/locale';

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
  let description = locale.t(translation, {
    tag: locale.name(data.name),
    type: locale.name(data.type.name).toLowerCase(),
  });

  setMetaDescription(description);

  /**
   * Set keywords
   */
  let keywords = [locale.name(data.name), locale.t('doujinshi'), locale.t('statistics')];

  data.tags.data.map((tag) => {
    keywords.push(locale.name(tag.name));
  });

  setMetaKeywords(keywords);
}
