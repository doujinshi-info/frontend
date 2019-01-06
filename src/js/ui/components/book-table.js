'use strict';

import locale from './../locale';
import m from 'mithril';

import TagLabels from './tag-labels';
import InfoLinks from './info-links';

/**
 * Displays basic information about a doujinshi.
 */
export default class ContentTabs {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.book = false;
    this.artists = false;
    this.circles = false;
    this.series = false;
    this.characters = false;
    this.contents = false;
    this.language = false;
    this.censoring = false;
    this.convention = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.book = vnode.attrs.bookData;
    this.artists = vnode.attrs.artists;
    this.circles = vnode.attrs.circles;
    this.series = vnode.attrs.series;
    this.characters = vnode.attrs.characters;
    this.contents = vnode.attrs.contents;
    this.language = vnode.attrs.language;
    this.censoring = vnode.attrs.censoring;
    this.convention = vnode.attrs.convention;
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    let content = false;

    if (this.book) {
      content = [
        m('table.table.is-striped.is-fullwidth.book-table',
          m('tbody', [
            m('tr', [
              m('th', locale.t('fields.book.name_original')),
              m('td', this.book.name.japanese),
            ]),
            m('tr', [
              m('th', locale.t('fields.book.name_romaji')),
              m('td', this.book.name.romaji),
            ]),
            (this.book.name.english ? m('tr', [
              m('th', locale.t('fields.book.name_english')),
              m('td', this.book.name.english),
            ]) : ''),
            (this.book.date_released ? m('tr', [
              m('th', locale.t('fields.book.release_date')),
              m('td', this.book.date_released),
            ]) : ''),
            (this.book.price ? m('tr', [
              m('th', locale.t('fields.book.price')),
              m('td', [
                m.trust('&yen; '),
                this.book.price,
              ]),
            ]) : ''),
            (this.book.pages ? m('tr', [
              m('th', locale.t('fields.book.pages')),
              m('td', this.book.pages),
            ]) : ''),
            m('tr', [
              m('th', locale.t('fields.book.is_adult')),
              m('td', (this.book.is_adult ?
                locale.t('yes') : locale.t('no'))
              ),
            ]),
            m('tr', [
              m('th', locale.t('fields.book.is_anthology')),
              m('td', (this.book.is_anthology ?
                locale.t('yes') : locale.t('no'))
              ),
            ]),
            m('tr', [
              m('th', locale.t('fields.book.is_copybook')),
              m('td', (this.book.is_copybook ?
                locale.t('yes') : locale.t('no'))
              ),
            ]),
            m('tr', [
              m('th', locale.t('fields.book.is_novel')),
              m('td', (this.book.is_novel ?
                locale.t('yes') : locale.t('no'))
              ),
            ]),
            (this.language ? m('tr', [
              m('th', locale.t('fields.book.language')),
              m('td', m(TagLabels, {tags: this.language})),
            ]) : ''),
            (this.censoring ? m('tr', [
              m('th', locale.t('fields.book.censoring')),
              m('td', m(TagLabels, {tags: this.censoring})),
            ]) : ''),
            (this.convention ? m('tr', [
              m('th', locale.t('convention')),
              m('td', m(TagLabels, {tags: this.convention})),
            ]) : ''),
            (this.artists ? m('tr', [
              m('th', locale.t('artist')),
              m('td', m(TagLabels, {tags: this.artists})),
            ]) : ''),
            (this.circles ? m('tr', [
              m('th', locale.t('circle')),
              m('td', m(TagLabels, {tags: this.circles})),
            ]) : ''),
            (this.series ? m('tr', [
              m('th', locale.t('series')),
              m('td', m(TagLabels, {tags: this.series})),
            ]) : ''),
            (this.characters ? m('tr', [
              m('th', locale.t('character')),
              m('td', m(TagLabels, {tags: this.characters})),
            ]) : ''),
            (this.contents ? m('tr', [
              m('th', locale.t('content')),
              m('td', m(TagLabels, {tags: this.contents})),
            ]) : ''),
            (this.book.links ? m('tr', [
              m('th', locale.t('fields.links.links')),
              m('td', m(InfoLinks, {links: this.book.links})),
            ]) : ''),
            m('tr', [
              m('th', locale.t('history.created_at')),
              m('td', this.book.created_at),
            ]),
            m('tr', [
              m('th', locale.t('history.updated_at')),
              m('td', this.book.updated_at),
            ]),
          ])
        ),
      ];
    }

    return m('', content);
  }
}
