'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// Models
import {Stats} from './../../../model/stats';

// View Components
import StatsTable from './../../components/stats-table';
import StatsPieChart from './../../components/stats-pie-chart';
import StatsBarChart from './../../components/stats-bar-chart';
import StatsLineChart from './../../components/stats-line-chart';
import bulmaCalendar from 'bulma-calendar';
import moment from 'moment';

/**
 * Statistical information on the data.
 */
export default class MiscStats extends BasePage {
  /**
   * Initialization of stats page.
   */
  constructor() {
    super(locale.t('navi.stats'));

    this.stats = new Stats();

    this.startDate = null;
    this.endDate = null;

    super.setDescription(locale.t('descriptions.statistics'));
  }

  /**
   * Fetch the stats on initialization.
   */
  oninit() {
    this.fetchStats();
  }

  /**
   * Fetch the stats from api.
   */
  fetchStats() {
    this.stats.fetch(this.startDate, this.endDate);
  }

  /**
   * Display the stats and graphs.
   *
   * @return {Vnode}
   */
  view() {
    if (this.stats.data) {
      return m('section.section', [
        m('h3.title.is-3', locale.t('navi.stats')),

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
                    const calendars = bulmaCalendar.attach('[type="date"]', {
                      showHeader: false,
                      isRange: true,
                    });

                    for (let i = 0; i < calendars.length; i++) {
                      calendars[i].on('date:selected', (date) => {
                        this.startDate = (date.start ?
                          moment(date.start).format('YYYY-MM-DD')
                        : null);

                        this.endDate = (date.end ?
                          moment(date.end).format('YYYY-MM-DD')
                        : null);

                        this.fetchStats();
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
        m('.columns.is-multiline', [
          m('.column.is-12', [
            m('h4.title.is-4', 'Contributions'),
            m(StatsLineChart, {
              id: 'contributionHistory',
              chartData: this.stats.data.community.contributions,
            }),
          ]),
        ]),
      ]);
    }
  }
}
