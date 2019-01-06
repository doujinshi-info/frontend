'use strict';

import documentTitle from './../../utils/document-title';
import setMetaKeywords from './../../utils/set-keywords';
import setMetaDescription from './../../utils/set-meta-description';
import setSocialTags from './../../utils/set-social-tags';

/**
 * Base page which all other pages extend from.
 */
export default class BasePage {
  /**
   * Initialize the base page.
   *
   * @param  {String} title The webpage's title.
   */
  constructor(title = '') {
    this.setTitle(title);
    this.description = '';
    this.keywords = '';
    this.image = '';
  }

  /**
   * Returns the currently set title.
   *
   * @return {string} The title.
   */
  getTitle() {
    return this.title;
  }

  /**
   * Sets the document's title.
   *
   * @param {string} title The string to set the title to.
   */
  setTitle(title) {
    this.title = title;
    documentTitle(this.title);
  }

  /**
   * Sets the description meta tag.
   *
   * @param {string} text The description for the document.
   */
  setDescription(text) {
    this.description = text;
    setMetaDescription(text);
  }

  /**
   * Sets the keywords meta tag.
   *
   * @param {array} keywords An array of keywords to set.
   */
  setKeywords(keywords) {
    setMetaKeywords(keywords);
  }

  /**
   * Sets social media image.
   *
   * @param {string} image The image url.
   */
  setImage(image) {
    this.image = image;
  }

  /**
   * Sets social meta meta tags.
   *
   * @param {string} image The image url to use.
   */
  setSocialMeta(image) {
    setSocialTags(this.title, this.description, image);
  }
}
