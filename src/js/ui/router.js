'use strict';

import m from 'mithril';

import {Auth} from './../auth';

import LayoutDefault from './layouts/default';

import BookCreate from './pages/book/book-create';
import BookImport from './pages/book/book-import';
import BookEdit from './pages/book/book-edit';
import BookView from './pages/book/book-view';
import BookHistory from './pages/book/book-history';

import MiscAbout from './pages/misc/about';
import MiscHome from './pages/misc/home';
import MiscNotFound from './pages/misc/not-found';
import MiscSearch from './pages/misc/search-results';
import MiscStats from './pages/misc/stats';

import TagCreate from './pages/tag/tag-create';
import TagEdit from './pages/tag/tag-edit';
import TagList from './pages/tag/tag-list';
import TagView from './pages/tag/tag-view';
import TagHistory from './pages/tag/tag-history';
import TagStats from './pages/tag/tag-stats';

import UserForgot from './pages/user/user-forgot';
import UserLogin from './pages/user/user-login';
import UserLogout from './pages/user/user-logout';
import UserProfile from './pages/user/user-profile';
import UserRegister from './pages/user/user-register';
import UserReset from './pages/user/user-reset';
import UserSettings from './pages/user/user-settings';
import UserFollowing from './pages/user/user-following';
import UserNotifications from './pages/user/user-notifications';

import Contributions from './pages/changelog/contributions';
import ChangelogDiff from './pages/changelog/differences';

/**
 * This is the router which controls where URLs point to.
 */
class Router {
  /**
   * Build mithril Vnodes for each specific route.
   */
  constructor() {
    this.auth = new Auth();

    this.routes = {
      '/': this.buildRoute(MiscHome),
      '/about': this.buildRoute(MiscAbout),
      '/search': this.buildRoute(MiscSearch),
      '/statistics': this.buildRoute(MiscStats),
      '/account/create': this.buildRoute(UserRegister),
      '/account/login': this.buildRoute(UserLogin),
      '/account/logout': this.buildRoute(UserLogout, true),
      '/account/forgot': this.buildRoute(UserForgot),
      '/account/reset/:token': this.buildRoute(UserReset),
      '/account/settings': this.buildRoute(UserSettings, true),
      '/account/following': this.buildRoute(UserFollowing, true),
      '/account/notifications': this.buildRoute(UserNotifications, true),
      '/profile/:slug': this.buildRoute(UserProfile),
      '/profile/:slug/:content': this.buildRoute(UserProfile),
      '/create/book': this.buildRoute(BookCreate, true),
      '/create/book/import': this.buildRoute(BookImport, true),
      '/create/tag': this.buildRoute(TagCreate, true),
      '/book/:slug': this.buildRoute(BookView),
      '/book/:slug/edit': this.buildRoute(BookEdit, true),
      '/book/:slug/changelog': this.buildRoute(BookHistory),
      '/tag': this.buildRoute(TagList),
      '/tag/:type': this.buildRoute(TagList),
      '/tag/:type/:slug': this.buildRoute(TagView),
      '/tag/:type/:slug/edit': this.buildRoute(TagEdit, true),
      '/tag/:type/:slug/changelog': this.buildRoute(TagHistory),
      '/tag/:type/:slug/stats': this.buildRoute(TagStats),
      '/changelog': this.buildRoute(Contributions),
      '/changelog/:contribution': this.buildRoute(ChangelogDiff),
      '/:any...': this.buildRoute(MiscNotFound),
    };
  }

  /**
   * Builds the page's Vnode.
   *
   * @param  {Vnode} screen      The page's content.
   * @param  {bool} requiresAuth If the path requires authentication.
   * @param  {Vnode} layout      The page layout to use.
   * @return {Vnode}
   */
  buildRoute(screen, requiresAuth, layout) {
    layout = layout || LayoutDefault;

    let auth = this.auth;

    return {
      onmatch: function(args, requestedPath) {
        if (requiresAuth === true) {
          auth.redirectIfNotLoggedIn();
        }
      },
      render: function() {
        return m(layout, {
          auth: auth,
          pathname: window.location.pathname
        }, m(screen));
      },
    };
  }

  /**
   * Initialize the application, attaching the app to the body element.
   */
  init() {
    m.route.prefix(process.env.ROUTE_PREFIX);
    m.route(document.body, process.env.ROUTE_ROOT, this.routes);
  }
}

export default Router;
