'use strict';

import m from 'mithril';
import locale from './../locale';

import {Auth} from './../../auth';
import {UserCollection} from './../../model/user-collection';

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faBookmark } from "@fortawesome/free-solid-svg-icons/faBookmark";
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";

/**
 * User library buttons for adding or removing from libraries.
 */
export default class UserCollectionButtons {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.auth = new Auth();
    this.collection = new UserCollection();

    this.book = false;
    this.inLibrary = null;
    this.inWishlist = null;

    library.add(faBookmark, faStar);
    dom.watch();
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.book = vnode.attrs.bookData;

    this.collection.check('collection', this.book.id).then(() => {
      this.inLibrary = (this.collection.data == true ? true : false);
    });

    this.collection.check('wishlist', this.book.id).then(() => {
      this.inWishlist = (this.collection.data == true ? true : false);
    });
  }

  /**
   * [onClickLibrary description]
   * @param  {[type]} e [description]
   */
  onClickLibrary(e) {
    e.preventDefault();

    if (this.inLibrary) {
      this.collection.removeFromCollection('collection', this.book.id);
      this.inLibrary = false;
    } else {
      this.collection.addToCollection('collection', this.book.id);
      this.inLibrary = true;
    }
  }

  /**
   * [onClickWishlist description]
   * @param  {[type]} e [description]
   */
  onClickWishlist(e) {
    e.preventDefault();

    if (this.inWishlist) {
      this.collection.removeFromCollection('wishlist', this.book.id);
      this.inWishlist = false;
    } else {
      this.collection.addToCollection('wishlist', this.book.id);
      this.inWishlist = true;
    }
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    if (this.inWishlist != null && this.inLibrary != null) {
      return (this.auth.token ? m('.field.has-addons.user-collections', [
        m('p.control',
            m('a.button.is-light', {
              onclick: this.onClickLibrary.bind(this),
            }, [
              m('span.icon.is-medium', (this.inLibrary == true ?
                m('i.fas.fa-bookmark') : m('i.far.fa-bookmark'))
              ),
              m('span', (this.inLibrary == false ?
                locale.t('buttons.library_add') :
                locale.t('buttons.library_remove'))
              ),
            ])
        ),
        m('p.control',
            m('a.button.is-light', {
              onclick: this.onClickWishlist.bind(this),
            }, [
              m('span.icon.is-medium', (this.inWishlist == true ?
                m('i.fas.fa-star') : m('i.far.fa-star'))
              ),
              m('span', (this.inWishlist == false ?
                locale.t('buttons.wishlist_add') :
                locale.t('buttons.wishlist_remove'))
              ),
            ])
        ),
      ]) : '');
    }
  }
}
