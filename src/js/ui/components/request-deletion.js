'use strict';

import locale from './../locale';
import m from 'mithril';

import {Deletion} from './../../model/deletion';
import Alert from './alert';

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";

/**
 * Displays a form for submitting a deletion request.
 */
export default class RequestDeletion {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.deletion = new Deletion();
    this.formData = {};

    library.add(faTrash);
    dom.watch();
  }

  /**
   * Populate the data and create an event listener for closing the modal.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.formData.reason = '';
    this.formData.title = vnode.attrs.objectTitle;
    this.formData.content_type = vnode.attrs.type;
    this.formData.content = vnode.attrs.content;

    document.onkeyup = function(event) {
      if (event.keyCode == 27) {
        document.getElementById('deleteDialog').classList.remove('is-active');
      }
    };
  }

  /**
   * [onSubmitButtonClick description]
   * @param  {[type]} e [description]
   */
  onSubmitButtonClick(e) {
    e.preventDefault();

    if (document.getElementById('deletion-form').checkValidity()) {
      this.deletion.create({
        content_type: this.formData.content_type,
        content: this.formData.content,
        reason: this.formData.reason,
      }).then(() => {
        this.formData.reason = '';
        Alert.create('success', locale.t('texts.success.delete_success'));
        document.getElementById('deleteDialog').classList.remove('is-active');
      });
    } else {
      document.getElementById('deletion-form').reportValidity();
    }
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    const deleteDialog = document.getElementById('deleteDialog');

    return [
      m('.column', [
        m('p.control.has-text-right', [
          m('a.button.is-light.is-small', {
            onclick: function(e) {
              e.preventDefault();
              deleteDialog.className += ' is-active';
            },
          }, [
            m('span.icon.is-small', m('i.fa.fa-trash')),
            m('span', locale.t('buttons.request_deletion')),
          ]),
        ]),
      ]),

      m('.modal', {id: 'deleteDialog'}, [
        m('.modal-background'),
        m('.modal-content', [
          m('.card', [
            m('.card-content', [
              m('p.title', locale.t('buttons.request_deletion')),
              m('p.subtitle.is-size-6', this.formData.title),
              m('form', {id: 'deletion-form'}, [
                m('textarea.textarea', {
                  name: 'reason',
                  oninput: m.withAttr('value', (v) => {
                    this.formData.reason = v;
                  }),
                  value: this.formData.reason,
                  placeholder: locale.t('fields.deletion.reason'),
                  required: true,
                  autocomplete: 'off',
                  disabled: this.deletion.isLoading,
                  maxlength: 500,
                }),
              ]),
            ]),

            m('footer.card-footer', [
              m('p.card-footer-item', [
                m('button.button.is-light.is-fullwidth', {
                  onclick: function(e) {
                    e.preventDefault();
                    deleteDialog.classList.remove('is-active');
                  },
                }, locale.t('buttons.cancel')),
              ]),
              m('p.card-footer-item', [
                m('button.button.is-primary.is-fullwidth', {
                  onclick: this.onSubmitButtonClick.bind(this),
                  disabled: this.deletion.isLoading,
                }, locale.t('buttons.submit')),
              ]),
            ]),
          ]),
        ]),

        m('button.modal-close.is-large[aria-label="close"]', {
          onclick: function(e) {
            e.preventDefault();
            deleteDialog.classList.remove('is-active');
          },
        }),
      ]),
    ];
  }
}
