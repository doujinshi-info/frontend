'use strict';

import {Auth} from './../../../auth';
import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';
import getURLParam from './../../../utils/get-url-params';

// Models
import {Following} from './../../../model/following';

// View Components
import FollowList from './../../components/user-following';

/**
 * Users can view a list of the tags they follow.
 */
export default class UserFollowing extends BasePage {
  /**
   * Initialization of user's followed tags page.
   */
   constructor() {
    super(locale.t('navi.following'));

    this.following = new Following();
    this.auth = new Auth();

    this.page = Number(getURLParam('page')) || 1;
  }

  /**
   * On onitialization make sure the user is logged in and fetch followed tags.
   */
  oninit() {
    this.auth.redirectIfNotLoggedIn();
    this.following.fetch(this.auth.user.slug, this.page);
  }

  /**
   * Display followed tag list.
   * @return {Vnode}
   */
  view() {
    if (this.following.data != null && this.following.data.length) {
      return m('section.section', [
        m('h3.title.is-3', locale.t('navi.following')),
        m(FollowList, {tags: this.following.data, meta: this.following.meta}),
      ]);
    } else {
      if (!this.following.isLoading) {
        return m('section.section', m('.notification',
          locale.t('texts.empty.no_follows')
        ));
      }
    }
  }
}
