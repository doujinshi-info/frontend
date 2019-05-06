'use strict';

import {Auth} from './../../auth';

import locale from './../locale';
import m from 'mithril';

/**
 * Display tabs on tag and book info pages.
 */
export default class ContentTabs {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.auth = new Auth();

    this.slug = false;
    this.type = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.slug = vnode.attrs.slug;
    this.type = vnode.attrs.type;

    this.path = '/' + this.type + '/' + this.slug;
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    return m('.tabs.is-fullwidth', [
      m('ul', [
        m('li', {
          class: (m.route.get() == this.path ? 'is-active' : ''),
        }, m('a', {href: this.path},
            m('span', locale.t('tabs.information'))
        )),

        (this.type == 'tag' ? m('li', {
          class: (m.route.get() == this.path + '/stats' ? 'is-active' : ''),
        }, m('a', {href: this.path + '/stats'},
            m('span', locale.t('tabs.stats'))
        )) : ''),

        m('li', {
          class: (m.route.get() == this.path + '/changelog' ? 'is-active' : ''),
        }, m('a', {href: this.path + '/changelog'},
            m('span', locale.t('tabs.changelog'))
        )),

        (this.auth.token) && m('li', {
          class: (m.route.get() == this.path + '/edit' ? 'is-active' : ''),
        }, m('a', {href: this.path + '/edit'},
            m('span', locale.t('tabs.edit'))
        )),
      ]),
    ]);
  }
}
