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
  const circles = getTagSet('circle', data.tags);

  /*
    const artists = getTagSet('artist', data.tags);
    const series = getTagSet('series', data.tags);
    const characters = getTagSet('character', data.tags);
    const contents = getTagSet('content', data.tags);
    const languages = getTagSet('language', data.tags);
    const censoring = getTagSet('censoring', data.tags);
    const convention = getTagSet('convention', data.tags);
  */

  /**
   * Set title
   */
  let docTitle = '';

  if (circles.length) {
    docTitle += '['+locale.name(circles[0].name)+'] ';
  }

  docTitle += locale.name(data.name);

  documentTitle(docTitle);


  /**
   * Set description
   */
  const description = locale.t((data.is_adult ?
    'descriptions.book_info_adult' : 'descriptions.book_info'
  ), {
    book: locale.name(data.name),
    artist: (circles.length ? locale.name(circles[0].name) : ''),
  });

  setMetaDescription(description);


  /**
   * Set keywords
   */
  const keywords = [
    locale.name(data.name), locale.t('doujinshi'), locale.t('statistics'),
  ];

  data.tags.data.map((tag) => {
    keywords.push(locale.name(tag.name));
  });

  setMetaKeywords(keywords);


  /**
   * Set social tags
   */
  setSocialTags(docTitle, description, data.cover);
}
