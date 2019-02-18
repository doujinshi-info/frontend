'use strict';

import locale from './../locale';
import m from 'mithril';
import paginate from './pagination';

/**
 * Displays a list of notifications
 */
export default class NotificationList {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.notifications = false;
    this.meta = false;
    this.data = [];
    this.fn_read = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.notifications = vnode.attrs.notifications;
    this.meta = vnode.attrs.meta;
    this.fn_read = vnode.attrs.fn_read;
  }

  /**
   * Mark the notification as read on clicked.
   *
   * @param  {[type]} notification [description]
   */
  onButtonClick(notification) {
    this.fn_read(notification);

    if (notification.type == 'new_doujin') {
      m.route.set('/book/' + notification.book.slug);
    }
  }

  /**
   * Display the list of notifications.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    if (this.notifications) {
      this.notifications.forEach((notification) => {
        this.data.push(
          m('a', {
            onclick: (e) => {
              e.preventDefault();
              this.onButtonClick(notification);
            },
          }, [
            m('.box' + (notification.is_read == false ? ' unread' : ''), [
              m('article.media', [
                (notification.book.cover ? [
                  m('.media-left', [
                    m('figure.image.is-48x48',
                      m('img.is-rounded', {
                        src: notification.book.cover
                          .replace('.jpg', '-thumb.jpg'),
                      })
                    ),
                  ]),
                ] : ''),

                m('.media-content', [
                  m('.content', [
                    m.trust(locale.t('notifications.' + notification.type, {
                      tag: locale.name(notification.tag.name),
                      book: locale.name(notification.book.name),
                    })),

                    m('.is-size-7.has-text-grey-light',
                      notification.created_at
                    ),
                  ]),
                ]),
              ]),
            ]),
          ])
        );
      });

      return m('.notification-list', [
        this.data,
        m(paginate, {meta: this.meta}),
      ]);
    }
  }
}
