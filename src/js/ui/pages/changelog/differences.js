'use strict';

import {Auth} from './../../../auth';
import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// Model
import {Contribution} from './../../../model/contribution';

// View Components
import ChangeDiff from './../../components/contribution-diff';
import ChangeRevert from './../../components/contribution-revert';

/**
 * View the differences of a changelog entry.
 */
export default class ContributionDiff extends BasePage {
  /**
   * Initialization of changelog diff page.
   */
  constructor() {
    super(locale.t('history.changelog'));

    this.auth = new Auth();
    this.contribution = new Contribution();

    this.transaction = m.route.param('contribution');
  }

  /**
   * Get the changes for this contribution.
   */
  oninit() {
    this.contribution.fetch(this.transaction);
  }

  /**
   * Send an API called to revert a change.
   */
  revertChange() {
    this.contribution.revert(this.contribution.data.transaction_id).then(() => {
      window.history.back();
    });
  }

  /**
   * Display the differences on this specific change.
   *
   * @return {Vnode}
   */
  view() {
    if (this.contribution.data && (this.contribution.data.tag || this.contribution.data.book)) {
      return m('section.section', [
        m('nav.breadcrumb',
          m('ul', [
            // Tags
            (this.contribution.data.tag ? m('li', m('a', {
              href: '/tag',
            }, locale.t('navi.tags'))) : ''),

            (this.contribution.data.tag ? m('li', m('a', {
              href: '/tag/'+this.contribution.data.tag.type.slug,
            }, locale.name(this.contribution.data.tag.type.name))) : ''),

            (this.contribution.data.tag ? m('li', m('a', {
              href: '/tag/' + this.contribution.data.tag.type.slug + '/'
              + this.contribution.data.tag.slug,
            }, locale.name(this.contribution.data.tag.name))) : ''),

            (this.contribution.data.tag ? m('li', m('a', {
              href: '/tag/' + this.contribution.data.tag.type.slug + '/'
              + this.contribution.data.tag.slug+'/changelog',
            }, locale.t('tabs.changelog'))) : ''),

            // Doujinshi
            (this.contribution.data.book ? m('li', m('a', {
              href: '/',
            }, locale.t('doujinshi'))) : ''),

            (this.contribution.data.book ? m('li', m('a', {
              href: '/book/'+this.contribution.data.book.slug,
            }, locale.name(this.contribution.data.book.name))) : ''),

            (this.contribution.data.book ? m('li', m('a', {
              href: '/book/'+this.contribution.data.book.slug+'/changelog',
            }, locale.t('tabs.changelog'))) : ''),

            m('li.is-active', m('a', {
              href: '#',
            }, this.contribution.data.id)),
          ])
        ),

        m('h3.title.is-3', locale.t('history.differences')),

        m(ChangeDiff, {
          changes: this.contribution.data,
        }),

        (this.auth.user.is_mod || this.auth.user.is_admin ? m(ChangeRevert, {
          fn_submit: this.revertChange.bind(this),
          isLoading: this.contribution.isLoading,
        }) : ''),
      ]);
    }
  }
}
