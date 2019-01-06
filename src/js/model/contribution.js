'use strict';

import {Api} from './../api';

/**
 * Changelogs
 *
 * - Fetch all changes on a book object.
 * - Fetch all changes on a tag object.
 * - Fetch all contributions by a user.
 * - Fetch all changes for both books and tags.
 * - Get differences under a specific changelog entry.
 * - Revert a change.
 */
export class Contribution {
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
   * Get changelog to a specific book.
   *
   * @param  {string} slug The unique slug of the book.
   * @return {Promise}
   */
  fetchBookChanges(slug) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/book/' + slug + '/changelog')
    .then((response) => {
      this.data = response.data;
    })
    .then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Get changelog to a specific tag.
   *
   * @param  {string} type The tag type's unique slug.
   * @param  {string} slug The tag's unique slug.
   * @return {Promise}
   */
  fetchTagChanges(type, slug) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/tag/'+type+'/'+slug+'/changelog')
    .then((response) => {
      this.data = response.data;
    })
    .then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Get user's changes to various books and tags.
   *
   * @param  {string} user The user's unique slug.
   * @param  {number} page The paginated page to return data from.
   * @return {Promise}
   */
  fetchUserChanges(user, page = 1) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/user/' + user + '/contributions', {
      page: page,
    })
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

  /**
   * Get all changes all doujinshi and tags.
   *
   * @param  {number} page The paginated page to return data from.
   * @return {Promise}
   */
  fetchAll(page = 1) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/changelog', {page: page})
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

  /**
   * Get specific change differences.
   *
   * @param  {string} contribution The hashed ID of the changelog entry.
   * @return {Promise}
   */
  fetch(contribution) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/changelog/' + contribution)
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
   * Reverts changes of a specific change.
   *
   * @param  {string} transaction The hashed ID of the changelog entry.
   * @return {Promise}
   */
  revert(transaction) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('POST', '/changelog/revert', {
      transaction_id: transaction,
    }, true)
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
}
