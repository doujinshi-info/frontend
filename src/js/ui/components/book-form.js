'use strict';

import formArrayToArray from './../../utils/form-array-to-array';
import locale from './../locale';
import m from 'mithril';
import Tokenfield from 'tokenfield';

import getTagSet from './../../utils/get-tag-set';

let Dropzone = require('dropzone/dist/dropzone.js');

/**
 * Display a form for adding or modifying a doujinshi.
 */
export default class BookForm {
  /**
   * Inititalize the component.
   */
  constructor() {
    this.fn_bookAction = null;
    this.book = null;
    this.formData = {};
    this.tokenfields = {};
    this.artists = null;
    this.circles = null;
    this.series = null;
    this.characters = null;
    this.contents = null;
    this.language = null;
    this.censoring = null;
    this.conventions = null;

    this.languages = null;
    this.censorings = null;

    this.isLoading = false;
  }

  /**
   * Populate the data.
   *
   * @param  {Vnode} vnode The vnode passed from the page.
   */
  oninit(vnode) {
    this.book = vnode.attrs.bookData;
    this.artists = vnode.attrs.artists;
    this.circles = vnode.attrs.circles;
    this.series = vnode.attrs.series;
    this.characters = vnode.attrs.characters;
    this.contents = vnode.attrs.contents;
    this.language = vnode.attrs.language;
    this.censoring = vnode.attrs.censoring;
    this.conventions = vnode.attrs.convention;

    // Options
    this.languages = vnode.attrs.languages;
    this.censorings = vnode.attrs.censorings;

    // Processing
    this.fn_bookAction = vnode.attrs.fn_bookAction;

    this.isLoading = this.isLoading;

    if (this.book) {
      this.formData = {
        name_japanese: this.book.name.japanese,
        name_romaji: this.book.name.romaji,
        name_english: (this.book.name.english ? this.book.name.english : ''),
        date_released: this.book.date_released,
        artists: (this.artists ? this.artists.map((artist) => {
          return {
            id: artist.id,
            name: locale.name(artist.name),
          };
        }) : []),
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
        characters: (this.characters ? this.characters.map((character) => {
          return {
            id: character.id,
            name: locale.name(character.name),
          };
        }) : []),
        content: (this.contents ? this.contents.map((content) => {
          return {
            id: content.id,
            name: locale.name(content.name),
          };
        }) : []),
        convention: (this.conventions ? this.conventions.map((convention) => {
          return {
            id: convention.id,
            name: locale.name(convention.name),
          };
        }) : []),
        pages: this.book.pages,
        price: this.book.price,
        language: (this.language ? this.language[0].id : ''),
        censoring: (this.censoring ? this.censoring[0].id : ''),
        is_adult: this.book.is_adult,
        is_anthology: this.book.is_anthology,
        is_copybook: this.book.is_copybook,
        is_novel: this.book.is_novel,
        cover: null,
        samples: [],
        removed_samples: [],
        links: (this.book.links ? {
          toranoana: (this.book.links.toranoana ?
            this.book.links.toranoana : ''
          ),
          melonbooks: (this.book.links.melonbooks ?
            this.book.links.melonbooks : ''
          ),
          boothpm: (this.book.links.boothpm ?
            this.book.links.boothpm : ''
          ),
          alice: (this.book.links.alice ?
            this.book.links.alice : ''
          ),
          dlsite: (this.book.links.dlsite ?
            this.book.links.dlsite : ''
          ),
          dmm: (this.book.links.dmm ?
            this.book.links.dmm : ''
          ),
        } : {}),
      };

      this.cover = this.book.cover;
      this.samples = this.book.samples;
    } else {
      this.formData = {
        links: {},
        language: {},
        censoring: {},
        cover: null,
        samples: [],
        is_adult: false,
        is_anthology: false,
        is_copybook: false,
        is_novel: false,
        removed_samples: [],
      };

      this.cover = null;
      this.samples = [];
    }
  }

