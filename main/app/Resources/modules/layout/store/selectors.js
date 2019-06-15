
const maintenance = state => state.maintenance
const impersonated = state => state.impersonated

const sidebar = state => state.sidebar.name

export const selectors = {
  maintenance,
  impersonated,
  sidebar
}
