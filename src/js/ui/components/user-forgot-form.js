'use strict';

import locale from './../locale';
import m from 'mithril';
import Alert from './alert';

/**
 * Forgot password form
 */
export default class UserForgotForm {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.fn_submit = false;
    this.formData = {};
    this.isLoading = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.fn_submit = vnode.attrs.fn_submit;
    this.isLoading = vnode.attrs.isPasswordForgotBusy;
  }

  /**
   * [onSubmitButtonClick description]
   * @param  {[type]} e [description]
   */
  onSubmitButtonClick(e) {
    e.preventDefault();

    if (document.getElementById('forgot-form').checkValidity()) {
      this.fn_submit(this.formData.email).then(() => {
        Alert.create('success', locale.t('texts.success.password_requested'));
      });
    } else {
      document.getElementById('forgot-form').reportValidity();
    }
  }

  /**
   * [view description]
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    return m('form', {id: 'forgot-form'}, [
      m('.field', [
        m('.control', [
          m('label.label', locale.t('email')),
          m('input.input', {
            oninput: m.withAttr('value', (v) => {
              this.formData.email = v;
            }),
            value: this.formData.email,
            type: 'email',
            required: true,
            placeholder: locale.t('email'),
            disabled: this.isLoading,
          }),
        ]),
      ]),
      m('.field.is-grouped', [
        m('.control', [
          m('button', {
            class: 'button is-primary' + (this.isLoading ? ' is-loading' : ''),
            onclick: this.onSubmitButtonClick,
            disabled: this.isLoading,
          }, locale.t('buttons.forgot_pass')),
        ]),
        m('.control', [
          m('a', {
            href: '/account/login',
            class: 'button is-text' + (this.isLoading ? ' is-loading' : ''),
            disabled: this.isLoading,
          }, locale.t('hyperlinks.account_login')),
        ]),
      ]),
    ]);
  }
}
