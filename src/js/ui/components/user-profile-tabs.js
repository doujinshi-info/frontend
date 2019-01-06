'use strict';

import locale from './../locale';
import m from 'mithril';
import uri from 'urijs';

/**
 * User profile tabs
 */
export default class UserProfileTabs {
  /**
   * Display the profile tabs.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    let slug = vnode.attrs.slug;

    return m('.tabs.is-fullwidth',
      m('ul', [
        m('li', {
          class: (uri().path(true) == '/profile/'+slug ? 'is-active' : ''),
        },
          m('a', {
            href: '/profile/'+slug,
          }, m('span', locale.t('tabs.profile')))
        ),
        m('li', {
          class: (uri().path(true) == '/profile/'+slug+'/library' ?
            'is-active' : ''),
        },
          m('a', {
            href: '/profile/'+slug+'/library',
          }, m('span', locale.t('tabs.library')))
        ),
        m('li', {
          class: (uri().path(true) == '/profile/'+slug+'/wishlist' ?
            'is-active' : ''),
        },
          m('a', {
            href: '/profile/'+slug+'/wishlist',
          }, m('span', locale.t('tabs.wishlist')))
        ),
        m('li', {
          class: (uri().path(true) == '/profile/'+slug+'/contributions' ?
            'is-active' : ''),
        },
          m('a', {
            href: '/profile/'+slug+'/contributions',
          }, m('span', locale.t('tabs.contributions')))
        ),
      ])
    );
  }
}
