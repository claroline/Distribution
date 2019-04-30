import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'
import {withRouter} from '#/main/app/router'
import {makeId} from '#/main/core/scaffolding/id'

import {LtiTool as LtiToolComponent}  from '#/plugin/lti/administration/lti/components/tool'
import {actions} from '#/plugin/lti/administration/lti/store'
import {reducer} from '#/plugin/lti/administration/lti/store'

const LtiTool = withRouter(
  withReducer('apps', reducer)(
    connect(
      null,
      dispatch => ({
        openForm(id = null) {
          dispatch(actions.open('app', id, {
            id: makeId()
          }))
        },
        resetForm() {
          dispatch(actions.open('app', null, {}))
        }
      })
    )(LtiToolComponent)
  )
)

export {
  LtiTool
}
