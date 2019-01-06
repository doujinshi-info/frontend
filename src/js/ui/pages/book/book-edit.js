'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// Models
import {Book} from './../../../model/book';
import {Tag} from './../../../model/tag';

// Components
import ContentTab from './../../components/content-tabs';
import BookForm from './../../components/book-form';

import getTagSet from './../../../utils/get-tag-set';

/**
 * Modify an existing book / doujinshi.
 */
export default class BookEdit extends BasePage {
  /**
   * Initialization of book modification page.
   */
  constructor() {
    super();

    this.book = new Book();
    this.tag = new Tag();

    this.languages = null;
    this.censorings = null;

    this.slug = m.route.param('slug');
  }

  /**
   * Send form data to Book Update call.
   *
   * @param  {object} book - The existing book object.
   * @param  {object} payload - The data from the form.
   */
  updateBook(book, payload) {
    this.book.update(this.slug, payload).then(() => {
      if (this.book.data) {
        m.route.set('/book/'+this.book.data.slug);
      }
    });
  }

  /**
   * Get data for form.
   */
  oninit() {
    this.tag.fetchAll('language').then(() => {
      this.languages = this.tag.data;
    });

    this.tag.fetchAll('censoring').then(() => {
      this.censorings = this.tag.data;
    });

    this.book.fetch(this.slug).then(() => {
      super.setTitle(locale.name(this.book.data.name));
    });
  }

  /**
   * Book editting form.
   *
   * @return {Vnode} [description]
   */
  view() {
    if (this.book.data) {
      return [
        m(ContentTab, {type: 'book', slug: this.slug}),
        m('section.section', [
          m(BookForm, {
            bookData: this.book.data,

            artists: getTagSet('artist', this.book.data.tags),
            circles: getTagSet('circle', this.book.data.tags),
            series: getTagSet('series', this.book.data.tags),
            characters: getTagSet('character', this.book.data.tags),
            contents: getTagSet('content', this.book.data.tags),
            language: getTagSet('language', this.book.data.tags),
            censoring: getTagSet('censoring', this.book.data.tags),
            convention: getTagSet('convention', this.book.data.tags),

            isCreateBookBusy: this.book.isLoading,
            fn_bookAction: this.updateBook.bind(this),
            languages: this.languages,
            censorings: this.censorings,
          }),
        ]),
      ];
    }
  }
}
