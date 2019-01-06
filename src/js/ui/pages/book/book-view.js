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
      /*
      setBookMeta(this.book);
      let pageTitle = locale.name(this.book.data.name);

      // Categorize tags
      this.circles = this.book.getTagSet('circle');
      this.artists = this.book.getTagSet('artist');

      if (this.circles) {
        pageTitle = '[' + locale.name(this.circles[0].name) + '] ' + pageTitle;
      }

      super.setTitle(pageTitle);
      super.setImage(this.book.data.cover);

      super.setDescription(locale.t('descritions.book', {
        adult: (this.book.data.is_adult ? 'R18 ' : ''),
        book: locale.name(this.book.data.name),
        artist: (this.book.data.artists ?
          locale.name(this.book.data.artists.data[0].name) : ''),
      }));

      let keywords = [
        locale.t('doujinshi')
      ];

      (this.book.data.is_adult) && keywords.push('R18');
      (this.book.data.is_anthology)
        && keywords.push(locale.t('fields.book.is_anthology'));
      (this.book.data.is_copybook)
        && keywords.push(locale.t('fields.book.is_copybook'));
      (this.book.data.is_novel)
        && keywords.push(locale.t('fields.book.is_novel'));

      if (this.book.data.artists) {
        this.book.data.artists.data.forEach(function(tag) {
          keywords.push(locale.name(tag.name));
        });
      }

      if (this.book.data.circles) {
        this.book.data.circles.data.forEach(function(tag) {
          keywords.push(locale.name(tag.name));
        });
      }

      if (this.book.data.series) {
        this.book.data.series.data.forEach(function(tag) {
          keywords.push(locale.name(tag.name));
        });
      }

      super.setKeywords(keywords);

      super.setSocialMeta();
      */
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
