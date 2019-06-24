'use strict';

import BasePage from './../base-page';
import locale from './../../locale';
import m from 'mithril';
import logo from './../../../../img/logo_large.png';

import { library, dom } from "@fortawesome/fontawesome-svg-core";

import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons/faCodeBranch";

/**
 *
 */
export default class MiscAbout extends BasePage {
  /**
   * Initialization of about page.
   */
  constructor() {
    super(locale.t('navi.about'));

    library.add(faDownload, faBan, faUsers, faCodeBranch);
    dom.watch();
  }

  /**
   * Display information about the site.
   * @return {Vnode} [description]
   */
  view() {
    return m('section.section', [
      m('.pull-center', m('img', {
        src: logo,
        alt: 'Doujinshi.info',
      })),
      m('.column', [
        m('.column', [
          m('p', locale.t('texts.about.text_about1')),
          m('p', locale.t('texts.about.text_about2')),
        ]),
      ]),
      m('.columns.pull-center', [
        m('.column', [
          m('h6.title.is-5', locale.t('texts.about.title_piracy')),
          m('span.fa-stack.fa-5x', [
            m('i.fa.fa-download.fa-stack-1x'),
            m('i.fa.fa-ban.fa-stack-2x.has-text-danger'),
          ]),
          m('p', locale.t('texts.about.text_piracy')),
        ]),
        m('.column', [
          m('h6.title.is-5', locale.t('texts.about.title_community')),
          m('span.fa-stack.fa-5x', [
            m('i.fa.fa-users.fa-stack-1x'),
          ]),
          m('p', locale.t('texts.about.text_community')),
        ]),
        m('.column', [
          m('h6.title.is-5', locale.t('texts.about.title_opensource')),
          m('span.fa-stack.fa-5x', [
            m('i.fas.fa-code-branch.fa-stack-1x'),
          ]),
          m('p', m.trust(locale.t('texts.about.text_opensource'))),
        ]),
      ]),
    ]);
  }
}
