'use strict';

import locale from './../locale';
import m from 'mithril';

/**
 * Displays interesting stats.
 */
export default class StatsTable {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.stats = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.stats = vnode.attrs.statsData;
  }

  /**
   * Display the stats table.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    let content = false;

    this.stats = vnode.attrs.statsData;

    if (this.stats) {
      content = [
        m('table.table.is-striped.is-fullwidth',
            m('tbody', [
              m('tr', [
                m('th', locale.t('stats.total_doujinshi')),
                m('td', this.stats.total.doujinshi),
              ]),
              m('tr', [
                m('th', locale.t('stats.total_tags')),
                m('td', this.stats.total.tags),
              ]),
              m('tr', [
                m('th', locale.t('stats.total_circles')),
                m('td', this.stats.total.circles),
              ]),
              m('tr', [
                m('th', locale.t('stats.total_artists')),
                m('td', this.stats.total.artists),
              ]),
              m('tr', [
                m('th', locale.t('stats.total_contents')),
                m('td', this.stats.total.contents),
              ]),
              m('tr', [
                m('th', locale.t('stats.total_series')),
                m('td', this.stats.total.series),
              ]),
              m('tr', [
                m('th', locale.t('stats.total_characters')),
                m('td', this.stats.total.characters),
              ]),
              m('tr', [
                m('th', locale.t('stats.total_conventions')),
                m('td', this.stats.total.conventions),
              ]),
              m('tr', [
                m('th', locale.t('stats.total_collections')),
                m('td', this.stats.total.collections),
              ]),
              m('tr', [
                m('th', locale.t('stats.average_price')),
                m('td', [m.trust('&yen; '), this.stats.average_price]),
              ]),
              m('tr', [
                m('th', locale.t('stats.average_pages')),
                m('td', this.stats.average_pages),
              ]),
              m('tr', [
                m('th', locale.t('stats.original_ratio')),
                m('td', this.stats.original_ratio),
              ]),
            ])
        ),
      ];
    }

    return m('', content);
  }
}
