'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

// Models
import {Tag} from './../../../model/tag';
import {TagType} from './../../../model/tag-type';

// View Components
import TagForm from './../../components/tag-form';

/**
 * Tag creation form.
 */
export default class TagCreate extends BasePage {
  /**
   * Initialization of tag creation page.
   */
  constructor() {
    super(locale.t('navi.create_tag'));

    this.tag = new Tag();
    this.types = new TagType();
  }

  /**
   * Fetch all the tag types.
   */
  oninit() {
    this.types.fetchAll();
  }

  /**
   * Process the tag creation form submission.
   *
   * @param  {object} payload The data from the form.
   */
  createTag(payload) {
    this.tag.create(payload).then(() => {
      if (this.tag.data) {
        m.route.set('/tag/'+this.tag.data.type.slug+'/'+this.tag.data.slug);
      }
    });
  }

  /**
   * Display the tag creation form.
   *
   * @return {Vnode}
   */
  view() {
    if (this.types.data) {
      return m('section.section', [
        m('h3.title.is-3', locale.t('navi.create_tag')),
        m(TagForm, {
          types: this.types.data,
          isLoading: this.tag.isLoading,
          fn_submitTag: this.createTag.bind(this),
        }),
      ]);
    }
  }
}
