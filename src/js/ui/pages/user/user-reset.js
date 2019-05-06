'use strict';

import {Auth} from './../../../auth';
import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// View Components
import UserResetForm from './../../components/user-reset-form';
import Alert from './../../components/alert';

/**
 * Password reset form.
 */
export default class UserReset extends BasePage {
  /**
   * Initialization of password reset page.
   */
  constructor() {
    super(locale.t('navi.reset_pass'));

    this.token = m.route.param('token');
    this.auth = new Auth();
  }

  /**
   * Initializtion when reset form is loading.
   * Check that user is not logged in.
   */
  oninit() {
    this.auth.redirectIfLoggedIn();
  }

  /**
   * After form has been submitted, display a success alert.
   */
  onupdate() {
    if (this.auth.data) {
      Alert.create('success', locale.t('texts.success.password_reset'));
    }
  }

  /**
   * Process reset form submission.
   *
   * @param  {Object} payload The data from the form.
   */
  processReset(payload) {
    this.auth.resetPassword(payload);
  }

  /**
   * Display the password reset form.
   *
   * @return {Vnode}
   */
  view() {
    return m('section.section', [
      m('h3.title.is-3', locale.t('navi.reset_pass')),
      m(UserResetForm, {
        token: this.token,
        fn_submit: this.processReset.bind(this),
        isPasswordResetBusy: this.auth.isLoading,
      }),
    ]);
  }
}
