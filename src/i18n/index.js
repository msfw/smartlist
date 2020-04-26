import Vue from "vue";
import VueI18n from "vue-i18n";
//import en from './lang/en'
import * as langs from './lang';
import { camelActual } from '../utils/helper'

Vue.use(VueI18n);

export function createI18n() {

  let locale = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
  locale = camelActual(locale)
  const messages = langs

  return new VueI18n({
    locale: locale, // set locale
    fallbackLocale: 'en',
    messages
  });
}
