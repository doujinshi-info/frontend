'use strict';

import locale from './../locale';
import paginate from './pagination';
import m from 'mithril';
import getURLParam from './../../utils/get-url-params';

/**
 * Displays a list of tags.
 */
export default class TagList {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.currentPage = false;
    this.last_page = false;
    this.tags = false;
    this.meta = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.currentPage = Number(getURLParam('page')) || 1;

    this.last_page = vnode.attrs.meta.last_page;
    this.tags = vnode.attrs.tags;
    this.meta = vnode.attrs.meta;
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    let content = null;
    const tokens = [];

    if (this.tags) {
      this.tags.forEach(function(tag) {
        tokens.push(
            m('tr', [
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
              m('td', tag.created_at),
              m('td', tag.updated_at),
            ])
        );
      });

      content = m('table.table.is-striped.is-fullwidth', [
        m('thead', [
          m('tr', [
            m('th', locale.t('tag')),
            m('th', locale.t('fields.tag.type')),
            m('th', locale.t('history.created_at')),
            m('th', locale.t('history.updated_at')),
          ]),
        ]),
        m('tbody', tokens),
      ]);
    }

    return m('', [
      content,
      m(paginate, {meta: this.meta}),
    ]);
  }
}
