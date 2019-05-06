'use strict';

import formArrayToArray from './../../utils/form-array-to-array';
import locale from './../locale';
import m from 'mithril';
import Tokenfield from 'tokenfield/dist/tokenfield';

/**
 * Displays a form for inputting tag information.
 */
export default class TagForm {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.circles = null;
    this.fn_submitTag = null;
    this.formData = {};
    this.isLoading = false;
    this.series = null;
    this.tag = null;
    this.tokenfields = {};
    this.types = null;
  }

  /**
   * Resets the state of the form elements to hide all type specific fields.
   */
  resetForm() {
    document.getElementById('description_japanese').style.display = 'none';
    document.getElementById('description_english').style.display = 'none';
    document.getElementById('date_start').style.display = 'none';
    document.getElementById('date_end').style.display = 'none';
    document.getElementById('circles').style.display = 'none';
    document.getElementById('series').style.display = 'none';
    document.getElementById('pixiv').style.display = 'none';
    document.getElementById('circlems').style.display = 'none';
    document.getElementById('twitter').style.display = 'none';
    document.getElementById('patreon').style.display = 'none';
    document.getElementById('enty').style.display = 'none';
    document.getElementById('fantia').style.display = 'none';
  }

  /**
   * Shows certain fields based off the selected tag type.
   *
   * @param  {String} type The tag type slug.
   */
  changeType(type) {
    this.resetForm();

    switch (type) {
      case 'content':
        document.getElementById('description_japanese').style.display = 'block';
        document.getElementById('description_english').style.display = 'block';
        break;
      case 'convention':
        document.getElementById('date_start').style.display = 'block';
        document.getElementById('date_end').style.display = 'block';
        document.getElementById('twitter').style.display = 'block';
        break;
      case 'character':
        document.getElementById('series').style.display = 'block';
        break;
      case 'circle':
      case 'artist':
        document.getElementById('circles').style.display = 'block';
        document.getElementById('pixiv').style.display = 'block';
        document.getElementById('twitter').style.display = 'block';
        document.getElementById('patreon').style.display = 'block';
        document.getElementById('enty').style.display = 'block';
        document.getElementById('fantia').style.display = 'block';
        break;
    }
  }

  /**
   * [onCreateButtonClick description]
   */
  onCreateButtonClick() {
    if (document.getElementById('tag-form').checkValidity()) {
      const aliases = document.querySelectorAll('[name^=aliases]');
      let circles = document.querySelectorAll('[name^=circle_tags]');
      let series = document.querySelectorAll('[name^=series_tags]');

      circles = formArrayToArray(circles);
      series = formArrayToArray(series);

      this.formData.aliases = formArrayToArray(aliases);
      this.formData.tags = circles.concat(series);

      this.fn_submitTag(this.formData);
    } else {
      document.getElementById('tag-form').reportValidity();
    }
  }

  /**
   * Creates a token input field.
   *
   * @param  {[type]}  element  [description]
   * @param  {[type]}  type     [description]
   * @param  {Boolean} multiple [description]
   * @param  {Boolean} items    [description]
   * @param  {Array}   data     [description]
   */
  tokenize(element, type, multiple = true, items = false, data = []) {
    if (data.length) {
      element.dom.placeholder = '';
    }

    this.tokenfields[type] = new Tokenfield({
      el: element.dom,
      newItems: items,
      multiple: multiple,
      setItems: data,
      placeholder: null,
      itemName: type + '_tags',
      newItemName: type + '_tags',
      remote: {url: process.env.API_ENDPOINT + '/search/tag/' + type},
    });

    this.tokenfields[type]._templates.setItem = '' +
      '<li class="tokenfield-set-item">\n<span class="item-label"></span>\n' +
      '<a href="#" class="item-remove" tabindex="-1">' +
      '<i class="fa fa-times"></i></a></a>\n' +
      '<input class="item-input" type="hidden" />\n</li>';

    this.tokenfields[type].remapData = function(data) {
      return data.data.map(function(tag) {
        return {id: tag.id, name: locale.name(tag.name)};
      });
    };

    this.tokenfields[type]._filterData = function(val, data) {
      return data;
    };
  }

  /**
   * [createAliasesField description]
   * @param  {[type]} element [description]
   * @param  {[type]} data    [description]
   */
  createAliasesField(element, data) {
    if (data) {
      element.dom.placeholder = '';
    }

    this.tokenfields['aliases'] = new Tokenfield({
      el: element.dom,
      newItems: true,
      setItems: data,
      itemName: 'aliases',
      newItemName: 'aliases',
      placeholder: null,
    });
  }

  /**
   * Populate the data.
   *
   * @param  {[type]} vnode [description]
   */
  oninit(vnode) {
    this.tag = vnode.attrs.tagData;
    this.series = vnode.attrs.series;
    this.circles = vnode.attrs.circles;
    this.isLoading = vnode.attrs.isLoading;
    this.types = vnode.attrs.types;

    if (this.tag) {
      this.formData = {
        type: this.tag.type.slug,
        name_japanese: this.tag.name.japanese,
        name_romaji: this.tag.name.romaji,
        name_english: (this.tag.name.english) && this.tag.name.english,
        aliases: (this.tag.aliases) && this.tag.aliases.map((alias) => {
          return {id: alias, name: alias};
        }),
        description_english: (this.tag.description)
          && this.tag.description.english,
        description_japanese: (this.tag.description)
          && this.tag.description.japanese,
        date_start: (this.tag.event) && this.tag.event.date_start,
        date_end: (this.tag.event) && this.tag.event.date_end,
        circles: (this.circles ? this.circles.map((circle) => {
          return {
            id: circle.id,
            name: locale.name(circle.name),
          };
        }) : []),
        series: (this.series ? this.series.map((show) => {
          return {
            id: show.id,
            name: locale.name(show.name),
          };
        }) : []),
        links: {
          pixiv: (this.tag.links && this.tag.links.pixiv)
            && this.tag.links.pixiv,
          twitter: (this.tag.links && this.tag.links.twitter)
            && this.tag.links.twitter,
          circlems: (this.tag.links && this.tag.links.circlems)
            && this.tag.links.circlems,
          patreon: (this.tag.links && this.tag.links.patreon)
            && this.tag.links.patreon,
          enty: (this.tag.links && this.tag.links.enty)
            && this.tag.links.enty,
          fantia: (this.tag.links && this.tag.links.fantia)
            && this.tag.links.fantia,
        },
      };
    } else {
      this.formData = {
        type: 'artist',
        links: {
          pixiv: undefined,
          twitter: undefined,
          circlems: undefined,
          patreon: undefined,
          enty: undefined,
          fantia: undefined,
        },
        aliases: [],
        tags: [],
      };
    }

    this.fn_submitTag = vnode.attrs.fn_submitTag;
  }

  /**
   * [view description]
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    if (this.types) {
      return m('form', {id: 'tag-form'}, [
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.tag.type')),
            m('.select', [
              m('select', {
                onchange: (e) => {
                  this.changeType(e.currentTarget.value);
                  this.formData.type = e.currentTarget.value;
                },
                required: true,
                disabled: (this.isLoading === true || this.tag != undefined),
              }, [
                this.types.map((type) => {
                  return m('option', {
                    value: type.slug,
                    selected: (this.formData.type === type.slug),
                  }, locale.name(type.name));
                }),
              ]),
            ]),
          ]),
        ]),

        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.tag.name_original')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.name_japanese = v;
              }),
              value: this.formData.name_japanese,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('fields.tag.name_original'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.tag.name_romaji')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.name_romaji = v;
              }),
              value: this.formData.name_romaji,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('fields.tag.name_romaji'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.tag.name_english')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.name_english = v;
              }),
              value: this.formData.name_english,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('fields.tag.name_english'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'aliases'}, [
            m('label.label', locale.t('fields.tag.name_other')),
            m('input.input', {
              oncreate: (e) => {
                this.createAliasesField(e, this.formData.aliases);
              },
              value: this.formData.aliases,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('fields.tag.name_other'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'description_japanese'}, [
            m('label.label', locale.t('fields.tag.description_japanese')),
            m('textarea.textarea', {
              oninput: m.withAttr('value', (v) => {
                this.formData.description_japanese = v;
              }),
              value: this.formData.description_japanese,
              autocomplete: 'off',
              placeholder: locale.t('fields.tag.description_japanese'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'description_english'}, [
            m('label.label', locale.t('fields.tag.description_english')),
            m('textarea.textarea', {
              oninput: m.withAttr('value', (v) => {
                this.formData.description_english = v;
              }),
              value: this.formData.description_english,
              autocomplete: 'off',
              placeholder: locale.t('fields.tag.description_english'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'date_start'}, [
            m('label.label', locale.t('fields.tag.event_start')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.date_start = v;
              }),
              value: this.formData.date_start,
              type: 'date',
              autocomplete: 'off',
              placeholder: locale.t('fields.tag.event_start'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'date_end'}, [
            m('label.label', locale.t('fields.tag.event_end')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.date_end = v;
              }),
              value: this.formData.date_end,
              type: 'date',
              autocomplete: 'off',
              placeholder: locale.t('fields.tag.event_end'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'circles'}, [
            m('label.label', locale.t('circles')),
            m('input.input', {
              oncreate: (e) => {
                this.tokenize(e, 'circle', true, false, this.formData.circles);
              },
              value: this.formData.circles,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('circles'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'series'}, [
            m('label.label', locale.t('series')),
            m('input.input', {
              oncreate: (e) => {
                this.tokenize(e, 'series', true, false, this.formData.series);
              },
              value: this.formData.series,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('series'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'pixiv'}, [
            m('label.label', locale.t('fields.links.pixiv')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.pixiv = v;
              }),
              value: (this.formData.links && this.formData.links.pixiv)
                && this.formData.links.pixiv,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.pixiv'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'twitter'}, [
            m('label.label', locale.t('fields.links.twitter')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.twitter = v;
              }),
              value: (this.formData.links && this.formData.links.twitter)
                && this.formData.links.twitter,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.twitter'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'circlems'}, [
            m('label.label', locale.t('fields.links.circlems')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.circlems = v;
              }),
              value: (this.formData.links && this.formData.links.circlems)
                && this.formData.links.circlems,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.circlems'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'patreon'}, [
            m('label.label', locale.t('fields.links.patreon')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.patreon = v;
              }),
              value: (this.formData.links && this.formData.links.patreon)
                && this.formData.links.patreon,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.patreon'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'enty'}, [
            m('label.label', locale.t('fields.links.enty')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.enty = v;
              }),
              value: (this.formData.links && this.formData.links.enty)
                && this.formData.links.enty,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.enty'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.field', [
          m('.control', {id: 'fantia'}, [
            m('label.label', locale.t('fields.links.fantia')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.fantia = v;
              }),
              value: (this.formData.links && this.formData.links.fantia)
                && this.formData.links.fantia,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.fantia'),
              disabled: this.isLoading,
            }),
          ]),
        ]),

        m('.control', [
          m('button', {
            oncreate: () => {
              this.changeType(this.formData.type);
            },
            class: 'button is-fullwidth is-primary'
              + (this.isLoading ? ' is-loading' : ''),
            onclick: (e) => {
              e.preventDefault();
              this.onCreateButtonClick();
            },
            disabled: this.isLoading,
          },
          (this.tag ?
            locale.t('buttons.tag_update') : locale.t('buttons.tag_create')
          )),
        ]),
      ]);
    }
  }
}