  /**
   * Actions to perform when the submit button is pressed.
   */
  onCreateButtonClick() {
    if (document.getElementById('book-form').checkValidity()) {
      const circles = formArrayToArray(
        document.querySelectorAll('[name^=circle_tags]')
      );

      const artists = formArrayToArray(
        document.querySelectorAll('[name^=artist_tags]')
      );

      const characters = formArrayToArray(
        document.querySelectorAll('[name^=character_tags]')
      );

      const series = formArrayToArray(
        document.querySelectorAll('[name^=series_tags]')
      );

      const content = formArrayToArray(
        document.querySelectorAll('[name^=content_tags]')
      );

      const convention = formArrayToArray(
        document.querySelectorAll('[name^=convention_tags]')
      );

      this.formData.tags = circles.concat(
        artists,
        characters,
        series,
        content,
        convention,
        this.formData.censoring,
        this.formData.language
      );

      this.fn_bookAction(this.book, this.formData);
    } else {
      document.getElementById('book-form').reportValidity();
    }
  }

  /**
   * Creates a token input field.
   *
   * @param  {[type]}  element   [description]
   * @param  {string}  type      [description]
   * @param  {boolean} multiple  [description]
   * @param  {boolean} new_items [description]
   * @param  {array}   data      [description]
   */
  tokenize(element, type, multiple = true, new_items = false, data = []) {
    if (data.length) {
      element.dom.placeholder = '';
    }

    this.tokenfields[type] = new Tokenfield({
      el: element.dom,
      newItems: new_items,
      multiple: multiple,
      setItems: data,
      itemName: type+'_tags',
      newItemName: type+'_tags',
      remote: {
        url: process.env.API_ENDPOINT + '/search/tag/' + type,
      },
    });

    this.tokenfields[type]._templates.setItem = '' +
      '<li class="tokenfield-set-item">\n<span class="item-label"></span>\n' +
      '<a href="#" class="item-remove" tabindex="-1"><i class="fa fa-times"></i></a></a>\n' +
      '<input class="item-input" type="hidden" />\n</li>';

    this.tokenfields[type].remapData = (data) => {
      return data.data.map((tag) => {
        let tmpShows = getTagSet('series', tag.tags);
        let tagName = locale.name(tag.name);

        // Show series character is from in results.
        if (tag.type.slug == 'character' && tmpShows) {
          tagName += ' ('+locale.name(tmpShows[0].name)+')';
        }

        return {
          id: tag.id,
          name: tagName
        };
      });
    };

    this.tokenfields[type]._filterData = (val, data) => {
      return data;
    };
  }

  /**
   * [onbeforeupdate description]
   * @param  {[type]} vnode [description]
   */
  onbeforeupdate(vnode) {
    this.languages = vnode.attrs.languages;
    this.censorings = vnode.attrs.censorings;
  }

