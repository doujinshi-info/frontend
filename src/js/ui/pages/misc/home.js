'use strict';

import BasePage from './../base-page';
import m from 'mithril';

import getURLParam from './../../../utils/get-url-params';

// Models
import {Book} from './../../../model/book';

// View Components
import BookList from './../../components/book-list';

/**
 * The homepage of the site.
 */
export default class MiscHome extends BasePage {
  /**
   * Initialization of homepage.
   */
  constructor() {
    super();

    this.book = new Book();
    this.page = Number(getURLParam('page')) || 1;

    this.books = [];
    this.meta = false;
  }

  /**
   * Get most recent doujinshi added during initialzation.
   */
  oninit() {
    this.getBooks(this.page);
  }

  /**
   * Trigger the API call to get the most recent doujinshi.
   *
   * @param  {integer} page The page to get data from.
   */
  getBooks(page) {
    this.book.fetchAll(page).then(() => {
      Array.prototype.push.apply(this.books, this.book.data.data);
      this.meta = this.book.data.meta;
    });
  }

  /**
   * Display a grid of the most recent doujinshi.
   *
   * @return {Vnode}
   */
  view() {
    if (this.books) {
      return m('section.section', [
        m(BookList, {
          books: this.books,
          meta: this.meta,
          fn_nextPage: this.getBooks.bind(this),
          isLoading: this.book.isLoading,
        }),
      ]);
    }
  }
}
