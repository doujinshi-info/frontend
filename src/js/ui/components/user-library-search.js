'use strict';

import locale from './../locale';
import m from 'mithril';
import getURLParam from './../../utils/get-url-params';

/**
 * User library book lists
 */
export default class UserLibrarySearch {
  /**
   * Inititalize the component.
   */
  constructor() {
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
    const searchForm = document.getElementById('searchLibraryForm');

    if (vnode.attrs.isLoading == false) {
      return m('.field', [
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
      ]);
    }
  }
}
