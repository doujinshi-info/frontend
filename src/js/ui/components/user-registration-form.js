'use strict';

import locale from './../locale';
import m from 'mithril';

/**
 * User registration form.
 */
export default class UserResetForm {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.formAction = null;
    this.formData = {};
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.formData = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    };

    this.formAction = vnode.attrs.formAction;
  }

  /**
   * Make sure password confirmation matches password.
   */
  checkPasswords() {
    const password = document.getElementById('password');
    const passConfirm = document.getElementById('password_confirmation');

    if (passConfirm.value != password.value) {
      passConfirm.setCustomValidity(locale.t('texts.errors.password_mismatch'));
    } else {
      passConfirm.setCustomValidity('');
    }
  }

  /**
   * [onRegisterButtonClick description]
   * @param  {[type]} e [description]
   */
  onRegisterButtonClick() {
    this.checkPasswords();

    if (document.getElementById('registration-form').checkValidity()) {
      this.formAction(this.formData);
    } else {
      document.getElementById('registration-form').reportValidity();
    }
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    const isBusy = vnode.attrs.isUserRegistrationBusy;

    return m('form', {id: 'registration-form'}, [
      m('.field', [
        m('.control', [
          m('input.input', {
            name: 'display_name',
            oninput: m.withAttr('value', (v) => {
              this.formData.display_name = v;
            }),
            value: this.formData.display_name,
            type: 'text',
            autocomplete: 'off',
            required: true,
            placeholder: locale.t('fields.account.display_name'),
            disabled: isBusy,
          }),
        ]),
      ]),
      m('.field', [
        m('.control', [
          m('input.input', {
            name: 'user_name',
            oninput: m.withAttr('value', (v) => {
              this.formData.user_name = v;
            }),
            value: this.formData.user_name,
            type: 'text',
            autocomplete: 'off',
            required: true,
            placeholder: locale.t('fields.account.user_name'),
            disabled: isBusy,
          }),
        ]),
      ]),
      m('.field', [
        m('.control', [
          m('input.input', {
            name: 'email',
            oninput: m.withAttr('value', (v) => {
              this.formData.email = v;
            }),
            value: this.formData.email,
            type: 'email',
            required: true,
            placeholder: locale.t('fields.account.email'),
            disabled: isBusy,
          }),
        ]),
      ]),
      m('.field', [
        m('.control', [
          m('input.input', {
            id: 'password',
            name: 'password',
            oninput: m.withAttr('value', (v) => {
              this.formData.password = v;
            }),
            value: this.formData.password,
            type: 'password',
            autocomplete: 'off',
            required: true,
            placeholder: locale.t('fields.account.password'),
            disabled: isBusy,
          }),
        ]),
      ]),
      m('.field', [
        m('.control', [
          m('input.input', {
            id: 'password_confirmation',
            name: 'password_confirmation',
            oninput: m.withAttr('value', (v) => {
              this.formData.password_confirmation = v;
            }),
            value: this.formData.password_confirmation,
            type: 'password',
            autocomplete: 'off',
            required: true,
            placeholder: locale.t('fields.account.password_confirm'),
            disabled: isBusy,
          }),
        ]),
      ]),
      m('.field.is-grouped', [
        m('.control', [
          m('button', {
            onclick: (e) => {
              e.preventDefault();
              this.onRegisterButtonClick();
            },
            class: 'button is-primary'+ (isBusy ? ' is-loading' : ''),
            disabled: isBusy,
          }, locale.t('buttons.account_register')),
        ]),
        m('.control', [
          m('a', {
            href: '/account/login',
            class: 'button is-text'+ (isBusy ? ' is-loading' : ''),
            disabled: isBusy,
          }, locale.t('hyperlinks.account_exists')),
        ]),
      ]),
    ]);
  }
}
