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
      this.formData.name = this.user.name;
      this.formData.slug = this.user.slug;
      this.formData.email = this.user.email;
      this.formData.privacy = this.user.privacy;
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

  checkPasswords() {
    let passwordOld = document.getElementById('password');
    let password = document.getElementById('password_new');
    let passwordConfirm = document.getElementById('password_new_confirmation');

    if (password.value.length) {
      if (!passwordOld.value.length) {
        passwordOld.setCustomValidity(locale.t('texts.errors.required_field'));
      } else {
        passwordOld.setCustomValidity('');
      }

      if (passwordConfirm.value != password.value) {
        passwordConfirm.setCustomValidity(locale.t('texts.errors.password_mismatch'));
      } else {
        passwordConfirm.setCustomValidity('');
      }
    }
  }

  /**
   * Opening a tab dynamically.
   *
   * @param  {string} tabName The ID for which content to show.
   */
  openTab(tabName) {
    let x = document.getElementsByClassName('tab-content');

    for (let i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace('tab-shown', 'tab-hidden');
    }

    let tablinks = document.getElementsByClassName('tab');

    for (let i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' is-active', '');
    }

    let element = document.getElementById(tabName);

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
      m('.tabs.is-fullwidth',
        m('ul', [
          m('li.tab.is-active', {
            onclick: (e) => {
              e.currentTarget.className += ' is-active';
              this.openTab('profile');
            },
          },
            m('a', m('span', locale.t('tabs.profile')))
          ),
          m('li.tab', {
            onclick: (e) => {
              e.currentTarget.className += ' is-active';
              this.openTab('security');
            },
          },
            m('a', m('span', locale.t('tabs.security')))
          ),
        ])
      ),

      m('.tab-container', [
        m('.tab-content.tab-shown', {id: 'profile'}, [
          m('.field', [
            m('.control', [
              m('label.label', locale.t('username')),
              m('input.input', {
                oninput: m.withAttr('value', (v) => {
                  this.formData.name = v;
                }),
                value: this.formData.name,
                type: 'text',
                autocomplete: 'off',
                required: true,
                placeholder: locale.t('username'),
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
                      this.formData.privacy = e.currentTarget.value;
                    },
                    required: true,
                    disabled: vnode.attrs.isUserSettingBusy,
                  }, [
                    m('option', {
                      value: 'public',
                      selected: (this.formData.privacy === 'public'),
                    }, locale.t('fields.account.profile_public')),
                    m('option', {
                      value: 'private',
                      selected: (this.formData.privacy === 'private'),
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
