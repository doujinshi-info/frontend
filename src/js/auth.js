'use strict';

import m from 'mithril';
import Alert from './ui/components/alert';

/**
 * This performs calls to the authentication endpoints.
 */
export class Auth {
  /**
   * Initialize the authentication class.
   */
  constructor() {
    this.error = false;
    this.isLoading = false;
    this.data = false;

    this.token = this.getAccessToken();
    this.refresh = this.getRefreshToken();
    this.user = this.decodeToken();
  }

  /**
   * Handles interaction with the authentication API endpoints.
   *
   * @param  {string}  method       The HTTP request method.
   * @param  {string}  url          The API endpoint url.
   * @param  {object}  payload      The form data payload.
   * @param  {boolean} authRequired If the request requires a JWT.
   * @return {Promise}
   */
  _handleRequest(method, url, payload, authRequired = false) {
    let options = {
      method: method,
      data: payload,
      url: process.env.API_ENDPOINT + url,
    };

    if (authRequired == true) {
      options = Object.assign(options, {
        headers: {'Authorization': 'Bearer ' + this.token},
      });
    }

    return m.request(options).then((response) => {
      return response;
    }).catch((e) => {
      Alert.create('error', e.message);
      this._handleError(e);
    });
  }

  /**
   * Handles the request error / exception.
   *
   * @param  {Exception} e The XHR exception.
   */
  _handleError(e) {
    if (e.code == 404) {
      console.log('test');
    } else {
      switch (e.message) {
        case 'errors.refresh_token_expired':
          this.removeTokens();
          location.reload();
        break;
        default:
          this.error = e;
        break;
      }
    }
  }

  /**
   * Sends login credentials to attempt a login.
   *
   * @param  {string} email    The user's email address.
   * @param  {string} password The user's password.
   * @return {Promise}
   */
  login(email, password) {
    this.isLoading = true;

    return this._handleRequest('POST', '/auth/login', {
      email: email,
      password: password,
    })
    .then((response) => {
      this.setToken(response.access_token);
      this.setRefreshToken(response.refresh_token);
    })
    .then(() => {
      this.isLoading = false;
    })
    .then(() => {
      const redirect = window.localStorage.getItem('requestedPath') || null;

      if (redirect != null) {
        window.localStorage.removeItem('requestedPath');
        document.location = redirect;
      } else {
        document.location = '/';
      }
    })
    .catch((e) => {
      Alert.create('error', this.error.message);
      this.isLoading = false;
    });
  }

  /**
   * Sends a forgot password request to the API.
   *
   * @param  {string} email   The user's email address.
   * @return {Promise}
   */
  forgotPassword(email) {
    this.isLoading = true;

    return this._handleRequest('POST', '/password/email', {email: email})
    .then((response) => {
      this.data = response.data;
    })
    .then(() => {
      this.isLoading = false;
    })
    .catch((e) => {
      Alert.create('error', this.error.message);
      this.isLoading = false;
    });
  }

  /**
   * Changes a user's password as part of the forgot password process.
   *
   * @param  {object} payload The form data for the password reset form.
   * @return {Promise}
   */
  resetPassword(payload) {
    this.isLoading = true;

    return this._handleRequest('POST', '/password/reset', payload)
    .then((response) => {
      this.data = response.data;
    })
    .then(() => {
      m.route.set('/account/login');
      this.isLoading = false;
    })
    .catch((e) => {
      Alert.create('error', this.error.message);
      this.isLoading = false;
    });
  }

  /**
   * Creates a new account.
   *
   * @param  {object} payload The form data for the registration form.
   * @return {Promise}
   */
  create(payload) {
    this.isLoading = true;

    return this._handleRequest('POST', '/auth/create', payload)
    .then((response) => {
      this.setToken(response.access_token);
      this.setRefreshToken(response.refresh_token);
    })
    .then(() => {
      this.isLoading = false;
    })
    .then(() => {
      document.location = '/';
    })
    .catch((e) => {
      Alert.create('error', this.error.message);
      this.isLoading = false;
    });
  }

  /**
   * Refreshes the JWT access token.
   *
   * @return {Promise}
   */
  refreshToken() {
    this.isLoading = true;

    return this._handleRequest('POST', '/auth/login', {
      user: this.user.sub,
      refresh_token: this.refresh,
    })
    .then((response) => {
      this.setToken(response.access_token);
      this.user = this.decodeToken();
    })
    .then(() => {
      this.isLoading = false;
    })
    .catch((e) => {
      this.isLoading = false;
      this.removeTokens();
      document.location = '/';
    });
  }

  /**
   * Sets the access token value and stores it in local storage.
   *
   * @param {string} token The JWT access token key.
   */
  setToken(token) {
    this.token = token;
    window.localStorage.setItem('token', token);
  }

  /**
   * Sets the refresh token value and stores it in local storage.
   *
   * @param {string} token The refresh token key.
   */
  setRefreshToken(token) {
    this.refresh = token;
    window.localStorage.setItem('refresh', token);
  }

  /**
   * Checks if an access token has expired and needs to be refreshed.
   *
   * @return {boolean} If the token has expired or not.
   */
  checkAccessExpired() {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const token = this.decodeToken();

    const expireTime = token.exp - 15 * 60;

    if (expireTime <= timestamp) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Sends a request to the server to blacklist the user's refresh token.
   *
   * @return {Promise}
   */
  logout() {
    this.isLoading = true;

    return this._handleRequest('POST', '/auth/logout', {
      user: this.user.sub,
      refresh_token: this.refresh,
    }, true)
    .then((response) => {
      this.removeTokens();
    })
    .then(() => {
      this.isLoading = false;
    })
    .catch((e) => {
      this.isLoading = false;
    });
  }

  /**
   * Remove user's JWT keys from local storage.
   */
  removeTokens() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('refresh');
  }

  /**
   * Decode the JWT access token.
   *
   * @return {json} The decoded access token.
   */
  decodeToken() {
    if (this.token == 'undefined' || !this.token) {
      return false;
    }

    let base64Url = this.token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');

    return JSON.parse(window.atob(base64));
  }

  /**
   * Redirects user to homepage if access token is set.
   */
  redirectIfLoggedIn() {
    if (this.token) {
      m.route.set('/');
    }
  }

  /**
   * Redirects user to login page if no access token is found.
   *
   * @param  {string} requestedPath The path to redirect back to.
   */
  redirectIfNotLoggedIn(requestedPath = '') {
    if (this.token == 'undefined' || !this.token) {
      window.localStorage.setItem('requestedPath', requestedPath);
      m.route.set('/account/login');
    }
  }

  /**
   * Returns the value of the JWT access token.
   *
   * @return {string} The access token.
   */
  getAccessToken() {
    const token = window.localStorage.getItem('token') || false;

    if (!token || token == 'undefined' || token == undefined) {
      return false;
    } else {
      return token;
    }
  }

  /**
   * Returns the value of the refresh token.
   *
   * @return {string} The refresh token.
   */
  getRefreshToken() {
    const token = window.localStorage.getItem('refresh') || false;

    if (!token || token == 'undefined' || token == undefined) {
      return false;
    } else {
      return token;
    }
  }
}
