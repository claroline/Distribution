import {selectors as searchSelectors} from '#/main/app/content/search/store/selectors'
import {selectors as listSelectors} from '#/main/app/content/list/store/selectors'

import {select as baseSelectors} from '#/plugin/drop-zone/resources/dropzone/store/selectors'

const slideshowQueryString = (state) => {
  const queryParams = []

  const listState = listSelectors.list(state, baseSelectors.STORE_NAME+'.drops')

  // adds list filters
  const currentFilters = searchSelectors.queryString(
    listSelectors.filters(listState)
  )
  if (0 < currentFilters.length) {
    queryParams.push(currentFilters)
  }

  // adds sort by
  const currentSort = listSelectors.sortByQueryString(listState)
  if (0 < currentSort.length) {
    queryParams.push(currentSort)
  }

  if (0 !== queryParams.length) {
    return  '?' + queryParams.join('&')
  }

  return ''
}

export const selectors = {
  slideshowQueryString
}
