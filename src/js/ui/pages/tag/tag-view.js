'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';
import getURLParam from './../../../utils/get-url-params';

import {Auth} from './../../../auth';

// Models
import {Tag} from './../../../model/tag';

// View Components
import ContentTab from './../../components/content-tabs';
import BookList from './../../components/book-list';
import TagTable from './../../components/tag-table';
import RequestDeletion from './../../components/request-deletion';
import TagFollow from './../../components/tag-follow';

import getTagSet from './../../../utils/get-tag-set';

/**
 * View information about a specific tag.
 */
export default class TagView extends BasePage {
  /**
   * Initialization of tag information page.
   */
  constructor() {
    super();

    this.auth = new Auth();

    this.tag = new Tag();

    this.type = m.route.param('type');
    this.slug = m.route.param('slug');
    this.page = Number(getURLParam('page')) || 1;

    this.data = null;
    this.books = [];
    this.meta = false;
  }

  /**
   * Gets the tag's information based off the information in URL.
   *
   * @param  {integer} page The page of tags to fetch.
   * @return {Promise}
   */
  getTag(page) {
    return this.tag.fetch(this.type, this.slug, page).then(() => {
      Array.prototype.push.apply(this.books, this.tag.data.books.data);
      this.meta = this.tag.data.books.meta;
    });
  }

  /**
   * On initalization get the tag's information and set the page title.
   */
  oninit() {
    this.getTag(this.page).then(() => {
      this.data = this.tag.data;
      super.setTitle(locale.name(this.data.name));
    });
  }

  /**
   * Displays information about the tag.
   *
   * @return {Vnode}
   */
  view() {
    if (this.data) {
      return [
        m(ContentTab, {
          type: 'tag',
          slug: this.type + '/' + this.slug,
        }),

        m('section.section', [
          (this.auth.token) && m(TagFollow, {tagData: this.data}),
          m('h1.title.truncate-text', locale.name(this.data.name)),
          m('h2.subtitle.truncate-text', locale.subname(this.data.name)),

          // Basic tag information.
          m(TagTable, {
            tagData: this.data,
            artists: getTagSet('artist', this.tag.data.tags),
            circles: getTagSet('circle', this.tag.data.tags),
            series: getTagSet('series', this.tag.data.tags),
          }),

          // Books which have the tag being viewed.
          (this.books.length ? m(BookList, {
            books: this.books,
            meta: this.meta,
            fn_nextPage: this.getTag.bind(this),
            isLoading: this.tag.loading,
          }) : ''),

          // If logged in, show request deletion button.
          (this.auth.token) && m(RequestDeletion, {
            objectTitle: locale.name(this.data.name),
            type: 'tag',
            content: this.data.id,
            isDeletionBusy: this.tag.loading,
          }),
        ]),
      ];
    }
  }
}
