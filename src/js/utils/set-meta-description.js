/**
 * Sets the meta description.
 *
 * @param  {string} description [description]
 */
export default function setMetaDescription(description = '') {
  document.getElementsByTagName('meta')['description'].content = description;
}
