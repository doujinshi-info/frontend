'use strict';

import {LuminousGallery} from 'luminous-lightbox';
import m from 'mithril';
import locale from './../locale';
import noCoverImgThumb from './../../../img/now_printing_thumb.jpg';
import noCoverImg from './../../../img/now_printing.jpg';

/**
 * Display images of a doujinshi.
 */
export default class BookImages {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.cover = false;
    this.samples = false;
  }

  /**
   * During dom creation, attach the LuminousGallery library.
   */
  oncreate() {
    new LuminousGallery(document.querySelectorAll('.image-gallery'));
  }

  /**
   * [oninit description]
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.cover = vnode.attrs.cover;
    this.samples = vnode.attrs.samples;
  }

  /**
   * Display the doujinshi images.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    const content =
      m('.columns.is-multiline.is-mobile', [
        m('.column.has-text-centered.is-12', [
          m('a', {
            href: (this.cover ? this.cover : noCoverImg),
            class: 'image-gallery',
          }, [
            m('img', {
              alt: locale.t('accessibility.cover_art'),
              src: (this.cover ? this.cover : noCoverImgThumb),
            }),
          ]),
        ]),
        (this.samples ? this.samples.map(function(sample) {
          return m('.column.is-half', [
            m('a', {
              href: sample,
              class: 'image-gallery',
            }, [
              m('img', {
                alt: locale.t('accessibility.sample_page'),
                src: sample.replace('.jpg', '-thumb.jpg'),
              }),
            ]),
          ]);
        }) : null),
      ]);

    return content;
  }
}
