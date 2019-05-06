'use strict';

import locale from './../locale';
import m from 'mithril';

/**
 * User profile information
 */
export default class UserProfileInfo {
  /**
   * Display the profile information table.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    const user = vnode.attrs.user;
    let content = null;

    if (user) {
      content = [
        m('h3.title.is-3', user.display_name),
        m('table.table.is-striped.is-fullwidth',
            m('tbody', [
              m('tr', [
                m('th', locale.t('profile.date_joined')),
                m('td', user.created_at),
              ]),
              m('tr', [
                m('th', locale.t('profile.contributions')),
                m('td', user.contributions),
              ]),
              m('tr', [
                m('th', locale.t('profile.library')),
                m('td', user.collection),
              ]),
              m('tr', [
                m('th', locale.t('profile.estimated')),
                m('td', [
                  m.trust('&yen; '),
                  user.estimated_cost.toLocaleString(),
                ]),
              ]),
              m('tr', [
                m('th', locale.t('profile.wishlist')),
                m('td', user.wishlist),
              ]),
            ])
        ),
      ];
    }

    return m('', content);
  }
}
