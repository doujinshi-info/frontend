'use strict';

import {Auth} from './../../../auth';
import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// View Components
import UserLoginForm from './../../components/user-login-form';

/**
 * Display a form that allows users to login.
 */
export default class UserLogin extends BasePage {
  /**
   * Initialization of user login page.
   */
  constructor() {
    super(locale.t('navi.login'));

    this.auth = new Auth();
  }

  /**
   * On initization make sure user is not logged in.
   */
  oninit() {
    this.auth.redirectIfLoggedIn();
  }

  /**
   * Process login form submission.
   *
   * @param  {string} email    The user's email address.
   * @param  {string} password The user's password.
   */
  processLogin(email, password) {
    this.auth.login(email, password);
  }

  /**
   * Display the login form.
   * @return {Vnode}
   */
  view() {
    return m('section.section', [
      m('h3.title.is-3', locale.t('navi.login')),
      m(UserLoginForm, {
        formAction: this.processLogin.bind(this),
        isUserLoginBusy: this.auth.isLoading,
      }),
    ]);
  }
}
