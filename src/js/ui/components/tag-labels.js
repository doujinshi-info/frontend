'use strict';

import Link from './link';
import locale from './../locale';
import m from 'mithril';

/**
 * Displays a tag as a little tag / pill object.
 */
export default class TagLabels {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.tags = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.tags = vnode.attrs.tags;
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    const tokens = [];

    if (this.tags != false) {
      this.tags.forEach(function(tag) {
        tokens.push(
            m(Link, {
              className: 'tag is-small is-link',
              to: '/tag/'+ tag.type.slug +'/'+ tag.slug,
            }, locale.name(tag.name))
        );
      });

      return m('.tags', tokens);
    }

    return false;
  }
}
