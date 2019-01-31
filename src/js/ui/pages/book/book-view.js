'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

import {Auth} from './../../../auth';

// Models
import {Book} from './../../../model/book';

// View Components
import BookCollectionButtons from './../../components/user-collection-buttons';
import ContentTab from './../../components/content-tabs';
import BookImages from './../../components/book-images';
import BookTable from './../../components/book-table';
import RequestDeletion from './../../components/request-deletion';

import getTagSet from './../../../utils/get-tag-set';
import setBookMeta from './../../../utils/set-book-meta';

/**
 * View information about a specific book / doujinshi.
 */
export default class BookView extends BasePage {
  /**
   * Initialization of book information page.
   */
  constructor() {
    super();

    this.auth = new Auth();
    this.book = new Book();
    this.slug = m.route.param('slug');

    this.circles = false;
    this.artists = false;
  }

  /**
   * Initialization
   * Get book information
   */
  oninit() {
    this.book.fetch(this.slug).then(() => {
      setBookMeta(this.book.data);
    });
  }

  /**
   * View book information
   *
   * @return {Vnode} [description]
   */
  view() {
    if (this.book.data) {
      return [
        // If user is logged in show edit and changelog tabs.
        (this.auth.token) && m(ContentTab, {type: 'book', slug: this.slug}),

        m('section.section', [
          // User collection actions
          (this.auth.token) && m(BookCollectionButtons, {
            bookData: this.book.data,
          }),

          // Book Titles
          m('h1.title.truncate-text', (this.book.data)
            && locale.name(this.book.data.name)
          ),

          m('h2.subtitle.truncate-text', (this.book.data)
            && locale.subname(this.book.data.name)
          ),

          // Book Images
          m('.columns', [
            m('.column.is-one-quarter.has-text-centered', [
              m(BookImages, {
                cover: this.book.data.cover,
                samples: this.book.data.samples,
              }),
            ]),

            // Book information
            m('.column', [
              // Basic information
              m(BookTable, {
                bookData: this.book.data,
                artists: getTagSet('artist', this.book.data.tags),
                circles: getTagSet('circle', this.book.data.tags),
                series: getTagSet('series', this.book.data.tags),
                characters: getTagSet('character', this.book.data.tags),
                contents: getTagSet('content', this.book.data.tags),
                language: getTagSet('language', this.book.data.tags),
                censoring: getTagSet('censoring', this.book.data.tags),
                convention: getTagSet('convention', this.book.data.tags),
              }),
            ]),
          ]),

          // If user is logged in, allow them to submit deletion requests.
          (this.auth.token ? m(RequestDeletion, {
            objectTitle: locale.name(this.book.data.name),
            type: 'book',
            content: this.book.data.id,
            isDeletionBusy: this.book.isLoading,
          }) : ''),
        ]),
      ];
    }
  }
}
