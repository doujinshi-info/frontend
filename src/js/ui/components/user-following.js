'use strict';

import m from 'mithril';
import locale from './../locale';
import paginate from './pagination';

/**
 * Followed tags list
 */
export default class UserFollowing {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.tags = false;
    this.meta = false;
    this.data = [];
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.tags = vnode.attrs.tags;
    this.meta = vnode.attrs.meta;
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    if (this.tags) {
      this.tags.forEach((tag) => {
        this.data.push(m('tr', [
          m('td',
            m('a', {
              href: '/tag/'+ tag.type.slug +'/'+ tag.slug,
            }, locale.name(tag.name))
          ),
          m('td',
            m('a', {
              href: '/tag/'+ tag.type.slug,
            }, locale.name(tag.type.name))
          ),
        ]));
      });

      return m('', [
        m('table.table.is-striped.is-fullwidth', [
          m('thead', [
            m('tr', [
              m('th', locale.t('tag')),
              m('th', locale.t('fields.tag.type')),
            ]),
          ]),
          m('tbody', this.data),
        ]),
        m(paginate, {meta: this.meta}),
      ]);
    }
  }
}
