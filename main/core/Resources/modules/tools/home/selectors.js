import {createSelector} from 'reselect'

const currentTabTitle = (state) => state.currentTabTitle
const editable = (state) => state.editable
const context = (state) => state.context
const tabs = (state) => state.tabs
const widgets = (state) => state.widgets

const currentTab = createSelector(
  [tabs, currentTabTitle],
  (tabs, currentTabTitle) => tabs.filter(tab => currentTabTitle === tab.title)
)

export const select = {
  currentTab,
  currentTabTitle,
  editable,
  context,
  tabs,
  widgets
}
