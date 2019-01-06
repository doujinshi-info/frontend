'use strict';

import {Api} from './../api';

/**
 * Followed Tags
 *
 * - Get all of user's followed tags.
 * - Follows a tag.
 * - Unfollows a tag.
 * - Check if a tag is being followed.
 */
export class Following {
  /**
   * Get the API class and initialize the model.
   */
  constructor() {
    this.api = new Api();

    this.error = false;
    this.isLoading = false;
    this.data = null;
    this.meta = null;
  }

  /**
   * Get a user's followed tags.
   *
   * @param  {string} username The user's unique slug.
   * @param  {number} page     The paginated page to return data from.
   * @return {Promise}
   */
  fetch(username, page = 1) {
    this.isLoading = true;

    return this.api.request('GET', '/user/'+username+'/following', {
      page: page,
    }, true)
    .then((response) => {
      this.data = response.data;
      this.meta = response.meta;
    }).then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Create a new followed tag.
   *
   * @param  {string} tag The tag's unique hash ID.
   * @return {Promise}
   */
  followTag(tag) {
    this.isLoading = true;

    return this.api.request('POST', '/following', {tag: tag}, true)
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
   * Removes a tag from the user's followed tags.
   *
   * @param  {string} tag The tag's unique hash ID.
   * @return {Promise}
   */
  unfollowTag(tag) {
    this.isLoading = true;

    return this.api.request('DELETE', '/following', {tag: tag}, true)
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
   * Checks if a tag is being followed.
   *
   * @param  {string} tag The tag's unique hash ID.
   * @return {Promise}
   */
  checkTag(tag) {
    this.isLoading = true;

    return this.api.request('GET', '/following/'+tag, {}, true)
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