  /**
   * Display the form.
   *
   * @param  {[type]} vnode [description]
   * @return {[type]}       [description]
   */
  view(vnode) {
    if (this.languages && this.censorings) {
      return m('form', {id: 'book-form'}, [
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.name_original')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.name_japanese = v;
              }),
              value: this.formData.name_japanese,
              type: 'text',
              autocomplete: 'off',
              required: true,
              placeholder: locale.t('fields.book.name_original'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.name_romaji')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.name_romaji = v;
              }),
              value: this.formData.name_romaji,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('fields.book.name_romaji'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.name_english')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.name_english = v;
              }),
              value: this.formData.name_english,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('fields.book.name_english'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('artists')),
            m('input.input', {
              oncreate: (e) => {
                this.tokenize(e, 'artist', true, false, this.formData.artists);
              },
              oninput: m.withAttr('value', (v) => {
                this.formData.artists = v;
              }),
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('artists'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('circles')),
            m('input.input', {
              oncreate: (e) => {
                this.tokenize(e, 'circle', true, false, this.formData.circles);
              },
              oninput: m.withAttr('value', (v) => {
                this.formData.circles = v;
              }),
              value: this.formData.circles,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('circles'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('characters')),
            m('input.input', {
              oncreate: (e) => {
                this.tokenize(
                  e,
                  'character',
                  true,
                  false,
                  this.formData.characters
                );
              },
              oninput: m.withAttr('value', (v) => {
                this.formData.characters = v;
              }),
              value: this.formData.characters,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('characters'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
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
          m('.control', [
            m('label.label', locale.t('content')),
            m('input.input', {
              oncreate: (e) => {
                this.tokenize(
                  e,
                  'content',
                  true,
                  false,
                  this.formData.content
                );
              },
              oninput: m.withAttr('value', (v) => {
                this.formData.content = v;
              }),
              value: this.formData.content,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('content'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.convention')),
            m('input.input', {
              oncreate: (e) => {
                this.tokenize(
                  e,
                  'convention',
                  false,
                  false,
                  this.formData.convention
                );
              },
              oninput: m.withAttr('value', (v) => {
                this.formData.convention = v;
              }),
              value: this.formData.convention,
              type: 'text',
              autocomplete: 'off',
              placeholder: locale.t('fields.book.convention'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.language')),
              m('select.input', {
              onchange: () => {
                this.formData.language = this.value;
              },
              disabled: this.isLoading,
            }, [
              this.languages.map((language) => {
                return m('option', {
                  value: language.id,
                  selected: (this.formData.language === language.id),
                }, locale.name(language.name));
              }),
            ]),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.censoring')),
            m('select.input', {
              onchange: () => {
                this.formData.censoring = this.value;
              },
              disabled: this.isLoading,
            }, [
              this.censorings.map((censoring) => {
                return m('option', {
                  value: censoring.id,
                  selected: (this.formData.censoring === censoring.id),
                }, locale.name(censoring.name));
              }),
            ]),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.release_date')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.date_released = v;
              }),
              value: this.formData.date_released,
              type: 'date',
              autocomplete: 'off',
              placeholder: locale.t('fields.book.release_date'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.pages')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.pages = v;
              }),
              value: this.formData.pages,
              type: 'number',
              autocomplete: 'off',
              placeholder: locale.t('fields.book.pages'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.price')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.price = v;
              }),
              value: this.formData.price,
              type: 'number',
              autocomplete: 'off',
              placeholder: locale.t('fields.book.price'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.is_adult')),
            m('label.radio', m('input', {
              name: 'is_adult',
              onchange: () => {
                this.formData.is_adult = true;
              },
              type: 'radio',
              value: true,
              checked: (this.formData.is_adult == true),
              disabled: this.isLoading,
            }),
            locale.t('yes')),
            m('label.radio', m('input', {
              name: 'is_adult',
              onchange: () => {
                this.formData.is_adult = false;
              },
              type: 'radio',
              value: false,
              checked: (!this.formData.is_adult
                || this.formData.is_adult == false
              ),
              disabled: this.isLoading,
            }),
            locale.t('no')),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.is_anthology')),
            m('label.radio', m('input', {
              name: 'is_anthology',
              onchange: () => {
                this.formData.is_anthology = true;
              },
              type: 'radio',
              value: true,
              checked: (this.formData.is_anthology == true),
              disabled: this.isLoading,
            }),
            locale.t('yes')),
            m('label.radio', m('input', {
              name: 'is_anthology',
              onchange: () => {
                this.formData.is_anthology = false;
              },
              type: 'radio',
              value: false,
              checked: (!this.formData.is_anthology
                || this.formData.is_anthology == false
              ),
              disabled: this.isLoading,
            }),
            locale.t('no')),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.is_copybook')),
            m('label.radio', m('input', {
              name: 'is_copybook',
              onchange: () => {
                this.formData.is_copybook = true;
              },
              type: 'radio',
              value: true,
              checked: (this.formData.is_copybook == true),
              disabled: this.isLoading,
            }),
            locale.t('yes')),
            m('label.radio', m('input', {
              name: 'is_copybook',
              onchange: () => {
                this.formData.is_copybook = false;
              },
              type: 'radio',
              value: false,
              checked: (!this.formData.is_copybook
                || this.formData.is_copybook == false
              ),
              disabled: this.isLoading,
            }),
            locale.t('no')),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.is_novel')),
            m('label.radio', m('input', {
              name: 'is_novel',
              onchange: () => {
                this.formData.is_novel = true;
              },
              type: 'radio',
              value: true,
              checked: (this.formData.is_novel == true),
              disabled: this.isLoading,
            }),
            locale.t('yes')),
            m('label.radio', m('input', {
              name: 'is_novel',
              onchange: () => {
                this.formData.is_novel = false;
              },
              type: 'radio',
              value: false,
              checked: (!this.formData.is_novel
                || this.formData.is_novel == false
              ),
              disabled: this.isLoading,
            }),
            locale.t('no')),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.links.toranoana')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.toranoana = v;
              }),
              value: this.formData.links.toranoana,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.toranoana'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.links.melonbooks')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.melonbooks = v;
              }),
              value: this.formData.links.melonbooks,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.melonbooks'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.links.boothpm')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.boothpm = v;
              }),
              value: this.formData.links.boothpm,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.boothpm'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.links.alice')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.alice = v;
              }),
              value: this.formData.links.alice,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.alice'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.links.dlsite')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.dlsite = v;
              }),
              value: this.formData.links.dlsite,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.dlsite'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.links.dmm')),
            m('input.input', {
              oninput: m.withAttr('value', (v) => {
                this.formData.links.dmm = v;
              }),
              value: this.formData.links.dmm,
              type: 'link',
              autocomplete: 'off',
              placeholder: locale.t('fields.links.dmm'),
              disabled: this.isLoading,
            }),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.cover')),
            m('.dropzone.cover-previews', {
              id: 'coverZone',
              oncreate: () => {
                let parentNode = this;

                new Dropzone('div#coverZone', {
                  url: '#',
                  previewsContainer: '.cover-previews',
                  autoProcessQueue: false,
                  addRemoveLinks: true,
                  maxFiles: 1,
                  dictRemoveFile: '<i class="delete is-large"></i>',
                  thumbnailWidth: 300,
                  thumbnailHeight: 300,
                  init: function() {
                    if (parentNode.cover != null) {
                      let url = parentNode.cover;

                      let filename = url.substring(url.lastIndexOf('/')+1);

                      let mockCover = {
                        name: filename,
                        size: 1,
                        type: 'image/jpeg',
                        existing: true,
                      };

                      this.emit('addedfile', mockCover);
                      this.options.thumbnail.call(
                        this,
                        mockCover,
                        parentNode.cover
                      );
                      this.emit('complete', mockCover);
                      this.files.push(mockCover);

                      mockCover._removeLink.innerHTML =
                        this.options.dictRemoveFile;
                    }

                    this.on('addedfile', (file) => {
                      if (this.files[1] != null) {
                        this.removeFile(this.files[0]);
                      }

                      parentNode.formData.cover = file;
                    });

                    this.on('removedfile', (file) => {
                      parentNode.formData.cover = null;
                    });
                  },
                });
              },
            }, ''),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('label.label', locale.t('fields.book.samples')),
            m('.dropzone.sample-previews', {
              id: 'samplesZone',
              oncreate: () => {
                let parentNode = this;

                new Dropzone('div#samplesZone', {
                  url: '#',
                  previewsContainer: '.sample-previews',
                  autoProcessQueue: false,
                  addRemoveLinks: true,
                  dictRemoveFile: '<i class="delete is-large"></i>',
                  thumbnailWidth: 300,
                  thumbnailHeight: 300,
                  init: function() {
                    if (parentNode.samples && parentNode.samples.length > 0) {
                      parentNode.samples.map((sample) => {
                        let url = sample;
                        let filename = url.substring(url.lastIndexOf('/')+1);

                        let mockSample = {
                          name: filename,
                          size: 1,
                          type: 'image/jpeg',
                          existing: true,
                        };

                        this.emit('addedfile', mockSample);
                        this.options.thumbnail.call(this, mockSample, sample);
                        this.emit('complete', mockSample);
                        this.files.push(mockSample);

                        mockSample._removeLink.innerHTML =
                          this.options.dictRemoveFile;
                      });
                    }

                    this.on('addedfile', (file) => {
                      parentNode.formData.samples.push(file);
                    });

                    this.on('removedfile', (file) => {
                      if (!file.existing) {
                        let removeIndex = parentNode.formData.samples
                        .map((item) => {
                          return item.name;
                        }).indexOf(file.name);

                        if (removeIndex >= 0) {
                          parentNode.formData.samples.splice(removeIndex, 1);
                        }
                      } else {
                        parentNode.formData.removed_samples.push(file.name);
                      }
                    });
                  },
                });
              },
            }, ''),
          ]),
        ]),
        m('.field', [
          m('.control', [
            m('button', {
              class: 'button is-primary is-fullwidth'
                + (this.isLoading ? ' is-loading' : ''
              ),
              onclick: (e) => {
                e.preventDefault();
                this.onCreateButtonClick();
              },
              disabled: this.isLoading,
            }, (this.book ?
              locale.t('buttons.book_update') : locale.t('buttons.book_create'))
            ),
          ]),
        ]),
      ]);
    }
  }
}
