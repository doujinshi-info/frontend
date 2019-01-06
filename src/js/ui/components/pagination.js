'use strict';

import m from 'mithril';
import locale from './../locale';

/**
 * Creates paginated navigation
 */
export default class Pagination {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.meta = false;
  }

  /**
   * [renderPage description]
   * @param  {[type]}   current [description]
   * @param  {Function} next    [description]
   * @param  {[type]}   text    [description]
   * @return {[type]}           [description]
   */
  renderPage(current, next, text) {
    return m('li', m('a', {
      class: 'pagination-link' + (next == current ? ' is-current' : ''),
      href: '?page=' + next,
    }, text));
  }

  /**
   * Creates the paginated links.
   *
   * @param  {[type]} meta [description]
   * @return {[type]}      [description]
   */
  createPages(meta) {
    let pages = [];

    if (meta.last_page > 7) {
      for (let i = 1; i <= meta.last_page; i++) {
        if (meta.current_page < 4) {
          if (i > 5) {
            if (i > 7) {
              continue;
            }

            if (i === 6) {
              pages.push(
                m('li', m('span.pagination-ellipsis', m.trust('&hellip;')))
              );
            } else {
              pages.push(
                this.renderPage(
                  meta.current_page,
                  meta.last_page,
                  meta.last_page
                )
              );
            }
          } else {
            pages.push(this.renderPage(meta.current_page, i, i));
          }
        } else if (
          meta.current_page > 3 && meta.current_page <= meta.last_page - 4
        ) {
          if (i < 3) {
            if (i === 2) {
              pages.push(
                m('li', m('span.pagination-ellipsis', m.trust('&hellip;')))
              );
            } else {
              pages.push(this.renderPage(meta.current_page, 1, 1));
            }

            continue;
          }

          if (
            i < meta.current_page - 1 ||
            (i > meta.current_page + 1 && i <= meta.last_page -2)
          ) {
            continue;
          }

          if (i > meta.last_page - 2) {
            if (meta.last_page - 1 === i) {
              pages.push(
                m('li', m('span.pagination-ellipsis', m.trust('&hellip;')))
              );
            } else {
              pages.push(this.renderPage(meta.current_page, i, i));
            }

            continue;
          }

          pages.push(this.renderPage(meta.current_page, i, i));
        } else if (meta.current_page > meta.last_page - 4) {
          if (i < 3) {
            pages.push(
              m('li', m('span.pagination-ellipsis', m.trust('&hellip;')))
            );
          }

          if (i >= meta.last_page - 4) {
            pages.push(this.renderPage(meta.current_page, i, i));
          }
        }
      }
    } else {
      for (let i = 1; i <= meta.last_page; i++) {
        pages.push(this.renderPage(meta.current_page, i, i));
      }
    }

    return pages;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.meta = vnode.attrs.meta;
  }

  /**
   * Display the pagination links.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}      [description]
   */
  view(vnode) {
    if (this.meta) {
      return m('nav.pagination.is-centered', [
        m('a.pagination-previous', {
          href: (this.meta.current_page > 1 ?
            '?page=' + (this.meta.current_page - 1) : ''
          ),
          disabled: (this.meta.current_page == 1 ? true : false),
        }, locale.t('pagination.previous')),

        m('a.pagination-next', {
          href: (this.meta.current_page != this.meta.last_page ?
            '?page=' + (this.meta.current_page + 1) : ''
          ),
          disabled: (this.meta.last_page == 0
            || this.meta.current_page == this.meta.last_page
            ? true : false
          ),
        }, locale.t('pagination.next')),

        m('ul.pagination-list', this.createPages(this.meta)),
      ]);
    }
  }
}
