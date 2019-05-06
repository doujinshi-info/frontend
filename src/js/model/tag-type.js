'use strict';

import {Api} from './../api';

/**
 * Tag Types
 *
 * - Fetch all tag types.
 */
export class TagType {
  /**
   * Get the API class and initialize the model.
   */
  constructor() {
    this.api = new Api();

    this.isLoading = false;
    this.data = null;
  }

  /**
   * Get all tag types.
   *
   * @return {Promise}
   */
  fetchAll() {
    this.data = null;
    this.isLoading = true;

    return this.api.request('GET', '/tag/types')
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
}
