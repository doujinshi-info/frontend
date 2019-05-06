'use strict';

import {Api} from './../api';

/**
 * User libraries
 *
 * - Fetch a user's library contents.
 * - Add content to a user's library.
 * - Remove from a user's library.
 * - Check if a piece of content exists in a user's library.
 */
export class UserCollection {
  /**
   * Get the API class and initialize the model.
   */
  constructor() {
    this.api = new Api();

    this.error = false;
    this.isLoading = false;
    this.data = null;
  }

  /**
   * Get contents of a user's wishlist or library.
   *
   * @param  {string} type     The collection type to fetch contents from.
   * @param  {string} username The user's unique slug.
   * @param  {number} page     The pagination page to return data from.
   * @param  {string} query    Keywords to earch for within the library.
   * @return {Promise}
   */
  fetch(type, username, page = 1, query) {
    this.isLoading = true;

    return this.api.request('GET', '/user/'+username+'/library/'+type, {
      page: page,
      q: query,
    }, true)
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
   * Add a doujinshi to a user's library or wishlist.
   *
   * @param {string} type The collection type to add content to.
   * @param {string} book The book's unique hash ID.
   * @return {Promise}
   */
  addToCollection(type, book) {
    this.isLoading = true;

    return this.api.request('POST', '/library/'+type, {book: book}, true)
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
   * Remove a doujinshi from a user's wishlist or library.
   *
   * @param  {string} type The collection type to remove content from.
   * @param  {string} book The book's unique hash ID.
   * @return {Promise}
   */
  removeFromCollection(type, book) {
    this.isLoading = true;

    return this.api.request('DELETE', '/library/'+type, {book: book}, true)
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
   * Check if a doujinshi is part of a user's wishlist or library.
   *
   * @param  {string} type    The library type (wishlist | collection)
   * @param  {string} book    The book's hashed ID.
   * @return {Promise}
   */
  check(type, book) {
    this.isLoading = true;

    return this.api.request('GET', '/library/'+type+'/'+book, {}, true)
        .then((response) => {
          this.data = response.data;
        }).then(() => {
          this.isLoading = false;
        }).catch((e) => {
          this.error = this.api.error;
          this.isLoading = false;
        });
  }
}
