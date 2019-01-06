'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// Models
import {Tag} from './../../../model/tag';
import {TagType} from './../../../model/tag-type';

// View Components
import ContentTab from './../../components/content-tabs';
import TagForm from './../../components/tag-form';

/**
 * Tag modification form.
 */
export default class TagEdit extends BasePage {
  /**
   * Initialization of tag modification page.
   */
  constructor() {
    super();

    this.type = m.route.param('type');
    this.slug = m.route.param('slug');

    this.tag = new Tag();
    this.types = new TagType();
  }

  /**
   * On initalization fetch all tag types and the current tag info.
   */
  oninit() {
    this.types.fetchAll();

    this.tag.fetch(this.type, this.slug).then(() => {
      super.setTitle(locale.name(this.tag.data.name));
    });
  }

  /**
   * Process the tag editting form submission.
   *
   * @param  {object} payload The data from the form.
   */
  updateTag(payload) {
    this.tag.update(this.type, this.slug, payload).then(() => {
      if (this.tag.data) {
        m.route.set('/tag/' + this.type + '/' + this.slug);
      }
    });
  }

  /**
   * Display the tag editting form.
   *
   * @return {Vnode}
   */
  view() {
    if (this.tag.data) {
      return [
        m(ContentTab, {type: 'tag', slug: this.type + '/' + this.slug}),
        m('section.section', [
          m(TagForm, {
            types: this.types.data,
            tagData: this.tag.data,
            isCreateTagBusy: this.tag.isLoading,
            fn_submitTag: this.updateTag.bind(this),
          }),
        ]),
      ];
    }
  }
}
