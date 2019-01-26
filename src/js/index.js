'use strict';

import '@fortawesome/fontawesome-free/js/all'
import './../scss/main.scss';

import pace from 'pace-progress';
import Router from './ui/router';

import locale from './ui/locale';
import i18next from 'i18next';

i18next.init({
  lng: locale.getLang(),
  fallbackLng: process.env.DEFAULT_LANGUAGE,
  resources: {
    en: {translation: require('./languages/en.js')},
    ja: {translation: require('./languages/ja.js')},
  },
});

pace.start();

new Router().init();
