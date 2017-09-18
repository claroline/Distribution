import {t} from '#/main/core/translation'

import {DataTable} from '#/main/core/layout/list/components/view/data-table.jsx'
import {DataGrid} from '#/main/core/layout/list/components/view/data-grid.jsx'

/**
 * Default configuration for list.
 * By default, all implemented features are enabled.
 *
 * @type {object}
 */
const DEFAULT_FEATURES = {
  async     : true,
  filterable: true,
  sortable  : true,
  selectable: true,
  paginated : true
}

const DISPLAY_TABLE    = 'table'
const DISPLAY_TABLE_SM = 'table-sm'
const DISPLAY_TILES    = 'tiles'
const DISPLAY_TILES_SM = 'tiles-sm'
const DISPLAY_LIST     = 'list'

const DEFAULT_DISPLAY_MODE = DISPLAY_TABLE

const DISPLAY_MODES = {
  [DISPLAY_TABLE_SM]: {
    icon: 'fa fa-fw fa-list',
    label: t('list_display_table_sm'),
    component: DataTable,
    size: 'sm',
    filterColumns: true // used to know if we need to enable the tool to filter displayed data properties
  },
  [DISPLAY_TABLE]: {
    icon: 'fa fa-fw fa-th-list',
    label: t('list_display_table'),
    component: DataTable,
    size: 'lg',
    filterColumns: true
  },
  [DISPLAY_LIST]: {
    icon: 'fa fa-fw fa-align-justify',
    label: t('list_display_list'),
    component: DataGrid,
    size: 'lg'
  },
  [DISPLAY_TILES_SM]: {
    icon: 'fa fa-fw fa-th',
    label: t('list_display_tiles_sm'),
    component: DataGrid,
    size: 'sm'
  },
  [DISPLAY_TILES]: {
    icon: 'fa fa-fw fa-th-large',
    label: t('list_display_tiles'),
    component: DataGrid,
    size: 'md'
  }
}

export const constants = {
  DEFAULT_FEATURES,
  DISPLAY_MODES,
  DEFAULT_DISPLAY_MODE,
  DISPLAY_TABLE,
  DISPLAY_TABLE_SM,
  DISPLAY_TILES,
  DISPLAY_TILES_SM,
  DISPLAY_LIST
}
