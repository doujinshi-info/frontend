'use strict';

import m from 'mithril';
import locale from './../locale';

/**
 * Displays an error if user is using an old browser.
 */
export default class OldBrowser {
  /**
   * Renders the alert message.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    const version = this.detectIE();

    if (version !== false) {
      if (version < 11) {
        return m('div', {'class': 'notification is-danger'},
            m.trust(locale.t('old_browser'))
        );
      }
    }
  }

  /**
   * Detects if user is using a version of IE.
   *
   * @return {integer} The version number of their browser.
   */
  detectIE() {
    const ua = window.navigator.userAgent;

    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      const rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    const edge = ua.indexOf('Edge/');
    if (edge > 0) {
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    return false;
  }
}
