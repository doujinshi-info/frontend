'use strict';

import locale from './../locale';
import m from 'mithril';

/**
 * Displays differences in a changelog entry.
 */
export default class ContributionDiff {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.changes = false;
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.changes = vnode.attrs.changes;
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    if (this.changes && this.changes.changelog.data) {
      let fields = [];

      this.changes.changelog.data.forEach(function(change) {
        let data = locale.t('fields.' + change.type + '.' + change.column);
        let oldValue = change.old_value;
        let newValue = change.new_value;

        // Format tag type
        if (change.type == 'tag' && change.column == 'type') {
          newValue = (change.new_value ? m('a', {
            href: '/tag/'+change.new_value.slug,
          }, locale.name(change.new_value.name)) : change.new_value);

          oldValue = (change.old_value ? m('a', {
            href: '/tag/'+change.old_value.slug,
          }, locale.name(change.old_value.name)) : change.old_value);
        }

        if (change.column == 'child_tag_id') {
          data = (change.new_value ? m('a', {
            href: '/tag/'+change.new_value.type.slug,
          }, locale.name(change.new_value.type.name)) : change.new_value);

          newValue = (change.new_value ? m('a', {
            href: '/tag/'+change.new_value.type.slug+'/'+change.new_value.slug,
          }, locale.name(change.new_value.name)) : change.new_value);

          oldValue = (change.old_value ? m('a', {
            href: '/tag/'+change.old_value.type.slug+'/'+change.old_value.slug,
          }, locale.name(change.old_value.name)) : change.old_value);
        }

        if (change.type == 'book' && change.column == 'tag_id') {
          data = (change.new_value ? m('a', {
            href: '/tag/'+change.new_value.type.slug,
          }, locale.name(change.new_value.type.name)) : change.new_value);

          if (!data) {
            data = (change.old_value ? m('a', {
              href: '/tag/'+change.old_value.type.slug,
            }, locale.name(change.old_value.type.name)) : change.old_value);
          }

          newValue = (change.new_value ? m('a', {
            href: '/tag/'+change.new_value.type.slug+'/'+change.new_value.slug,
          }, locale.name(change.new_value.name)) : change.new_value);

          oldValue = (change.old_value ? m('a', {
            href: '/tag/'+change.old_value.type.slug+'/'+change.old_value.slug,
          }, locale.name(change.old_value.name)) : change.old_value);
        }

        if (change.column == 'name_other') {
          oldValue = (change.old_value ?
            change.old_value.join(', ') : change.old_value
          );

          newValue = (change.new_value ?
            change.new_value.join(', ') : change.new_value
          );
        }

        if (change.column == 'links') {
          let oldLinks = (change.old_value ?
            JSON.parse(change.old_value) : {}
          );

          let newLinks = (change.new_value ?
            JSON.parse(change.new_value) : {}
          );

          if (oldLinks.length) {
            oldLinks.forEach((link) => {
              fields.push([
                m('tr', [
                  m('td', locale.t('fields.links.'+link)),
                  m('td', oldLinks[link]),
                  m('td', newLinks[link]),
                ]),
              ]);

              if (newLinks[link]) {
                delete newLinks[link];
              }
            });
          }

          if (newLinks.length) {
            newLinks.forEach((link) => {
              fields.push([
                m('tr', [
                  m('td', locale.t('fields.links.'+link)),
                  m('td', oldLinks[link]),
                  m('td', newLinks[link]),
                ]),
              ]);
            });
          }
        }

        if (change.column == 'samples') {
          fields.push([
            m('tr', [
              m('td', data),
              m('td', (oldValue ? JSON.parse(oldValue).map(function(image) {
                return m('img', {
                  src: image.replace('.jpg', '-thumb.jpg'),
                });
              }) : '')),
              m('td', JSON.parse(newValue).map(function(image) {
                return m('img', {
                  src: image.replace('.jpg', '-thumb.jpg'),
                });
              })),
            ]),
          ]);
        }

        if (change.column == 'cover') {
          fields.push([
            m('tr', [
              m('td', data),
              m('td', (oldValue ? m('img', {
                  src: oldValue.replace('.jpg', '-thumb.jpg'),
              }) : '')),
              m('td', (newValue ? m('img', {
                  src: newValue.replace('.jpg', '-thumb.jpg'),
              }) : '')),
            ]),
          ]);
        }

        if (change.column != 'links' && change.column != 'samples' && change.column != 'cover') {
          fields.push([
            m('tr', [
              m('td', data),
              m('td', oldValue),
              m('td', newValue),
            ]),
          ]);
        }
      });

      return m('', [
        m('table.table.is-striped.is-fullwidth', [
          m('thead', [
            m('tr', [
              m('th', locale.t('history.data')),
              m('th', locale.t('history.old_value')),
              m('th', locale.t('history.new_value')),
            ]),
          ]),
          m('tbody', fields),
        ]),
      ]);
    }
  }
}
