'use strict';

import locale from './../locale';
import m from 'mithril';

import {Following} from './../../model/following';

/**
 * Displays a button for allowing a user to follow/unfollow a tag.
 */
export default class TagFollow {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.following = new Following();
    this.isFollowing = false;
    this.tag = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.tag = vnode.attrs.tagData;

    this.following.checkTag(this.tag.id).then(() => {
      this.isFollowing = (this.following.data == true ? true : false);
    });
  }

  /**
   * Follow/Unfollow when button is clicked.
   *
   * @param  {[type]} e [description]
   */
  onButtonClick(e) {
    e.preventDefault();

    if (this.isFollowing) {
      this.following.unfollowTag(this.tag.id).then(() => {
        this.isFollowing = false;
      });
    } else {
      this.following.followTag(this.tag.id).then(() => {
        this.isFollowing = true;
      });
    }
  }

  /**
   * Display the button.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    return m('.field.has-addons', [
      m('p.control',
        m('a.button.is-light', {
          onclick: this.onButtonClick.bind(this),
        }, [
          m('span.icon.is-medium', (this.isFollowing == true ?
            m('i.fa.fa-bell') : m('i.fa.fa-bell-o')
          )),
          m('span', (this.isFollowing == true ?
            locale.t('buttons.unfollow') : locale.t('buttons.follow')
          )),
        ])
      ),
    ]);
  }
}
