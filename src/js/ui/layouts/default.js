'use strict';

import m from 'mithril';

import {Book} from './../../model/book';
import {Notification} from './../../model/notification';

// View Components
import OldBrowser from './../components/old-browser';
import NavBar from './../components/navbar';
import Footer from './../components/footer';
import Alert from './../components/alert';

import setLocaleMeta from './../../utils/set-locale-meta';

/**
 * Default layout that is extended by pages.
 */
class LayoutDefault {
  /**
   * Initialize layout and load up auth, book, and notification models.
   */
  constructor() {
    this.auth = false;
    this.book = new Book();
    this.notification = new Notification();
  }

  /**
   * Get notification count if user is logged in.
   *
   * @param  {Vnode} vnode
   */
  oninit(vnode) {
    setLocaleMeta(vnode.attrs.pathname);

    this.auth = vnode.attrs.auth;

    if (this.auth.token) {
      this.notification.count();
    }
  }

  /**
   * Display the page layout.
   *
   * @param  {Vnode} vnode
   * @return {Vnode} [description]
   */
  view(vnode) {
    // Make sure we have notification counts before rendering
    if (this.auth.token && this.notification.data == null) {
      this.notification.data = 0;
    }

    return [
      m(OldBrowser),
      m(NavBar, {
        token: this.auth.token,
        user: this.auth.user,
        book: this.book,
        notifications: this.notification.data,
        pathname: vnode.attrs.pathname,
      }),
      m('main', [
        Alert.view(),
        vnode.children,
      ]),
      m(Footer, {pathname: vnode.attrs.pathname}),
    ];
  }
}

export default LayoutDefault;
