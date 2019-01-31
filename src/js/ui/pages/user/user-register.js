'use strict';

import {Auth} from './../../../auth';
import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// View Compoents
import UserRegistrationForm from './../../components/user-registration-form';

/**
 * Registration page.
 */
export default class UserRegister extends BasePage {
  /**
   * Initialization of user registration page.
   */
  constructor() {
    super(locale.t('navi.register'));
    super.setDescription(locale.t('descriptions.user_register'));
    this.auth = new Auth();
  }

  /**
   * On initialization make sure user is not logged in.
   */
  oninit() {
    this.auth.redirectIfLoggedIn();
  }

  /**
   * Process user registration form submission.
   *
   * @param  {Object} payload The data from the registration form.
   */
  processForm(payload) {
    this.auth.create(payload);
  }

  /**
   * Display the user registration form.
   *
   * @return {Vnode}
   */
  view() {
    return m('section.section', [
      m('h3.title.is-3', locale.t('navi.register')),
      m(UserRegistrationForm, {
        isUserRegistrationBusy: this.auth.isLoading,
        formAction: this.processForm.bind(this),
      }),
    ]);
  }
}
