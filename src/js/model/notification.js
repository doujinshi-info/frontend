'use strict';

import {Api} from './../api';

/**
 * Notifications
 *
 * - Fetch user's nofitications.
 * - Get user's unread notification count.
 * - Mark a notification as read.
 * - Mark all notifications as read.
 * - Sync push notification key.
 */
export class Notification {
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
   * Gets a user's notifications.
   *
   * @param  {number} page The paginated page to return data from.
   * @return {Promise}
   */
  fetch(page = 1) {
    this.isLoading = true;

    return this.api.request('GET', '/notifications', {
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
   * Gets the unread count for a user's notifications.
   *
   * @return {Promise}
   */
  count() {
    this.isLoading = true;

    return this.api.request('GET', '/notifications/count', {}, true)
    .then((response) => {
      this.data = response.data;
    }).then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Marks a notification as read.
   *
   * @param  {string} notification The unique hash ID of the notification.
   * @return {Promise}
   */
  read(notification) {
    this.isLoading = false;

    return this.api.request('PUT', '/notifications/read', {
      notification: notification,
    }, true)
    .then((response) => {
      this.data = response.data;
    }).then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Marks all notifications as read.
   *
   * @return {Promise}
   */
  readAll() {
    this.isLoading = false;

    return this.api.request('PUT', '/notifications/read/all', {}, true)
    .then((response) => {
      this.data = response.data;
    }).then(() => {
      this.isLoading = false;
    }).catch((e) => {
      this.error = this.api.error;
      this.isLoading = false;
    });
  }

  /**
   * Sync push notifications endpoint.
   *
   * @param  {string} type         The type of operation to perform.
   * @param  {object} subscription The push subscription key.
   * @param  {string} language     The language the user is using.
   * @return {Promise}
   */
  pushSync(type, subscription, language = 'en') {
    this.isLoading = false;

    return this.api.request('PUT', '/notifications/push', {
      type: type,
      subscription: subscription,
      language: language,
    }, true)
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
