'use strict';

import m from 'mithril';
import locale from './../locale';
import getURLParam from './../../utils/get-url-params';
import isURLPath from './../../utils/is-path';

/**
 * The search bar for the navbar.
 */
export default class NavBarSearch {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.book = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.book = vnode.attrs.book;
  }

  /**
   * Display the search bar.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    return [
      m('input.search-image', {
        accept: 'image/*',
        id: 'imageUpload',
        type: 'file',
        onchange: (v) => {
          this.book.imageSearch(v.target.files[0])
          .then(() => {
            if (this.book.data) {
              m.route.set('/book/'+this.book.data);
            }
          });
        },
      }),
      m('form.navbar-grow', {
        action: '/search',
        id: 'searchForm',
        method: 'GET',
        role: 'search',
      },
        m('.navbar-start',
          m('.navbar-item.navbar-grow',
            m('.field.has-addons.navbar-grow', [
              m('.control.navbar-grow',
                m('input.input.is-expanded', {
                  name: 'q',
                  placeholder: locale.t('navi.search'),
                  type: 'search',
                  required: 'required',
                  value: (isURLPath('/search') ? getURLParam('q') : ''),
                })
              ),
              m('.control', m('a.button.is-primary', {
                onclick: function() {
                  document.getElementById('imageUpload').click();
                },
              }, m('i.fa.fa-picture-o'))),
              m('.control', m('a.button.is-primary', {
                onclick: function() {
                  if (document.getElementById('searchForm').checkValidity()) {
                      document.getElementById('searchForm').submit();
                  } else {
                     document.getElementById('searchForm').reportValidity();
                  }
                },
              }, m('i.fa.fa-search'))),
            ])
          )
        )
      ),
    ];
  }
}
