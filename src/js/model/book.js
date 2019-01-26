'use strict';

import {Api} from './../api';
import toFormData from './../utils/to-form-data';

/**
 * Book / Doujinshi
 *
 * - Create a new doujinshi object.
 * - Updates an existing doujinshi object.
 * - Deletes an existing doujinshi object.
 * - Fetch information about a specific doujinshi object.
 * - Fetch all doujinshi objects.
 * - Search doujinshi objects via keywords.
 * - Search doujinshi objects via image.
 * - Import doujinshi data from popular domains.
 */
export class Book {
  /**
   * Get the API class and initialize the model.
   */
  constructor() {
    this.api = new Api();

    this.isLoading = false;
    this.data = false;
    this.list = false;
    this.meta = false;
    this.owned = false;
    this.wished = false;
    this.error = false;
  }

  /**
   * Create a new doujinshi.
   *
   * @param  {object} payload The data from the form.
   * @return {Promise}
   */
  create(payload) {
    this.isLoading = true;

    payload = toFormData(payload);

    return this.api.request('POST', '/book', payload, true)
    .then((response) => {
      this.data = response;
    }).then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Update an existing doujinshi.
   *
   * @param  {string} slug    The book's unique slug.
   * @param  {object} payload The new data to update the object with.
   * @return {Promise}
   */
  update(slug, payload) {
    this.isLoading = true;

    payload = toFormData(payload);

    return this.api.request('POST', '/book/'+slug, payload, true)
    .then((response) => {
      this.data = response;
    }).then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Fetches the information of a doujinshi.
   *
   * @param  {string} slug The unique slug of the book.
   * @return {Promise}
   */
  fetch(slug) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/book/'+slug)
    .then((response) => {
      this.data = response;
    })
    .then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Gets all doujinshi by most recent.
   *
   * @param  {number} page The paginated page to return data from.
   * @return {Promise}
   */
  fetchAll(page = 1) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/book', {page: page})
    .then((response) => {
      this.data = response;
    })
    .then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Searches for a specific doujinshi.
   *
   * @param  {string} query The keywords and filters to use in search.
   * @param  {number} page  The paginated page to return data from.
   * @return {Promise}
   */
  search(query, page = 1) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/search', {q: query, page: page})
    .then((response) => {
      this.data = response;
    })
    .then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Searches for a specific doujinshi using an image.
   *
   * @param  {binary} image The image file contents.
   * @param  {number} page  The paginated page to return results from.
   * @return {Promise}
   */
  imageSearch(image, page = 1) {
    this.data = null;
    this.isLoading = true;

    let payload = toFormData({image: image});

    return this.api.request('POST', '/search/image', payload)
    .then((response) => {
      this.data = response;
    })
    .then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Imports a doujinshi from an approved site (toranoana, melonbooks).
   *
   * @param  {string} url The url to import from.
   * @return {Promise}
   */
  importBook(url) {
    this.isLoading = true;

    return this.api.request('POST', '/import', {url: url}, true)
    .then((response) => {
      this.data = response;
    }).then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }
}
