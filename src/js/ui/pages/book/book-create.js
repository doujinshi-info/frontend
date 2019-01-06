'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// Models
import {Book} from './../../../model/book';
import {Tag} from './../../../model/tag';

// Components
import BookForm from './../../components/book-form';

/**
 * Create a new book / doujinshi object.
 */
export default class BookCreate extends BasePage {
  /**
   * Initialization of book creation page.
   */
  constructor() {
    super(locale.t('navi.create_doujinshi'));

    this.tag = new Tag();
    this.book = new Book();

    this.languages = null;
    this.censorings = null;

    this.data = null;
  }

  /**
   * Process book creation submission.
   *
   * @param {object} book - Existing book object.
   * @param {object} payload - The data from the form.
   */
  createBook(book, payload) {
    this.book.create(payload).then(() => {
      if (this.book.data) {
        m.route.set('/book/'+this.book.data.slug);
      }
    });
  }

  /**
   * Initialization
   */
  oninit() {
    this.tag.fetchAll('language').then(() => {
      this.languages = this.tag.data;
    });

    this.tag.fetchAll('censoring').then(() => {
      this.censorings = this.tag.data;
    });
  }

  /**
   * Book creation form view
   *
   * @return {Vnode} [description]
   */
  view() {
    if (this.censorings && this.languages) {
      return [
        m('section.section', [
          m('h3.title.is-3', locale.t('navi.create_doujinshi')),
          m(BookForm, {
            isCreateBookBusy: this.book.isLoading,
            fn_bookAction: this.createBook.bind(this),
            languages: this.languages,
            censorings: this.censorings,
          }),
        ]),
      ];
    }
  }
}
