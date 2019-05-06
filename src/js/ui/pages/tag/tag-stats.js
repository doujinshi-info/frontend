'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// Models
import {Tag} from './../../../model/tag';
import {Stats} from './../../../model/stats';

// View Components
import StatsTable from './../../components/stats-table';
import ContentTab from './../../components/content-tabs';
import StatsPieChart from './../../components/stats-pie-chart';
import StatsBarChart from './../../components/stats-bar-chart';
import bulmaCalendar from 'bulma-calendar';

import setTagMeta from './../../../utils/set-tag-meta';

/**
 * Stats of a specific tag.
 */
export default class TagStats extends BasePage {
  /**
   * Initialization of tag changelog page.
   */
  constructor() {
    super();

    this.tag = new Tag();
    this.stats = new Stats();

    this.type = m.route.param('type');
    this.slug = m.route.param('slug');

    this.startDate = null;
    this.endDate = null;
  }

  /**
   * Fetch tag on initialization.
   */
  oninit() {
    this.tag.fetch(this.type, this.slug).then(() => {
      setTagMeta(this.tag.data, 'descriptions.tag_stats');
      this.fetchStats(this.tag.data.id);
    });
  }

  /**
   * Fetch stats scoped by tag.
   *
   * @param  {string} tag The tag's ID.
   */
  fetchStats(tag) {
    this.stats.fetch(this.startDate, this.endDate, tag);
  }

  /**
   * Display the stats for a specific tag.
   *
   * @return {Vnode}
   */
  view() {
    if (this.tag.data && this.stats.data) {
      return [
        m(ContentTab, {
          type: 'tag',
          slug: this.type + '/' + this.slug,
        }),
        m('section.section', [
          m('h1.title.truncate-text', locale.name(this.tag.data.name)),
          m('h2.subtitle.truncate-text', locale.subname(this.tag.data.name)),
          m('.filter-container', [
            m('.filter-header', [
              m('a.button.is-white', {
                onclick: function(e) {
                  e.preventDefault();

                  const filterMenu = document.getElementById('filterMenu');
                  filterMenu.classList.toggle('is-hidden');
                },
              }, [
                m('span.icon.is-small', m('i.fa.fa-sliders-h')),
                m('span', locale.t('buttons.filter')),
              ]),
            ]),
            m('.filter-body.is-hidden', {id: 'filterMenu'}, [
              m('.field', [
                m('.control', [
                  m('label.label', locale.t('fields.book.release_date')),
                  m('input.input', {
                    oncreate: (e) => {
                      const cals = bulmaCalendar.attach('[type="date"]', {
                        showHeader: false,
                        isRange: true,
                        showFooter: false,
                        dateFormat: 'YYYY-MM-DD',
                        lang: locale.getLang(),
                      });

                      for (let i = 0; i < cals.length; i++) {
                        cals[i].on('select', (date) => {
                          const [start, end] = cals[i].value().split(' - ');

                          this.startDate = (start ? start : null);
                          this.endDate = (end ? end : null);
                          this.fetchStats(this.tag.data.id);
                        });

                        cals[i].on('clear', (e) => {
                          this.startDate = null;
                          this.endDate = null;
                          this.fetchStats(this.tag.data.id);
                        });
                      }
                    },
                    type: 'date',
                    autocomplete: 'off',
                    placeholder: locale.t('fields.book.release_date'),
                  }),
                ]),
              ]),
            ]),
          ]),
          m(StatsTable, {statsData: this.stats.data}),
          m('hr'),
          m('.columns.is-multiline', [
            m('.column.is-4', [
              m('h4.title.is-4', 'Most Works by Artist'),
              m(StatsBarChart, {
                id: 'artistChart',
                chartData: this.stats.data.volume.artists,
              }),
            ]),
            m('.column.is-4', [
              m('h4.title.is-4', 'Most Works by Circle'),
              m(StatsBarChart, {
                id: 'circleChart',
                chartData: this.stats.data.volume.circles,
              }),
            ]),
            m('.column.is-4', [
              m('h4.title.is-4', 'Most Works by Convention'),
              m(StatsBarChart, {
                id: 'conventionChart',
                chartData: this.stats.data.volume.conventions,
              }),
            ]),
          ]),
          m('.columns.is-multiline', [
            m('.column.is-4', [
              m('h4.title.is-4', 'Most Common Series'),
              m(StatsPieChart, {
                id: 'seriesChart',
                chartData: this.stats.data.volume.series,
              }),
            ]),
            m('.column.is-4', [
              m('h4.title.is-4', 'Most Common Characters'),
              m(StatsPieChart, {
                id: 'charactersChart',
                chartData: this.stats.data.volume.characters,
              }),
            ]),
            m('.column.is-4', [
              m('h4.title.is-4', 'Most Common Content'),
              m(StatsPieChart, {
                id: 'contentChart',
                chartData: this.stats.data.volume.contents,
              }),
            ]),
          ]),
        ]),
      ];
    }
  }
}
