import documentTitle from './document-title';
import setMetaKeywords from './set-keywords';
import setMetaDescription from './set-meta-description';
import setSocialTags from './set-social-tags';
import getTagSet from './get-tag-set';
import locale from './../ui/locale';

/**
 * Sets meta tags for book.
 *
 * @param {object} data The book data
 */
export default function setBookMeta(data) {
  let artists = getTagSet('artist', data.tags);
  let circles = getTagSet('circle', data.tags);
  let series = getTagSet('series', data.tags);
  let characters = getTagSet('character', data.tags);
  let contents = getTagSet('content', data.tags);
  let languages = getTagSet('language', data.tags);
  let censoring = getTagSet('censoring', data.tags);
  let convention = getTagSet('convention', data.tags);

  /**
   * Set title
   */
  let docTitle = "";

  if (circles.length) {
    docTitle += '['+locale.name(circles[0].name)+'] ';
  }

  docTitle += locale.name(data.name);

  documentTitle(docTitle);


  /**
   * Set description
   */
  let description = locale.t((data.is_adult ? 'descriptions.book_info_adult' : 'descriptions.book_info'), {
    book: locale.name(data.name),
    artist: (circles.length ? locale.name(circles[0].name) : ''),
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


  /**
   * Set social tags
   */
  setSocialTags(docTitle, description, data.cover);
}
