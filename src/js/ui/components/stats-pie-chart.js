'use strict';

import locale from './../locale';
import m from 'mithril';

/**
 * Creates a pie chart
 */
export default class StatsPieChart {
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
   * Creates the chart.
   *
   * @param  {[type]} e       [description]
   * @param  {[type]} records [description]
   */
  createChart(e, records) {
    const amounts = records.map(function(record) {
      return record.amount;
    });

    const names = records.map(function(record) {
      return locale.name(record.name);
    });

    import('chart.js').then(module => {
      this.graph = new module.default(e, {
        type: 'pie',
        data: {
          datasets: [{
            data: amounts,
            backgroundColor: [
              '#1fc8db',
              '#fce473',
              '#42afe3',
              '#ed6c63',
              '#97cd76',
            ],
          }],
          labels: names,
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
          height: 300,
          width: 400,
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
