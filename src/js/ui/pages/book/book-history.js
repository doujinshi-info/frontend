'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// Models
import {Book} from './../../../model/book';
import {Contribution} from './../../../model/contribution';

// View Components
import ContentTab from './../../components/content-tabs';

/**
 * View changelog of a specific book / doujinshi.
 */
export default class BookHistory extends BasePage {
  /**
   * Initialization of book changelog page.
   */
  constructor() {
    super();

    this.book = new Book();
    this.contribution = new Contribution();

    this.slug = m.route.param('slug');
  }

  /**
   * Initialization of page.
   */
  oninit() {
    // Get book information
    this.book.fetch(this.slug).then(() => {
      super.setTitle(locale.name(this.book.data.name));
    });

    // Get book changelog
    this.contribution.fetchBookChanges(this.slug);
  }

  /**
   * View changelog list
   *
   * @return {Vnode} [description]
   */
  view() {
    let changes = [];

    if (this.contribution.data) {
      this.contribution.data.forEach(function(change) {
        changes.push(
          m('tr', [
            m('td', m('a', {
              href: '/changelog/' + change.id,
            }, change.id)),

            m('td', locale.t('history.' + change.type)),

            m('td', {
              class: (Math.sign(change.amount) === 1 ?
                'has-text-success' : 'has-text-danger'
              ),
            }, change.amount),

            m('td', (change.user.slug == 'system' ? change.user.name : m('a', {
              href: '/profile/'+change.user.slug,
            }, change.user.name))),

            m('td', change.created_at),
          ])
        );
      });

      return [
        m(ContentTab, {type: 'book', slug: this.slug}),
        m('section.section', [
          m('table.table.is-striped.is-fullwidth.is-responsive', [
            m('thead', [
              m('tr', [
                m('th', locale.t('history.transaction')),
                m('th', locale.t('history.type')),
                m('th', locale.t('history.amount')),
                m('th', locale.t('history.contributor')),
                m('th', locale.t('history.created_at')),
              ]),
            ]),
            m('tbody', changes),
          ]),
        ]),
      ];
    } else {
      return [
        m(ContentTab, {type: 'book', slug: this.slug}),
        m('section.section', [
          m('.notification', locale.t('texts.empty.changes')),
        ]),
      ];
    }
  }
}
