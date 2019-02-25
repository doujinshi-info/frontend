'use strict';

import {Api} from './../api';

/**
 * Tags
 *
 * - Create new tag object.
 * - Update existing tag object.
 * - Deletes existing tag object.
 * - Fetch information about a tag.
 * - Fetch all tags.
 */
export class Tag {
  /**
   * Get the API class and initialize the model.
   */
  constructor() {
    this.api = new Api();

    this.isLoading = false;
    this.data = false;
    this.meta = false;
    this.error = false;
  }

  /**
   * Creates a new tag.
   *
   * @param  {object} payload The data from the form.
   * @return {Promise}
   */
  create(payload) {
    this.isLoading = true;

    return this.api.request('POST', '/tag', payload, true)
    .then((response) => {
      this.data = response;
    })
    .then(() => {
      this.isLoading = false;
    })
    .catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Updates an existing tag.
   *
   * @param  {string} type The tag type unique slug.
   * @param  {string} slug The tag's unique slug.
   * @param  {Object} payload The data from the form.
   * @return {Promise}
   */
  update(type, slug, payload) {
    this.isLoading = true;

    return this.api.request(
      'PUT',
      '/tag/' + type + '/' + slug,
      payload,
      true
    )
    .then((response) => {
      this.data = response;
    })
    .then(() => {
      this.isLoading = false;
    })
    .catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Fetches information about a specific tag.
   *
   * @param  {string} type The tag type unique slug.
   * @param  {string} slug The tag's unique slug.
   * @param  {number} page The paginated page to return data from.
   * @return {Promise}
   */
  fetch(type, slug, page = 1) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/tag/'+type+'/'+slug, {page: page})
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
   * Fetch all tags.
   *
   * @param  {string} type The tag type.
   * @param  {number} page The pagination page number.
   * @return {Promise}
   */
  fetchAll(type, page = 1) {
    this.data = null;
    this.isLoading = true;

    type = (type ? '/'+type : '');

    return this.api.request('GET', '/tag'+type, {page: page})
    .then((response) => {
      this.data = response.data;
      this.meta = response.meta;
    })
    .then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  search(type, query, page = 1) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/search/tag/'+type, {q: query, page: page})
    .then((response) => {
      this.data = response.data;
      this.meta = response.meta;
    })
    .then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }
}
