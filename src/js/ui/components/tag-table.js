'use strict';

import locale from './../locale';
import m from 'mithril';

import TagLabels from './tag-labels';
import InfoLinks from './info-links';

/**
 * Basic information of a tag.
 */
export default class TagTable {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.tag = false;
    this.artists = false;
    this.circles = false;
    this.series = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.tag = vnode.attrs.tagData;
    this.artists = vnode.attrs.artists;
    this.circles = vnode.attrs.circles;
    this.series = vnode.attrs.series;
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    let content = null;

    if (this.tag) {
      content = [
        m('table.table.is-striped.is-fullwidth',
          m('tbody', [
            m('tr', [
                m('th', locale.t('fields.tag.type')),
                m('td', locale.name(this.tag.type.name)),
            ]),
            m('tr', [
                m('th', locale.t('fields.tag.name_original')),
                m('td', this.tag.name.japanese),
            ]),
            m('tr', [
                m('th', locale.t('fields.tag.name_romaji')),
                m('td', this.tag.name.romaji),
            ]),
            (this.tag.name.english ? m('tr', [
                m('th', locale.t('fields.tag.name_english')),
                m('td', this.tag.name.english),
            ]) : ''),
            (this.tag.aliases ? m('tr', [
                m('th', locale.t('fields.tag.name_other')),
                m('td', this.tag.aliases.join(', ')),
            ]) : ''),
            (this.tag.event ? m('tr', [
                m('th', locale.t('fields.tag.event_dates')),
                m('td', this.tag.event.date_start +
                (this.tag.event.date_start == this.tag.event.date_end ?
                  '' : ' ~ ' + this.tag.event.date_end)
                ),
            ]) : ''),
            (this.tag.description ? m('tr', [
                m('th', locale.t('fields.tag.description_english')),
                m('td', this.tag.description.english),
            ]) : ''),
            (this.tag.description ? m('tr', [
                m('th', locale.t('fields.tag.description_japanese')),
                m('td', (this.tag.description.japanese ?
                  this.tag.description.japanese
                : '')),
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
            (this.tag.links ? m('tr', [
              m('th', locale.t('fields.links.links')),
              m('td', m(InfoLinks, {links: this.tag.links})),
            ]) : ''),
            m('tr', [
                m('th', locale.t('history.created_at')),
                m('td', this.tag.created_at),
            ]),
            m('tr', [
                m('th', locale.t('history.updated_at')),
                m('td', this.tag.updated_at),
            ]),
          ])
        ),
      ];
    }

    return m('', content);
  }
}
