'use strict';

import {Api} from './../api';

/**
 * User
 *
 * - Authenticated user details
 * - Update settings
 * - Get user's profile information
 */
export class User {
  /**
   * Get the API class and initialize the model.
   */
  constructor() {
    this.api = new Api();

    this.isLoading = false;

    this.data = null;
    this.collection = null;
    this.error = null;
  }

  /**
   * Get logged in user's details.
   *
   * @param  {string} token The user's access token.
   * @return {Promise}
   */
  getUserDetails(token) {
    if (token) {
      this.isLoading = true;

      return this.api.request('GET', '/auth/user', '', true)
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

  /**
   * Update logged in user's settings.
   *
   * @param  {string} slug    The user's unique slug.
   * @param  {Object} payload The data from the settings form.
   * @return {Promise}
   */
  updateSettings(slug, payload) {
    this.isLoading = true;

    return this.api.request('PUT', '/user/'+slug, payload, true)
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
   * Get a user's public profile information.
   *
   * @param  {string} slug The user's unique slug.
   * @return {Promise}
   */
  getProfile(slug) {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/user/' + slug, '', true)
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
