import {createSelector} from 'reselect'

const announce = state => state.announce
const posts = createSelector(
  [announce],
  (announce) => announce.posts
)

export const select = {
  announce,
  posts
}
