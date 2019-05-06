'use strict';

import m from 'mithril';
import locale from './../locale';

export default {
  view: function() {
    if (this.type == false) {
      return false;
    }

    let className = '';

    switch (this.type) {
      case 'error':
        className = '.is-danger';
        break;
      case 'success':
        className = '.is-success';
        break;
      case 'info':
        className = '.is-info';
        break;
      case 'warning':
        className = '.is-warning';
        break;
    }

    return (this.message ? m('.alert-message', [
      m('article.message' + className, [
        m('.message-header', [
          m('p', this.message),
          m('button.delete[aria-label="delete"]', {onclick: this.hide}),
        ]),
      ]),
    ]) : '');
  },
  hide: function(e) {
    this.type = false;
    this.message = false;

    const elements = document.getElementsByClassName('alert-message');

    while (elements.length > 0) {
      elements[0].remove();
    }
  },
  create: function(type, message) {
    const translation = locale.t(message);

    if (translation == message) {
      message = message;
    } else {
      message = translation;
    }

    this.type = type;
    this.message = message;
  },
  type: false,
  message: false,
};
