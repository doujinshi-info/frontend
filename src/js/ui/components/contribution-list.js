'use strict';

import locale from './../locale';
import paginate from './pagination';
import m from 'mithril';
import getURLParam from './../../utils/get-url-params';

/**
 * Displays a list of changes.
 */
export default class ContributionList {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.currentPage = false;
    this.last_page = false;
    this.changes = false;
    this.meta = false;
    this.last_page = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.currentPage = Number(getURLParam('page')) || 1;
    this.changes = vnode.attrs.changes;
    this.meta = vnode.attrs.meta;
    this.last_page = vnode.attrs.meta.last_page;
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    let object = null;
    let content = null;
    const tokens = [];

    if (this.changes) {
      this.changes.forEach(function(change) {
        if (change.tag) {
          object = m('a', {
            href: '/tag/'+change.tag.type.slug+'/'+change.tag.slug,
          }, locale.name(change.tag.name));
        }

        if (change.book) {
          object = m('a', {
            href: '/book/'+change.book.slug,
          }, locale.name(change.book.name));
        }

        tokens.push(
            m('tr', [
              m('td', {'data-th': locale.t('history.transaction')},
                  m('a', {href: '/changelog/'+change.id}, change.id)
              ),
              m('td', {'data-th': locale.t('history.object_type')},
                  (change.tag ? locale.t('tag') : locale.t('doujinshi'))
              ),
              m('td', {'data-th': locale.t('history.object')}, object),
              m('td', {'data-th': locale.t('history.type')},
                  locale.t('history.' + change.type)
              ),
              m('td', {
                'data-th': locale.t('history.amount'),
                'class': (Math.sign(change.amount) === 1 ?
                  'has-text-success' : 'has-text-danger'
                ),
              }, change.amount),
              m('td', {
                'data-th': locale.t('history.contributor'),
              }, (change.user != null ? m('a', {
                href: '/profile/'+change.user.slug,
              }, change.user.display_name) : '')),
              m('td', {
                'data-th': locale.t('history.created_at'),
              }, change.created_at),
            ])
        );
      });

      content = m('table.table.is-striped.is-fullwidth.responsive-table', [
        m('thead', [
          m('tr', [
            m('th', locale.t('history.transaction')),
            m('th', locale.t('history.object_type')),
            m('th', locale.t('history.object')),
            m('th', locale.t('history.type')),
            m('th', locale.t('history.amount')),
            m('th', locale.t('history.contributor')),
            m('th', locale.t('history.created_at')),
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
