'use strict';

import {Api} from './../api';

/**
 * Stats
 *
 * - Fetch statistics
 */
export class Stats {
  /**
   * Get the API class and initialize the model.
   */
  constructor() {
    this.api = new Api();

    this.data = null;
    this.isLoading = false;
  }

  /**
   * Get site-wide stats.
   *
   * @param  {Boolean} startDate The start of the release date.
   * @param  {Boolean} endDate   The ending of the release date.
   * @param  {Boolean} tag       Tag ID to scope to.
   * @return {Promise}
   */
  fetch(startDate = false, endDate = false, tag = false) {
    this.data = null;
    this.isLoading = true;

    const filter = {};

    if (startDate) {
      filter.start_date = startDate;
    }

    if (endDate) {
      filter.end_date = endDate;
    }

    if (tag) {
      filter.tag = tag;
    }

    return this.api.request('GET', '/', filter)
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
