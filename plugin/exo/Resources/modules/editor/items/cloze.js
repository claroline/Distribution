import {Cloze as component} from './cloze.jsx'

function reduce(cloze = {}) {
  return cloze
}

export default {
  type: 'application/x.cloze+json',
  name: 'cloze',
  component,
  reduce
}
