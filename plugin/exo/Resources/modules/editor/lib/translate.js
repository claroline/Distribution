/* global Translator */

export function trans(...args) {
  return Translator.trans(...args)
}

export function transChoice(...args) {
  return Translator.transChoice(...args)
}

export function t(message) {
  return trans(message, {}, 'platform')
}

export function tex(message) {
  return trans(message, {}, 'ujm_exo')
}
