'use strict';

import m from 'mithril';

/**
 * Reusable link creator.
 */
export default class Link {
  /**
   * Display the link.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    if (vnode.attrs.onclick) {
      return m('a', {
        className: vnode.attrs.className,
        href: vnode.attrs.to,
        onclick: vnode.attrs.onclick,
      }, vnode.children);
    }

    return m('a', {
      className: vnode.attrs.className,
      href: vnode.attrs.to,
    }, vnode.children);
  }
}
