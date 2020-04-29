import ptBR from 'vee-validate/dist/locale/pt_BR.json'
import en from 'vee-validate/dist/locale/pt_BR.json'

export function getLocalization(i18n) {
  var messages = en;
  if (i18n.locale == 'ptBR')
  messages = ptBR

  return {
    locale: i18n.locale,
    messages: messages
  }
}

