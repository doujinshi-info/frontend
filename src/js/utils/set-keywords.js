/**
 * Sets meta keywords
 *
 * @param  {Array} keywords Array of keywords.
 */
export default function setKeywords(keywords) {
  keywords = keywords.join(', ');
  document.getElementsByTagName('meta')['keywords'].content = keywords;
}
