'use strict';

import {Auth} from './../../../auth';
import BasePage from './../base-page';

/**
 * Logs the user out of the site.
 */
export default class UserLogout extends BasePage {
  /**
   * Initialization of logout page.
   */
  constructor() {
    super('');
    this.auth = new Auth();
  }

  /**
   * Immediately perform a call to the logout endpoint.
   */
  oninit() {
    this.auth.logout().then(() => {
      document.location = '/';
    });
  }

  /**
   * No view to return.
   */
  view() {}
}
