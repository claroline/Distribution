import {reducer} from '#/plugin/lti/administration/lti/store'
import {LtiTool} from '#/plugin/lti/administration/lti/components/tool'

export const App = () => ({
  component: LtiTool,
  store: reducer,
  initialData: (initialData) => Object.assign({}, initialData)
})