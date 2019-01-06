'use strict';

import {Auth} from './../../../auth';
import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// Models
import {User} from './../../../model/user';

// View Components
import UserSettingsForm from './../../components/user-settings-form';

/**
 * The user settings page allows users to change their information.
 */
class UserSettings extends BasePage {
  /**
   * Initialization of User Settings page.
   */
   constructor() {
    super(locale.t('settings.settings'));

    this.user = new User();
    this.auth = new Auth();
  }

  /**
   * Initialization of settings page. Make sure user is logged in and get
   * their details.
   */
  oninit() {
    this.auth.redirectIfNotLoggedIn();
    this.user.getUserDetails(this.auth.token);
  }

  /**
   * Process setting form submission.
   *
   * @param  {Object} formData The data from the form.
   */
  processSettings(formData) {
    this.user.updateSettings(this.auth.user.slug, formData);
  }

  /**
   * Display user settings form.
   *
   * @return {Vnode}
   */
  view() {
    if (this.user.data != null) {
      return m('section.section', [
        m('h3.title.is-3', locale.t('settings.settings')),
        m(UserSettingsForm, {
          formAction: this.processSettings.bind(this),
          userData: this.user.data,
          isUserSettingBusy: this.user.isLoading,
        }),
      ]);
    }
  }
}

export default UserSettings;
