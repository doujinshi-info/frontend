'use strict';

import locale from './../locale';
import m from 'mithril';

/**
 * Displays a button that allows change reverting.
 */
export default class ChangeRevert {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.fn_submit = false;
    this.isLoading = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.fn_submit = vnode.attrs.fn_submit;
    this.isLoading = vnode.attrs.isLoading;
  }

  /**
   * [onSubmitButtonClick description]
   * @param  {[type]} e [description]
   */
  onSubmitButtonClick() {
    this.fn_submit();
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    return [
      m('.column', [
        m('p.control.has-text-right', [
          m('a.button.is-danger.is-small'
            + (this.isLoading ? '.is-loading' : ''), {
            onclick: (e) => {
              e.preventDefault();
              this.onSubmitButtonClick();
            },
            disabled: this.isLoading,
          }, [
            m('span.icon.is-small', m('i.fa.fa-undo')),
            m('span', locale.t('buttons.history_revert')),
          ]),
        ]),
      ]),
    ];
  }
}
