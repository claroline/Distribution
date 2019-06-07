
const maintenance = state => state.maintenance
const impersonated = state => state.impersonated

const menuOpened = state => state.menu.opened
const menuSection = state => state.menu.section

const sidebar = state => state.sidebar.name

export const selectors = {
  maintenance,
  impersonated,
  menuOpened,
  menuSection,
  sidebar
}
