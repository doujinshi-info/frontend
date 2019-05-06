'use strict';

import locale from './../locale';
import m from 'mithril';

/**
 * User settings form for changing password and email.
 */
export default class UserSettingsForm {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.formAction = false;
    this.formData = {};
    this.user = false;
  }

  /**
   * Populate the information passed from the page module.
   *
   * @param  {Vnode} vnode The Vnode from the page module.
   */
  oninit(vnode) {
    this.user = vnode.attrs.userData;
    this.formAction = vnode.attrs.formAction;

    if (this.user) {
      this.formData.display_name = this.user.display_name;
      this.formData.user_name = this.user.user_name;
      this.formData.slug = this.user.slug;
      this.formData.email = this.user.email;
      this.formData.is_private = this.user.is_private;
    }
  }

  /**
   * Process the form's information when submit button is pressed.
   *
   * @param  {event} e The button click event.
   */
  onSaveButtonClick(e) {
    e.preventDefault();

    this.checkPasswords();

    if (document.getElementById('settings-form').checkValidity()) {
      this.formAction(this.formData);
    } else {
      document.getElementById('settings-form').reportValidity();
    }
  }

  /**
   * Checks that new password is not the same as old password.
   */
  checkPasswords() {
    const passwordOld = document.getElementById('password');
    const password = document.getElementById('password_new');
    const passConfirm = document.getElementById('password_new_confirmation');

    if (password.value.length) {
      if (!passwordOld.value.length) {
        passwordOld.setCustomValidity(locale.t('texts.errors.required_field'));
      } else {
        passwordOld.setCustomValidity('');
      }

      if (passConfirm.value != password.value) {
        passConfirm.setCustomValidity(
            locale.t('texts.errors.password_mismatch')
        );
      } else {
        passConfirm.setCustomValidity('');
      }
    }
  }

  /**
   * Opening a tab dynamically.
   *
   * @param  {string} tabName The ID for which content to show.
   */
  openTab(tabName) {
    const x = document.getElementsByClassName('tab-content');

    for (let i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace('tab-shown', 'tab-hidden');
    }

    const tablinks = document.getElementsByClassName('tab');

    for (let i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' is-active', '');
    }

    const element = document.getElementById(tabName);

    if (element) {
      element.className = element.className.replace('tab-hidden', 'tab-shown');
    }
  }

  /**
   * The form view.
   *
   * @param  {Vnode} vnode The vnode element.
   * @return {Vnode}
   */
  view(vnode) {
    return m('form', {id: 'settings-form'}, [
      m('.tabs.is-fullwidth', m('ul', [
        m('li.tab.is-active', {
          onclick: (e) => {
            e.currentTarget.className += ' is-active';
            this.openTab('profile');
          },
        }, m('a', m('span', locale.t('tabs.profile')))),
        m('li.tab', {
          onclick: (e) => {
            e.currentTarget.className += ' is-active';
            this.openTab('security');
          },
        }, m('a', m('span', locale.t('tabs.security')))),
      ])),

      m('.tab-container', [
        m('.tab-content.tab-shown', {id: 'profile'}, [
          m('.field', [
            m('.control', [
              m('label.label', locale.t('fields.account.display_name')),
              m('input.input', {
                oninput: m.withAttr('value', (v) => {
                  this.formData.display_name = v;
                }),
                value: this.formData.display_name,
                type: 'text',
                autocomplete: 'off',
                required: true,
                placeholder: locale.t('fields.account.display_name'),
                disabled: vnode.attrs.isUserSettingBusy,
              }),
            ]),
          ]),
          m('.field', [
            m('.control', [
              m('label.label', locale.t('fields.account.user_name')),
              m('input.input', {
                oninput: m.withAttr('value', (v) => {
                  this.formData.user_name = v;
                }),
                value: this.formData.user_name,
                type: 'text',
                autocomplete: 'off',
                required: true,
                placeholder: locale.t('fields.account.user_name'),
                disabled: vnode.attrs.isUserSettingBusy,
              }),
            ]),
          ]),
          m('.field', [
            m('.control', [
              m('label.label', locale.t('email')),
              m('input.input', {
                oninput: m.withAttr('value', (v) => {
                  this.formData.email = v;
                }),
                value: this.formData.email,
                type: 'email',
                autocomplete: 'off',
                required: true,
                placeholder: locale.t('email'),
                disabled: vnode.attrs.isUserSettingBusy,
              }),
            ]),
          ]),
          m('.field', [
            m('.control', [
              m('label.label', locale.t('fields.account.profile_privacy')),
              m('.select', [
                m('select', {
                  onchange: (e) => {
                    this.formData.is_private = e.currentTarget.value;
                  },
                  required: true,
                  disabled: vnode.attrs.isUserSettingBusy,
                }, [
                  m('option', {
                    value: 0,
                    selected: (this.formData.is_private == false),
                  }, locale.t('fields.account.profile_public')),
                  m('option', {
                    value: 1,
                    selected: (this.formData.is_private == true),
                  }, locale.t('fields.account.profile_private')),
                ]),
              ]),
            ]),
          ]),
        ]),
        m('.tab-content.tab-hidden', {id: 'security'}, [
          m('.field', [
            m('.control', [
              m('label.label', locale.t('fields.account.password')),
              m('input.input', {
                id: 'password',
                oninput: m.withAttr('value', (v) => {
                  this.formData.password = v;
                }),
                value: this.formData.password,
                type: 'password',
                autocomplete: 'off',
                placeholder: locale.t('fields.account.password'),
                disabled: vnode.attrs.isUserSettingBusy,
              }),
            ]),
          ]),
          m('.field', [
            m('.control', [
              m('label.label', locale.t('fields.account.password_new')),
              m('input.input', {
                id: 'password_new',
                oninput: m.withAttr('value', (v) => {
                  this.formData.new_password = v;
                }),
                value: this.formData.new_password,
                type: 'password',
                autocomplete: 'off',
                placeholder: locale.t('fields.account.password_new'),
                disabled: vnode.attrs.isUserSettingBusy,
              }),
            ]),
          ]),
          m('.field', [
            m('.control', [
              m('label.label', locale.t('fields.account.password_confirm')),
              m('input.input', {
                id: 'password_new_confirmation',
                oninput: m.withAttr('value', (v) => {
                  this.formData.new_password_confirmation = v;
                }),
                value: this.formData.new_password_confirmation,
                type: 'password',
                autocomplete: 'off',
                placeholder: locale.t('fields.account.password_confirm'),
                disabled: vnode.attrs.isUserSettingBusy,
              }),
            ]),
          ]),
        ]),
      ]),

      m('.field', [
        m('.control', [
          m('button', {
            class: 'button is-primary'
              + (vnode.attrs.isUserSettingBusy ? ' is-loading' : ''),
            onclick: (e) => {
              this.onSaveButtonClick(e);
            },
            disabled: vnode.attrs.isUserSettingBusy,
          }, locale.t('buttons.save_settings')),
        ]),
      ]),
    ]);
  }
}
