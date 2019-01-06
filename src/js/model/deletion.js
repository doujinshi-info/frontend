'use strict';

import {Api} from './../api';
import toFormData from './../utils/to-form-data';

/**
 * Deletion Requests
 *
 * - Create a new deletion request.
 */
export class Deletion {
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
   * Creates a new deletion request.
   *
   * @param  {object} payload The form data.
   * @return {Promise}
   */
  create(payload) {
    this.isLoading = true;

    payload = toFormData(payload);

    return this.api.request('POST', '/deletion', payload, true)
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
