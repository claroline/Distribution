import {createSelector} from 'reselect'

const text = state => state.text

const url = createSelector(
  [text],
  (text) => text.url
)

const hashName = createSelector(
  [text],
  (text) => text.hashName
)

export const select = {

  text,
  url,
  hashName
}
