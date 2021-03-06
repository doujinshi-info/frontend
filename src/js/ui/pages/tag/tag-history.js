'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// Models
import {Tag} from './../../../model/tag';
import {Contribution} from './../../../model/contribution';

// View Components
import ContentTab from './../../components/content-tabs';
import setTagMeta from './../../../utils/set-tag-meta';

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
      setTagMeta(this.tag.data, 'descriptions.tag_changelog');
    });

    this.contribution.fetchTagChanges(this.type, this.slug);
  }

  /**
   * Display the tag's changelog list.
   * @return {Vnode}
   */
  view() {
    const changes = [];

    if (this.contribution.data && this.contribution.data.length) {
      this.contribution.data.forEach(function(change) {
        changes.push(
            m('tr', [
              m('td', {
                'data-th': locale.t('history.transaction'),
              }, m('a', {href: '/changelog/' + change.id}, change.id)),
              m('td', {
                'data-th': locale.t('history.type'),
              }, locale.t('history.' + change.type)),
              m('td', {'data-th': locale.t('history.contributor')},
                  (change.user.slug == 'system' ? change.user.name : m('a', {
                    href: '/profile/' + change.user.slug,
                  }, change.user.name))
              ),
              m('td', {
                'data-th': locale.t('history.created_at'),
              }, change.created_at),
            ])
        );
      });

      return [
        m(ContentTab, {
          type: 'tag',
          slug: this.type + '/' + this.slug,
        }),
        m('section.section', [
          m('table.table.is-striped.is-fullwidth.responsive-table', [
            m('thead', [
              m('tr', [
                m('th', locale.t('history.transaction')),
                m('th', locale.t('history.type')),
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
