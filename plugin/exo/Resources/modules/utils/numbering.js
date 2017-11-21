import {
  NUMBERING_LITERAL,
  NUMBERING_NUMERIC
} from './../quiz/enums'

export function getNumbering(numberingType, idx) {
  switch (numberingType) {
    case NUMBERING_NUMERIC: return idx + 1
    case NUMBERING_LITERAL: return 'abcdefghijklmnopqrstuvwxyz'[idx]
    default: return null
  }
}
