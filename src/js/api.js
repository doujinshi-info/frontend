'use strict';

import {Auth} from './auth';
import m from 'mithril';

import Alert from './ui/components/alert';

/**
 * Performs calls to the API endpoints.
 */
export class Api {
  /**
   * Initialize the API class.
   */
  constructor() {
    this.auth = new Auth();
    this.error = null;
  }

  /**
   * The main HTTP Request function to interact with the API.
   *
   * @param  {string}  method       HTTP request method (GET, PUT, POST, etc)
   * @param  {string}  url          The API endpoint url.
   * @param  {object}  payload      The payload to submit with the request.
   * @param  {boolean} authRequired If the request needs a JWT token included.
   * @return {Promise}              Return the promise.
   */
  request(method, url, payload, authRequired = false) {
    let options = {
      method: method,
      data: payload,
      url: process.env.API_ENDPOINT + url,
    };

    if (authRequired == true) {
      // Check if existing access token is expires
      if (this.auth.checkAccessExpired()) {
        // Refresh the access token before continuing with the rest of the
        // request.
        return this.auth.refreshToken().then(() => {
          options = Object.assign(options, {
            headers: {'Authorization': 'Bearer ' + this.auth.token},
          });

          return this._handleRequest(options);
        });
      } else {
        options = Object.assign(options, {
          headers: {'Authorization': 'Bearer ' + this.auth.token},
        });

        return this._handleRequest(options);
      }
    } else {
      return this._handleRequest(options);
    }
  }

  /**
   * Handles the actual request to the API.
   *
   * @param  {object} options The options created in request function.
   * @return {Promise}        The promise.
   */
  _handleRequest(options) {
    return m.request(options).then((response) => {
      return response;
    }).catch((e) => {
      Alert.create('error', e.message);
      this._handleError(e);
    });
  }

  /**
   * Handles errors returned by the API.
   *
   * @param  {Exception} e The error exception from the promise.
   */
  _handleError(e) {
    switch (e.error) {
      case 'errors.refresh_token_expired':
        this.auth.removeTokens();
        location.reload();
      break;
      default:
        this.error = e;
      break;
    }
  }
}
