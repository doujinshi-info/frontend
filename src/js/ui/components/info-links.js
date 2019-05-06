'use strict';

import locale from './../locale';
import m from 'mithril';

/**
 * Links that are part of books and tags.
 */
export default class Link {
  /**
   * Display the link.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    const links = vnode.attrs.links;
    const tokens = [];

    if (links) {
      for (const type in links) {
        if (links[type]) {
          tokens.push(
              m('a.tag.is-small.is-link', {
                href: links[type],
                target: '_blank',
              }, locale.t('fields.links.'+type))
          );
        }
      }

      if (tokens.length) {
        return m('.tags', tokens);
      }
    }

    return false;
  }
}
