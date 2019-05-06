'use strict';

import {LuminousGallery} from 'luminous-lightbox';
import m from 'mithril';

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
            href: this.cover,
            class: 'image-gallery',
          }, [
            m('img', {
              src: (this.cover ? this.cover : '/assets/no_cover.jpg'),
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
                src: sample.replace('.jpg', '-thumb.jpg'),
              }),
            ]),
          ]);
        }) : null),
      ]);

    return content;
  }
}
