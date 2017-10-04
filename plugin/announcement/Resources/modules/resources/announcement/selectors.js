import {createSelector} from 'reselect'

const pageSize = () => 5
const currentPage = state => state.currentPage

const sortOrder = state => state.sortOrder
const announcement = state => state.announcement

const posts = createSelector(
  [announcement],
  (announcement) => announcement.posts
)

const pages = createSelector(
  [posts, pageSize],
  (posts, pageSize) => Math.ceil(posts.length / pageSize)
)

const sortedPosts = createSelector(
  [sortOrder, posts],
  (sortOrder, posts) => posts.sort((a, b) => {
    const sort = a.meta.publishedAt < b.meta.publishedAt ? -1 : 1

    return sort * sortOrder
  })
)

const visibleSortedPosts = createSelector(
  [posts, pageSize, currentPage, sortOrder],
  (posts, pageSize, currentPage, sortOrder) => posts
)

export const select = {
  pageSize,
  currentPage,
  pages,
  sortOrder,
  announcement,
  visibleSortedPosts
}
