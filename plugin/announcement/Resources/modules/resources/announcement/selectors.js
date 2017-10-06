import {createSelector} from 'reselect'

const pageSize = () => 5
const currentPage = state => state.currentPage
const sortOrder = state => state.sortOrder

const announcementForm = state => state.announcementForm
const formHasPendingChanges = createSelector(
  [announcementForm],
  (announcementForm) => announcementForm.pendingChanges
)
const formIsOpened = createSelector(
  [announcementForm],
  (announcementForm) => !!announcementForm.data
)
const formData = createSelector(
  [announcementForm],
  (announcementForm) => announcementForm.data
)

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
  (sortOrder, posts) => posts.slice().sort((a, b) => {
    if (null === a.meta.publishedAt || a.meta.publishedAt < b.meta.publishedAt) {
      return -1*sortOrder
    } else if (null === b.meta.publishedAt || a.meta.publishedAt > b.meta.publishedAt) {
      return 1*sortOrder
    }

    return 0
  })
)

const visibleSortedPosts = createSelector(
  [sortedPosts, pageSize, currentPage, sortOrder],
  (sortedPosts, pageSize, currentPage) => sortedPosts.slice(currentPage*pageSize, currentPage*pageSize+pageSize)
)

export const select = {
  posts,
  pageSize,
  currentPage,
  pages,
  sortOrder,
  announcement,
  visibleSortedPosts,
  formHasPendingChanges,
  formIsOpened,
  formData
}
