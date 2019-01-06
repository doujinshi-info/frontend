'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

/**
 * 404 - Not Found
 */
export default class MiscNotFound extends BasePage {
  /**
   * Initialization of 404 page.
   */
  constructor() {
    super(locale.t('texts.errors.not_found'));
  }

  /**
   * Display 404 not found page error.
   *
   * @return {Vnode}
   */
  view() {
    return m('section.section', [
      m('h3.title.is-3', locale.t('texts.errors.not_found')),
    ]);
  }
}
