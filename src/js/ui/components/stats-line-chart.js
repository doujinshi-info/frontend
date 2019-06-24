'use strict';

import locale from './../locale';
import m from 'mithril';

/**
 * Creates a line chart.
 */
export default class StatsLineChart {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.id = false;
    this.data = false;
    this.graph = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.id = vnode.attrs.id;
    this.data = vnode.attrs.chartData;
  }

  /**
   * Create the chart.
   *
   * @param  {[type]} e       [description]
   * @param  {[type]} records [description]
   */
  createChart(e, records) {
    const amounts = records.map(function(record) {
      return record.count;
    });

    const names = records.map(function(record) {
      return record.month;
    });

    import('chart.js').then(module => {
      this.graph = new module.default(e, {
        type: 'line',
        data: {
          datasets: [{
            data: amounts,
            backgroundColor: '#1fc8db',
            borderColor: '#1fc8db',
          }],
          labels: names,
        },
        options: {
          legend: {
            display: false,
          },
        },
      });
    });
  }

  /**
   * Displays the chart.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    let content = null;

    this.id = vnode.attrs.id;
    this.data = vnode.attrs.chartData;

    if (this.graph) {
      this.graph.destroy();
      this.createChart(document.getElementById(this.id), this.data);
    }

    if (this.data && this.data.length) {
      content = [
        m('canvas', {
          height: 100,
          width: 700,
          id: this.id,
          oncreate: (e) => {
            this.createChart(document.getElementById(this.id), this.data);
          },
        }),
      ];
    } else {
      content = [
        m('.notification', locale.t('texts.empty.no_data')),
      ];
    }

    return m('', content);
  }
}
