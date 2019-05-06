'use strict';

import m from 'mithril';
import locale from './../locale';
import base64toInt8 from './../../utils/base64-to-int8';

import {Notification} from './../../model/notification';

import runtime from 'serviceworker-webpack-plugin/lib/runtime';

/**
 * Displays a button which enables / disables push notifications.
 */
export default class PushNotification {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.isPushEnabled = false;
    this.swRegistration = false;
    this.icon = m('i.fa.fa-bell');
    this.btnText = locale.t('buttons.enable_push');

    this.notification = new Notification();
  }

  /**
   * [oninit description]
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      runtime.register().then((sw) => {
        this.swRegistration = sw;
        this.initButton();
      }).catch((error) => {
        console.warn('Service Worker Error', error);
        this.changePushButtonState('incompatible');
      });
    } else {
      console.warn('Service Worker Error', error);
      this.changePushButtonState('incompatible');
    }
  }

  /**
   * [initButton description]
   */
  initButton() {
    // Check if Notifications are supported in SW
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
      this.changePushButtonState('incompatible');
      return;
    }

    // Check current permission
    if (Notification.permission === 'denied') {
      this.changePushButtonState('disabled');
      return;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
      this.changePushButtonState('incompatible');
      return;
    }

    if (this.swRegistration) {
      this.swRegistration.pushManager.getSubscription().then((subscription) => {
        this.changePushButtonState('disabled');

        if (!subscription) {
          return;
        }

        this.notification.pushSync('update', subscription, locale.getLang());

        this.changePushButtonState('enabled');
      }).catch((error) => {
        console.warn('Failed to get push notification subscription.', error);
      });
    }
  }

  /**
   * [onButtonClick description]
   */
  onButtonClick() {
    const pushButton = document.getElementById('push-notifications-btn');

    pushButton.disabled = true;

    if (this.isPushEnabled) {
      this.unsubscribe();
    } else {
      this.subscribe();
    }
  }

  /**
   * [unsubscribe description]
   */
  unsubscribe() {
    this.changePushButtonState('computing');

    if (this.swRegistration) {
      this.swRegistration.pushManager.getSubscription()
          .then((pushSubscription) => {
            if (!pushSubscription) {
              this.changePushButtonState('disabled');
              return;
            }

            const language = locale.getLang();
            this.notification.pushSync('delete', pushSubscription, language);

            pushSubscription.unsubscribe().then((successful) => {
              this.changePushButtonState('disabled');
            }).catch((error) => {
              this.changePushButtonState('disabled');
            });
          })
          .catch((error) => {
            console.error('Error', error);
          });
    } else {
      console.error('Error');
    }
  }

  /**
   * [subscribe description]
   */
  subscribe() {
    this.changePushButtonState('computing');

    if (this.swRegistration) {
      this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64toInt8(process.env.PUSH_KEY),
      }).then((subscription) => {
        this.changePushButtonState('enabled');
        this.notification.pushSync('create', subscription, locale.getLang());
      }).catch((error) => {
        if (Notification.permission === 'denied') {
          this.changePushButtonState('incompatible');
        } else {
          this.changePushButtonState('disabled');
        }
      });
    }
  }

  /**
   * [changePushButtonState description]
   * @param  {[type]} state [description]
   */
  changePushButtonState(state) {
    const pushButton = document.getElementById('push-notifications-btn');

    switch (state) {
      case 'enabled':
        pushButton.disabled = false;
        this.icon = m('i.fa.fa-bell-slash');
        this.btnText = locale.t('buttons.disable_push');
        this.isPushEnabled = true;
        break;
      case 'disabled':
        pushButton.disabled = false;
        this.icon = m('i.fa.fa-bell');
        this.btnText = locale.t('buttons.enable_push');
        this.isPushEnabled = false;
        break;
      case 'computing':
        pushButton.disabled = true;
        this.btnText = locale.t('loading');
        break;
      case 'incompatible':
        pushButton.disabled = true;
        this.icon = m('i.fa.fa-bell');
        this.btnText = locale.t('buttons.not_supported');
        break;
      default:
        console.error('Unhandled push button state', state);
        break;
    }
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    return m('button.button.is-light', {
      id: 'push-notifications-btn',
      onclick: this.onButtonClick.bind(this),
    }, [
      m('span.icon.is-small', this.icon),
      m('span', this.btnText),
    ]);
  }
}
