'use strict';

import locale from './../locale';
import m from 'mithril';

/**
 * Password reset form.
 */
export default class UserResetForm {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.fn_submit = false;
    this.formData = {};
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.formData = {
      token: vnode.attrs.token,
      email: '',
      password: '',
      password_confirmation: '',
    };

    this.fn_submit = vnode.attrs.fn_submit;
  }

  /**
   * [onSubmitButtonClick description]
   * @param  {[type]} e [description]
   */
  onSubmitButtonClick(e) {
    e.preventDefault();

    if (document.getElementById('reset-form').checkValidity()) {
      this.fn_submit(this.formData);
    } else {
      document.getElementById('reset-form').reportValidity();
    }
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    return m('form', {id: 'reset-form'}, [
      m('.field',
          m('.control', [
            m('label.label', locale.t('fields.account.email')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.email = v;
              }),
              value: this.formData.email,
              type: 'email',
              autocomplete: 'off',
              required: true,
              placeholder: locale.t('fields.account.email'),
              disabled: vnode.attrs.isPasswordResetBusy,
            }),
          ])
      ),
      m('.field',
          m('.control', [
            m('label.label', locale.t('fields.account.password_new')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.password = v;
              }),
              value: this.formData.password,
              type: 'password',
              autocomplete: 'off',
              required: true,
              placeholder: locale.t('fields.account.password_new'),
              disabled: vnode.attrs.isPasswordResetBusy,
            }),
          ])
      ),
      m('.field',
          m('.control', [
            m('label.label', locale.t('fields.account.password_confirm')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.password_confirmation = v;
              }),
              value: this.formData.password_confirmation,
              type: 'password',
              autocomplete: 'off',
              required: true,
              placeholder: locale.t('fields.account.password_confirm'),
              disabled: vnode.attrs.isPasswordResetBusy,
            }),
          ])
      ),
      m('input', {
        type: 'hidden',
        value: this.formData.token,
      }),
      m('.control', [
        m('button', {
          class: 'button is-primary'
            + (vnode.attrs.isPasswordResetBusy ? ' is-loading' : ''),
          onclick: this.onSubmitButtonClick,
          disabled: vnode.attrs.isPasswordResetBusy,
        }, locale.t('buttons.password_change')),
      ]),
    ]);
  }
}
