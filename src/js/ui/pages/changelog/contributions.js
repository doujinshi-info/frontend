'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';
import getURLParam from './../../../utils/get-url-params';

// Model
import {Contribution} from './../../../model/contribution';

// View Components
import ListView from './../../components/contribution-list';

/**
 * List of all changes to the objects on the site.
 */
export default class ContributionList extends BasePage {
  /**
   * Initialization of changelog page.
   */
  constructor() {
    super(locale.t('navi.changelog'));

    this.contribution = new Contribution();

    this.page = Number(getURLParam('page')) || 1;
    this.data = null;
    this.meta = null;

    super.setDescription(locale.t('descriptions.changelog'));
  }

  /**
   * Get all contributions.
   */
  oninit() {
    this.contribution.fetchAll(this.page);
  }

  /**
   * Display a list of all contributions / changes.
   *
   * @return {Vnode}
   */
  view() {
    if (this.contribution.data) {
      return m('section.section', [
        m('h3.title.is-3', locale.t('navi.changelog')),
        m(ListView, {
          changes: this.contribution.data,
          meta: this.contribution.meta,
        }),
      ]);
    }
  }
}
