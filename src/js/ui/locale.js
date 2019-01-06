'use strict';

import i18next from 'i18next';

/**
 * Initialize l18next module
 */
function _init() {
  i18next.init({
    lng: getLang(),
    fallbackLng: process.env.DEFAULT_LANGUAGE,
    resources: {
      en: {translation: require('./../languages/en.js')},
      ja: {translation: require('./../languages/ja.js')},
    },
  });
}

/**
 * Provides the specific localized text.
 *
 * @param  {string} dict   The key for what text to grab.
 * @param  {object} variables Values which can be replaced in the specific text.
 * @return {string}       The localized text.
 */
function t(dict, variables = false) {
  _init();

  const translation = i18next.t(dict);

  if (variables == false) {
    return translation;
  } else {
    return _stringInjector(translation, variables);
  }
};

/**
 * Replaces values in the localized text.
 *
 * @param  {string} str The localization text.
 * @param  {object} o   The values to inject.
 * @return {string}     The localized text with values injected.
 */
function _stringInjector(str, o) {
  const regexp = /{([^{]+)}/g;

  return str.replace(regexp, function(ignore, key) {
    return (key = o[key]) == null ? '' : key;
  });
}

/**
 * Localization helper for returning locale based tag/book names.
 *
 * @param  {object} names The name object from book and tag objects.
 * @return {string}       The specific name to use for that locale.
 */
function name(names) {
  _init();

  if (i18next.language == 'en') {
    return (names.english ? names.english : names.romaji);
  } else {
    return names.japanese;
  }
};

/**
 * [subname description]
 * @param  {[type]} names [description]
 * @return {[type]}       [description]
 */
function subname(names) {
  _init();

   if (i18next.language == 'en') {
      return names.japanese;
    } else {
      return names.romaji;
    }
}

/**
 * Get the user's current locale subdomain.
 *
 * @return {string} The locale short code.
 */
function getLang() {
  const subdomain = window.location.href.split('/')[2].split('.')[0];
  return subdomain == 'ja' ? 'ja' : process.env.DEFAULT_LANGUAGE;
}

module.exports = {
  t: t,
  name: name,
  subname: subname,
  getLang: getLang,
};

