'use strict';

import m from 'mithril';
import locale from './../locale';

/**
 * The footer on every page.
 */
export default class Footer {
  /**
   * Inititalize the component.
   */
  constructor() {}

  /**
   * Display the footer.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    const pathname = vnode.attrs.pathname;

    return m('footer.footer', [
      m('.container-fluid', [
        m('.columns.is-mobile', [
          m('.footer-copyright.column', [
            m('p', [
              m.trust(process.env.APP_TITLE+' &copy; '+Date().substr(11, 4)),
            ]),
          ]),
          m('.column.has-text-right', [
            (locale.getLang() == 'ja' ?
              m('a.flag-icon.flag-icon-us', {
                href: process.env.EN_URL + pathname,
              })
              :
              m('a.flag-icon.flag-icon-jp', {
                href: process.env.JA_URL + pathname,
              })
            ),
          ]),
        ]),
      ]),
    ]);
  }
}
