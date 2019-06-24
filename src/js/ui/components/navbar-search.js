'use strict';

import m from 'mithril';
import locale from './../locale';
import getURLParam from './../../utils/get-url-params';
import isURLPath from './../../utils/is-path';
import Search from './../../model/search';
import uri from 'urijs';

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";

/**
 * The search bar for the navbar.
 */
export default class NavBarSearch {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.book = false;
    this.tagType = false;

    library.add(faSearch, faImage);
    dom.watch();
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.book = vnode.attrs.book;

    if (isURLPath('/tag/', false)) {
      this.tagType = uri().path().split('/')[2];
    }
  }

  /**
   * Resize image used for image searching.
   *
   * @param  {[type]} settings [description]
   * @return {[type]}          [description]
   */
  resize(settings) {
    const file = settings.file;
    const maxSize = settings.maxSize;
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement('canvas');

    const dataURItoBlob = function(dataURI) {
      const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
        atob(dataURI.split(',')[1]) : unescape(dataURI.split(',')[1]);

      const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const max = bytes.length;
      const ia = new Uint8Array(max);

      for (let i = 0; i < max; i++) {
        ia[i] = bytes.charCodeAt(i);
      }

      return new Blob([ia], {type: mime});
    };

    const resize = function() {
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg');

      return dataURItoBlob(dataUrl);
    };

    return new Promise(function(ok, no) {
      if (!file.type.match(/image.*/)) {
        no(new Error('Not an image'));
        return;
      }

      reader.onload = function(readerEvent) {
        image.onload = function() {
          return ok(resize());
        };

        image.src = readerEvent.target.result;
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Perform reverse image search.
   *
   * @param  {[type]} v [description]
   */
  imagesearch(v) {
    if (v.target.files.length) {
      this.resize({
        file: v.target.files[0],
        maxSize: 500,
      }).then((resizedImage) => {
        this.book.imageSearch(resizedImage).then(() => {
          document.getElementById('navBarMain').classList.remove('is-active');

          if (this.book.data) {
            if (this.book.data.meta.total == 1) {
              document.location = '/book/'+this.book.data.data[0].slug;
            } else {
              Search.data = this.book.data;
              m.route.set('/search');
            }
          }
        });
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  /**
   * [search description]
   * @param  {[type]} e [description]
   */
  search(e) {
    const filter = document.getElementById('search-filter').value;
    const query = document.getElementById('search-query').value;

    if (filter == 'book') {
      m.route.set('/search', {q: query});
    } else {
      m.route.set('/tag/'+filter, {q: query});
    }
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
        oninput: (v) => {
          this.imagesearch(v);
        },
      }),
      m('form.navbar-grow', {
        onsubmit: () => {
          this.search();
        },
        id: 'searchForm',
        role: 'search',
      }, [
        m('.navbar-start', [
          m('.navbar-item.navbar-grow', [
            m('.field.has-addons.navbar-grow', [
              m('.control.navbar-grow', [
                m('input.input.is-expanded', {
                  name: 'q',
                  placeholder: locale.t('navi.search'),
                  type: 'search',
                  required: 'required',
                  id: 'search-query',
                  value: ((isURLPath('/search') ||
                    isURLPath('/tag/', false)
                  ) ? getURLParam('q') : ''),
                }),
              ]),
              m('.control', m('span.select', [
                m('select', {id: 'search-filter'}, [
                  m('option', {
                    value: 'artist',
                    selected: (this.tagType == 'artist' ? true : false),
                  }, locale.t('artists')),
                  m('option', {
                    value: 'character',
                    selected: (this.tagType == 'character' ? true : false),
                  }, locale.t('characters')),
                  m('option', {
                    value: 'circle',
                    selected: (this.tagType == 'circle' ? true : false),
                  }, locale.t('circles')),
                  m('option', {
                    value: 'content',
                    selected: (this.tagType == 'content' ? true : false),
                  }, locale.t('content')),
                  m('option', {
                    value: 'convention',
                    selected: (this.tagType == 'convention' ? true : false),
                  }, locale.t('conventions')),
                  m('option', {
                    value: 'book',
                    selected: (this.tagType == false ? true : false),
                  }, locale.t('doujin')),
                  m('option', {
                    value: 'series',
                    selected: (this.tagType == 'series' ? true : false),
                  }, locale.t('series')),
                ]),
              ])),
              m('.control', m('a.button.is-primary', {
                'aria-label': locale.t('accessibility.img_search'),
                onclick: function() {
                  document.getElementById('imageUpload').click();
                },
              }, m('i.fa.fa-image'))),
              m('.control', m('a.button.is-primary', {
                'aria-label': locale.t('accessibility.search'),
                onclick: () => {
                  if (document.getElementById('searchForm').checkValidity()) {
                    this.search();
                  } else {
                    document.getElementById('searchForm').reportValidity();
                  }
                },
              }, m('i.fa.fa-search'))),
            ]),
          ]),
        ]),
      ]),
    ];
  }
}
