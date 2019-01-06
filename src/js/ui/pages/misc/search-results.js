'use strict';

import BasePage from './../base-page';
import m from 'mithril';
import getURLParam from './../../../utils/get-url-params';
import locale from './../../locale';

// Models
import {Book} from './../../../model/book';

// View Components
import BookList from './../../components/book-list';

/**
 * The search results page.
 */
export default class MiscSearch extends BasePage {
  /**
   * Initialization of search results page.
   */
  constructor() {
    super('Search: ' + getURLParam('q'));

    this.book = new Book();

    this.query = getURLParam('q');
    this.page = Number(getURLParam('page')) || 1;

    this.books = [];
    this.meta = false;
  }

  /**
   * Get the search results on initalization.
   */
  oninit() {
    if (this.query) {
      this.getBooks(this.page, {query: this.query});
    }
  }

  /**
   * Get the search results.
   *
   * @param  {integer} page The page to get data from.
   * @param  {object} payload     The search terms to search by.
   * @return {Promise}
   */
  getBooks(page, payload) {
    return this.book.search(payload.query, page).then(() => {
      Array.prototype.push.apply(this.books, this.book.data.data);
      this.meta = this.book.data.meta;
    });
  }

  /**
   * Display the search results.
   *
   * @return {Vnode}
   */
  view() {
    if (this.books) {
      if (this.meta.total > 0) {
        return m('section.section', [
          m(BookList, {
            books: this.books,
            meta: this.meta,
            fn_nextPage: this.getBooks.bind(this),
            payload: {query: this.query},
            isLoading: this.book.isLoading,
          }),
        ]);
      } else {
        return m('section.section', [
          m('.notification.has-text-centered',
            locale.t('texts.empty.no_results')
          ),
        ]);
      }
    }
  }
}
