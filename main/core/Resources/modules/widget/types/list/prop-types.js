import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'

import {constants as listConstants} from '#/main/app/content/list/constants'

import {WidgetInstance} from '#/main/core/widget/content/prop-types'

const ListWidgetParameters = {
  propTypes: {
    display: T.string,
    availableDisplays: T.arrayOf(T.string),

    filterable: T.bool,
    filters: T.arrayOf(T.shape({
      property: T.string.isRequired,
      value: T.any,
      locked: T.bool
    })),
    availableFilters: T.arrayOf(T.string),

    sortable: T.bool,

    paginated: T.bool,
    pageSize: T.number,
    availablePageSizes: T.arrayOf(T.number),

    availableColumns: T.array
  },
  defaultProps: {
    display: listConstants.DEFAULT_DISPLAY_MODE,
    availableDisplays: [
      listConstants.DISPLAY_TABLE,
      listConstants.DISPLAY_TABLE_SM,
      listConstants.DISPLAY_TILES,
      listConstants.DISPLAY_TILES_SM,
      listConstants.DISPLAY_LIST_SM,
      listConstants.DISPLAY_LIST
    ],
    filterable: listConstants.DEFAULT_FEATURES.filterable,
    sortable: listConstants.DEFAULT_FEATURES.sortable,
    paginated: listConstants.DEFAULT_FEATURES.paginated,
    pageSize: listConstants.DEFAULT_PAGE_SIZE,
    availablePageSizes: listConstants.AVAILABLE_PAGE_SIZES
  }
}

const ListWidget = implementPropTypes({}, WidgetInstance, {
  parameters: ListWidgetParameters.propTypes
}, {
  parameters: ListWidgetParameters.defaultProps
})

export {
  ListWidget,
  ListWidgetParameters
}
