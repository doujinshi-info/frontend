/**
 * Sets the browser's title.
 *
 * @param  {string} text The text to change the title to.
 */
export default function setDocumentTitle(text) {
  if (text.length > 0) {
    document.title = text + ' — ' + process.env.APP_TITLE;
  } else {
    document.title = process.env.APP_TITLE;
  }
}
