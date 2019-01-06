'use strict';

import locale from './../locale';
import m from 'mithril';
import getURLParam from './../../utils/get-url-params';

import BookList from './book-list';

/**
 * User library book lists
 */
export default class UserLibrary {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.books = false;
    this.meta = false;
    this.fn_nextPage = false;
    this.isLoading = false;
    this.slug = false;
    this.type = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.books = vnode.attrs.books;
    this.meta = vnode.attrs.meta;
    this.fn_nextPage = vnode.attrs.fn_nextPage;
    this.isLoading = vnode.attrs.isLoading;
    this.slug = vnode.attrs.slug;
    this.type = vnode.attrs.type;
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    let searchForm = document.getElementById('searchLibraryForm');

    if (vnode.attrs.isLoading == false) {
      return [
        m('.field', [
          m('.control', [
            m('form.navbar-grow', {
              action: '/profile/'+this.slug+'/'+this.type,
              id: 'searchLibraryForm',
              method: 'GET',
              role: 'search',
            },
            m('.navbar-start',
              m('.field.has-addons.navbar-grow', [
                m('.control.navbar-grow',
                  m('input.input.is-expanded', {
                    name: 'q',
                    placeholder: locale.t('navi.search'),
                    type: 'search',
                    value: getURLParam('q'),
                  })
                ),
                m('.control', m('a.button.is-primary', {
                  onclick: () => {
                    if (searchForm.checkValidity()) {
                      searchForm.submit();
                    } else {
                      searchForm.reportValidity();
                    }
                  },
                }, m('i.fa.fa-search'))),
              ])
            )),
          ]),
        ]),

        (this.meta.total > 0 ? m(BookList, {
          books: this.books,
          meta: this.meta,
          fn_nextPage: this.fn_nextPage,
          isLoading: this.isLoading,
        }) :
        m('.notification.has-text-centered', [
          locale.t('texts.empty.no_results'),
        ])),
      ];
    }
  }
}
