'use strict';

import m from 'mithril';
import locale from './../locale';
import NavBarSearch from './navbar-search';
import logo from './../../../img/logo.png';

/**
 * The navigation bar present on every page of the site.
 */
export default class NavBar {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.token = false;
    this.user = false;
    this.book = false;
    this.notifications = 0;
  }

  /**
   * Creates a navbar item.
   *
   * @param  {[type]} link        [description]
   * @param  {[type]} name        [description]
   * @param  {[type]} currentPath [description]
   * @return {[type]}             [description]
   */
  generateNavLink(link, name, currentPath) {
    return m('a', {
        href: link,
        class: 'navbar-item ' + (link == currentPath ? 'is-active' : ''),
    }, name);
  }

  /**
   * Populate the data and adds an event listener for reponsive menu.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.pathname = vnode.attrs.pathname;
    this.user = vnode.attrs.user;
    this.token = vnode.attrs.token;
    this.book = vnode.attrs.book;
    this.notifications = vnode.attrs.notifications;

    // Responsive Menu
    document.addEventListener('DOMContentLoaded', function() {
      let menu = document.querySelectorAll('.navbar-burger');

      // Get all 'navbar-burger' elements
      let $navbarBurgers = Array.prototype.slice.call(menu, 0);

      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {
        // Add a click event on each of them
        $navbarBurgers.forEach(function($el) {
          $el.addEventListener('click', function() {
            // Get the target from the 'data-target' attribute
            let target = $el.dataset.target;
            let $target = document.getElementById(target);

            $el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
          });
        });
      }
    });
  }

  /**
   * Display the navbar.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    return m('nav.navbar.is-light.is-fixed-top[aria-label="main navigation"]', {
      role: 'navigation',
    }, [
      m('.navbar-brand', [
        m('a.navbar-item[href="/"]', m('img', {src: logo})),
        m('button.button.navbar-burger[data-target="navBarMain"]', [
          m('span'),
          m('span'),
          m('span'),
        ]),
      ]),
      m('.navbar-menu', {id: 'navBarMain'}, [
        m(NavBarSearch, {book: this.book}),
        m('.navbar-end', [
          this.generateNavLink('/about',
            locale.t('navi.about'),
            this.pathname),

          m('.navbar-item.has-dropdown.is-hoverable', [
            m('a.navbar-link', locale.t('navi.community')),
            m('.navbar-dropdown.is-right', [
              m('a.navbar-item', {
                href: process.env.DISCORD_URL,
              }, locale.t('navi.discord')),
            ]),
          ]),

          this.generateNavLink('/changelog',
            locale.t('navi.changelog'),
            this.pathname),

          this.generateNavLink('/statistics',
            locale.t('navi.stats'),
            this.pathname),

          this.generateNavLink('/tag',
            locale.t('navi.tags'),
            this.pathname),

          (!this.token ?
            this.generateNavLink('/account/create',
              locale.t('navi.register'),
              this.pathname)
          : ''),

          (!this.token ?
            this.generateNavLink('/account/login',
              locale.t('navi.login'),
              this.pathname)
          : ''),

          (this.token ? [
              m('.navbar-item.has-dropdown.is-hoverable', [
                m('a.navbar-link', locale.t('navi.contribute')),
                m('.navbar-dropdown.is-right', [
                  this.generateNavLink('/create/tag',
                    locale.t('navi.create_tag'),
                    this.pathname),

                  this.generateNavLink('/create/book',
                    locale.t('navi.create_doujinshi'),
                    this.pathname),

                  this.generateNavLink('/create/book/import',
                    locale.t('navi.import_doujinshi'),
                    this.pathname),
                ]),
              ]),
              m('.navbar-item.has-dropdown.is-hoverable', [
                m('a.navbar-link', locale.t('navi.account')),
                m('.navbar-dropdown.is-right', [
                  this.generateNavLink(
                    '/profile/'+this.user.slug,
                    locale.t('navi.profile'),
                    this.pathname
                  ),

                  this.generateNavLink(
                    '/profile/'+this.user.slug+'/library',
                    locale.t('navi.library'),
                    this.pathname
                  ),

                  this.generateNavLink(
                    '/profile/'+this.user.slug+'/wishlist',
                    locale.t('navi.wishlist'),
                    this.pathname
                  ),

                  m('hr.navbar-divider'),

                  this.generateNavLink('/account/notifications', [
                    m('span', locale.t('navi.notifications')),
                    (this.notifications > 0 ?
                      m('span.tag.is-primary.menu-badge', this.notifications)
                    : ''),
                  ], this.pathname),
                  this.generateNavLink('/account/following',
                    locale.t('navi.following'),
                    this.pathname),
                  this.generateNavLink('/account/settings',
                    locale.t('navi.settings'),
                    this.pathname),

                  m('hr.navbar-divider'),

                  m('a.navbar-item', {
                    href: '/account/logout',
                  }, locale.t('navi.logout')),
                ]),
              ]),
          ] : ''),
        ]),
      ]),
    ]);
  }
}
