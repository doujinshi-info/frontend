'use strict';

import locale from './../locale';
import m from 'mithril';

/**
 * User login form
 */
export default class UserLoginForm {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.email = null;
    this.password = null;
    this.formAction = null;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.formAction = vnode.attrs.formAction;
  }

  /**
   * [onLoginButtonClick description]
   */
  onLoginButtonClick() {
    if (document.getElementById('login-form').checkValidity()) {
      this.formAction(this.email, this.password);
    } else {
      document.getElementById('login-form').reportValidity();
    }
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    const isBusy = vnode.attrs.isUserLoginBusy;

    return m('form', {id: 'login-form'}, [
      m('.field', [
        m('.control', [
          m('label.label', locale.t('email')),
          m('input.input', {
            name: 'email',
            oninput: m.withAttr('value', (v) => {
              this.email = v;
            }),
            value: this.email,
            type: 'email',
            required: true,
            placeholder: locale.t('email'),
            disabled: isBusy,
          }),
        ]),
      ]),
      m('.field', [
        m('.control', [
          m('label.label', locale.t('password')),
          m('input.input', {
            name: 'password',
            oninput: m.withAttr('value', (v) => {
              this.password = v;
            }),
            value: this.password,
            type: 'password',
            autocomplete: 'off',
            required: true,
            placeholder: locale.t('password'),
            disabled: isBusy,
          }),
        ]),
      ]),
      m('.field.is-grouped', [
        m('.control', [
          m('button', {
            class: 'button is-primary' + (isBusy ? ' is-loading' : ''),
            onclick: (e) => {
              e.preventDefault();
              this.onLoginButtonClick();
            },
            disabled: isBusy,
          }, locale.t('buttons.account_login')),
        ]),
        m('.control', [
          m('a', {
            href: '/account/forgot',
            class: 'button is-text' + (isBusy ? ' is-loading' : ''),
            disabled: isBusy,
          }, locale.t('hyperlinks.account_forgot')),
        ]),
      ]),
    ]);
  }
}
