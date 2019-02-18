'use strict';

import m from 'mithril';
import locale from './../locale';
import getURLParam from './../../utils/get-url-params';
import isURLPath from './../../utils/is-path';
import Search from './../../model/search';

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
   * Resize image used for image searching.
   *
   * @param  {[type]} settings [description]
   * @return {[type]}          [description]
   */
  resize(settings) {
    var file = settings.file;
    var maxSize = settings.maxSize;
    var reader = new FileReader();
    var image = new Image();
    var canvas = document.createElement('canvas');

    var dataURItoBlob = function (dataURI) {
      var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
          atob(dataURI.split(',')[1]) :
          unescape(dataURI.split(',')[1]);

      var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var max = bytes.length;
      var ia = new Uint8Array(max);

      for (var i = 0; i < max; i++)
        ia[i] = bytes.charCodeAt(i);

      return new Blob([ia], { type: mime });
    };

    var resize = function () {
      var width = image.width;
      var height = image.height;

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

      var dataUrl = canvas.toDataURL('image/jpeg');

      return dataURItoBlob(dataUrl);
    };

    return new Promise(function (ok, no) {
      if (!file.type.match(/image.*/)) {
        no(new Error("Not an image"));
        return;
      }

      reader.onload = function (readerEvent) {
        image.onload = function () { return ok(resize()); };
        image.src = readerEvent.target.result;
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Perform reverse image search.
   *
   * @param  {[type]} v [description]
   * @return {[type]}   [description]
   */
  imagesearch(v) {
    if (v.target.files.length) {
      this.resize({
        file: v.target.files[0],
        maxSize: 500
      }).then((resizedImage) => {
        this.book.imageSearch(resizedImage).then(() => {
          document.getElementById('navBarMain').classList.remove("is-active");

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
        oninput: (v) => { this.imagesearch(v); },
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
              }, m('i.fa.fa-image'))),
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
