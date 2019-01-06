'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// Models
import {Tag} from './../../../model/tag';
import {Contribution} from './../../../model/contribution';

// View Components
import ContentTab from './../../components/content-tabs';

/**
 * Changelog of a specific tag.
 */
export default class TagHistory extends BasePage {
  /**
   * Initialization of tag changelog page.
   */
  constructor() {
    super();

    this.tag = new Tag();
    this.contribution = new Contribution();

    this.type = m.route.param('type');
    this.slug = m.route.param('slug');
  }

  /**
   * On initalization fetch the tag's information and set the history.
   */
  oninit() {
    this.tag.fetch(this.type, this.slug).then(() => {
      super.setTitle(locale.name(this.tag.data.name));
    });

    this.contribution.fetchTagChanges(this.type, this.slug);
  }

  /**
   * Display the tag's changelog list.
   * @return {Vnode}
   */
  view() {
    let changes = [];

    if (this.contribution.data && this.contribution.data.length) {
      this.contribution.data.forEach(function(change) {
        changes.push(
          m('tr', [
            m('td', m('a', {href: '/changelog/' + change.id}, change.id)),
            m('td', locale.t('history.' + change.type)),
            m('td', (change.user.slug == 'system' ? change.user.name : m('a', {
              href: '/profile/' + change.user.slug,
            }, change.user.name))),
            m('td', change.created_at),
          ])
        );
      });

      return [
        m(ContentTab, {
          type: 'tag',
          slug: this.type + '/' + this.slug,
        }),
        m('section.section', [
          m('table.table.is-striped.is-fullwidth.is-responsive', [
            m('thead', [
              m('tr', [
                m('th', 'Transaction'),
                m('th', 'Type'),
                m('th', 'Contributor'),
                m('th', 'Created At'),
              ]),
            ]),
            m('tbody', changes),
          ]),
        ]),
      ];
    } else {
      return [
        m(ContentTab, {
          type: 'tag',
          slug: this.type + '/' + this.slug,
        }),
        m('section.section',
          m('.notification', locale.t('texts.empty.changes'))
        ),
      ];
    }
  }
}
