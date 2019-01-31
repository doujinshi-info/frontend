import locale from './../ui/locale';

/**
 * Sets the meta description.
 *
 * @param  {string} description [description]
 */
export default function setMetaDescription(description = '') {
  if (description == '') {
    description = locale.t('texts.about.text_about1');
  }

  document.getElementsByTagName('meta')['description'].content = description;
}
