'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';

import {Book} from './../../../model/book';

import Alert from './../../components/alert';

/**
 * Import a doujinshi from popular retail sites.
 */
export default class BookImport extends BasePage {
  /**
   * Initialization of book import page.
   */
  constructor() {
    super(locale.t('navi.import_doujinshi'));

    this.book = new Book();
    this.url = null;
  }

  /**
   * Process form submission.
   */
  onSubmitImport() {
    if (document.getElementById('import-form').checkValidity()) {
      this.book.importBook(this.url).then(() => {
        Alert.create('success', locale.t('texts.success.import_success'));
        this.url = null;
      });
    } else {
      document.getElementById('import-form').reportValidity();
    }
  }

  /**
   * View import form.
   *
   * @return {Vnode} [description]
   */
  view() {
    return m('section.section', [
      m('h3.title.is-3', locale.t('navi.import_doujinshi')),

      m('form', {id: 'import-form'}, [
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.import_url')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.url = v;
              }),
              value: this.url,
              type: 'url',
              autocomplete: 'off',
              placeholder: locale.t('fields.book.import_url'),
              required: true,
            }),
          ]),
        ]),

        m('.control', [
          m('button', {
            class: 'button is-primary is-fullwidth'
              + (this.book.isLoading ? ' is-loading' : ''),
            onclick: this.onSubmitImport.bind(this),
            disabled: this.book.isLoading,
          }, locale.t('buttons.book_import')),
        ]),
      ]),
    ]);
  }
}
