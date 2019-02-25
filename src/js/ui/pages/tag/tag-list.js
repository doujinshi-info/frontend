'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';
import getURLParam from './../../../utils/get-url-params';

// Model
import {Tag} from './../../../model/tag';

// View Components
import TagListView from './../../components/tag-list';

/**
 * List of all tags.
 */
export default class TagList extends BasePage {
  /**
   * Initialization of tag list page.
   */
  constructor() {
    super(locale.t('navi.tags'));

    this.tag = new Tag();

    this.type = m.route.param('type') || false;
    this.page = Number(getURLParam('page')) || 1;
    this.query = getURLParam('q') || false;

    const subTitle = (this.type ? ' : ' + locale.t(this.type) : '');

    super.setTitle(locale.t('tags') + subTitle);
  }

  /**
   * On initialization fetch all tags.
   */
  oninit() {
    if (this.query) {
      this.tag.search(this.type, this.query, this.page);
    } else {
      this.tag.fetchAll(this.type, this.page);
    }
  }

  /**
   * Display the list of tags.
   *
   * @return {Vnode}
   */
  view() {
    if (this.tag.data) {
      return m('section.section', [
        m('h3.title.is-3', locale.t('navi.tags')),

        m(TagListView, {
          tags: this.tag.data,
          meta: this.tag.meta,
        }),
      ]);
    }
  }
}
