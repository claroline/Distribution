import {createSelector} from 'reselect'

const profile = state => state.profile

const currentTab = createSelector(
  [profile],
  (profile) => profile.currentTab
)

const tabs = createSelector(
  [profile],
  (profile) => profile.tabs
)

const sections = createSelector(
  [profile],
  (profile) => profile.sections
)

export const select = {
  profile,
  currentTab,
  tabs,
  sections
}
