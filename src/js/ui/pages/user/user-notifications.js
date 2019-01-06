'use strict';

import {Auth} from './../../../auth';
import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';
import getURLParam from './../../../utils/get-url-params';

// Models
import {Notification} from './../../../model/notification';

// View Components
import NotificationList from './../../components/notification-list';
import PushNotification from './../../components/push-notification';

/**
 * Display a list of notifications to the user.
 */
class UserNotifications extends BasePage {
  /**
   * Initialization of user notifications page.
   */
   constructor() {
    super(locale.t('navi.notifications'));

    this.auth = new Auth();
    this.notification = new Notification();

    this.page = Number(getURLParam('page')) || 1;
  }

  /**
   * On initization make sure the user is logged in and get their notifications.
   */
  oninit() {
    this.auth.redirectIfNotLoggedIn();
    this.notification.fetch(this.page);
  }

  /**
   * Process the read all button click.
   */
  clickReadAll() {
    this.notification.readAll().then(() => {
      this.notification.fetch(this.page);
      m.route.set('/account/notifications');
    });
  }

  /**
   * Mark a notification as read when it's clicked.
   *
   * @param  {Object} notification The notification object.
   */
  markAsRead(notification) {
    this.notification.read(notification.id);
  }

  /**
   * Display the notification list and buttons.
   *
   * @return {Vnode}
   */
  view() {
    if (this.notification.data != null && this.notification.data.length) {
      return m('section.section', [
        m('h3.title.is-3', locale.t('navi.notifications')),

        m('.field.is-grouped', [
          m('.control', [
            m('button.button.is-light', {
              onclick: this.clickReadAll.bind(this),
            }, [
              m('span.icon.is-small', m('i.fa.fa-check')),
              m('span', locale.t('buttons.mark_all_read')),
            ]),
          ]),
          m('.control', [
            m(PushNotification),
          ]),
        ]),

        m(NotificationList, {
          notifications: this.notification.data,
          meta: this.notification.meta,
          fn_read: this.markAsRead.bind(this),
        }),
      ]);
    } else {
      if (!this.notification.isLoading) {
        return m('section.section', m('.notification',
          locale.t('texts.empty.no_notifications')
        ));
      }
    }
  }
}

export default UserNotifications;
