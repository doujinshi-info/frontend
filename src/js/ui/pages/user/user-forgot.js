'use strict';

import {Auth} from './../../../auth';
import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// View Components
import UserForgotForm from './../../components/user-forgot-form';

/**
 * Users can request a password reset link if they forgot their password.
 */
export default class UserForgot extends BasePage {
  /**
   * Initialization of forgot password page.
   */
  constructor() {
    super(locale.t('navi.forgot_pass'));
    super.setDescription(locale.t('descriptions.user_forgot'));
    this.auth = new Auth();
  }

  /**
   * On initialization make sure user is not logged in.
   */
  oninit() {
    this.auth.redirectIfLoggedIn();
  }

  /**
   * Process the forgot password request form.
   *
   * @param {string} email The user's unique email address.
   * @return {Promise}
   */
  processReset(email) {
    return this.auth.forgotPassword(email);
  }

  /**
   * Display the forgot password form.
   * @return {Vnode}
   */
  view() {
    return m('section.section', [
      m('h3.title.is-3', locale.t('navi.forgot_pass')),
      m(UserForgotForm, {
        fn_submit: this.processReset.bind(this),
        isPasswordForgotBusy: this.auth.isLoading,
      }),
    ]);
  }
}
