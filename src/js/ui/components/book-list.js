'use strict';

import locale from './../locale';
import m from 'mithril';
import uri from 'urijs';
import getURLParam from './../../utils/get-url-params';

/**
 * Used to display a list of books with a pagination button.
 */
export default class BookList {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.page = Number(getURLParam('page')) || 1;
    this.fn_nextPage = false;
    this.books = false;
    this.meta = false;
    this.payload = false;
    this.isLoading = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.fn_nextPage = vnode.attrs.fn_nextPage;
    this.books = vnode.attrs.books;
    this.meta = vnode.attrs.meta;
    this.payload = vnode.attrs.payload;
    this.isLoading = vnode.attrs.isLoading;
  }

  /**
   * [nextPage description]
   * @return {[type]} [description]
   */
  nextPage() {
    if (this.meta.last_page == 0 || this.page == this.meta.last_page) {
      return false;
    }

    this.page = this.page + 1;

    window.history.pushState('', '',
        uri().setQuery('page', this.page).toString()
    );

    this.fn_nextPage(this.page, this.payload);
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    this.isLoading = vnode.attrs.isLoading;

    if (this.books) {
      return [
        m('.book-list.columns.is-multiline.is-mobile', [
          this.books.map((book) => {
            return m('.column.is-half-mobile.is-4-tablet.is-2-desktop', [
              m('.book-block', [
                m('a', {
                  href: '/book/' + book.slug,
                  title: locale.name(book.name),
                }, [
                  m('figure.image', [
                    m('img', {
                      alt: locale.t('accessibility.cover_art'),
                      src: (book.cover ?
                        book.cover.replace('.jpg', '-thumb.jpg')
                        : '/assets/no_cover.jpg'
                      ),
                    }),
                  ]),
                  m('.book-title', locale.name(book.name)),
                ]),
              ]),
            ]);
          }),
        ]),
        m('a', {
          href: uri().setQuery('page', this.page + 1).toString(),
          class: 'button is-fullwidth is-primary'
            + (this.isLoading ? ' is-loading' : ''),
          disabled: (this.meta.last_page == 0
            || this.page == this.meta.last_page ? true : false
            || this.isLoading
          ),
          onclick: (e) => {
            e.preventDefault();
            this.nextPage();
          },
        }, locale.t('buttons.load_more')),
      ];
    }
  }
}
