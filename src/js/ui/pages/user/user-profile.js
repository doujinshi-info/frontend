'use strict';

import {Auth} from './../../../auth';
import BasePage from './../base-page';
import m from 'mithril';
import getURLParam from './../../../utils/get-url-params';
import locale from './../../locale';

// Models
import {User} from './../../../model/user';
import {UserCollection} from './../../../model/user-collection';
import {Contribution} from './../../../model/contribution';

// View Components
import ProfileTabs from './../../components/user-profile-tabs';
import UserInfo from './../../components/user-profile-info';
import UserLibrary from './../../components/user-library';
import ContributionList from './../../components/contribution-list';

/**
 * The user's personal profile page.
 */
export default class UserProfile extends BasePage {
  /**
   * Initialization of user's profile page.
   */
  constructor() {
    super();

    this.auth = new Auth();
    this.user = new User();
    this.collection = new UserCollection();
    this.contribution = new Contribution();

    this.query = getURLParam('q');
    this.slug = m.route.param('slug');
    this.content = m.route.param('content');
    this.page = Number(getURLParam('page')) || 1;
    this.private = false;

    this.books = [];
    this.meta = false;
  }

  /**
   * On initization get the user's info, library, wishlist and contributions.
   */
  oninit() {
    this.getUser();

    if (!this.content) {
    } else if (this.content == 'library') {
      this.getLibrary();
    } else if (this.content == 'wishlist') {
      this.getWishlist();
    } else if (this.content == 'contributions') {
      this.contribution.fetchUserChanges(this.slug, this.page);
    } else {
    }
  }

  /**
   * Get user's profile information and set display name as page title.
   */
  getUser() {
    this.user.getProfile(this.slug).then(() => {
      this.setTitle(this.user.data.display_name);
      this.private = (this.user.data.is_private == true ? true : false);
    });
  }

  /**
   * Get the user's library.
   */
  getLibrary() {
    this.collection.fetch('collection', this.slug, this.page, this.query)
    .then(() => {
      Array.prototype.push.apply(this.books, this.collection.data.data);
      this.meta = this.collection.data.meta;
    });
  }

  /**
   * Get the user's wishlist.
   */
  getWishlist() {
    this.collection.fetch('wishlist', this.slug, this.page, this.query)
    .then(() => {
      Array.prototype.push.apply(this.books, this.collection.data.data);
      this.meta = this.collection.data.meta;
    });
  }

  /**
   * Display the profile views.
   * @return {Vnode}
   */
  view() {
    if (this.private && this.user.data.id != this.auth.user.sub) {
      return [
        m(ProfileTabs, {slug: this.slug}),
        m('section.section', [
          m('.notification', locale.t('texts.profile_private')),
        ]),
      ];
    } else {
      return [
        m(ProfileTabs, {slug: this.slug}),
        m('section.section', [
          (this.user.data && !this.content)
            && m(UserInfo, {user: this.user.data}),

          (this.content == 'library' && this.collection.data && this.meta)
          && m(UserLibrary, {
            type: 'library',
            slug: this.slug,
            books: this.books,
            meta: this.meta,
            fn_nextPage: this.getLibrary.bind(this),
            isLoading: this.collection.isLoading,
          }),

          (this.content == 'wishlist' && this.collection.data && this.meta)
          && m(UserLibrary, {
            type: 'wishlist',
            slug: this.slug,
            books: this.books,
            meta: this.meta,
            fn_nextPage: this.getWishlist.bind(this),
            isLoading: this.collection.isLoading,
          }),

          (this.content == 'contributions' && this.contribution.data)
          && m(ContributionList, {
            changes: this.contribution.data,
            meta: this.contribution.meta,
          }),
        ]),
      ];
    }
  }
}
