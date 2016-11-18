import {Match as component} from './match.jsx'

function reduce(match = {}) {
  return match
}

export default {
  type: 'application/x.match+json',
  name: 'match-1',
  component,
  reduce
}
