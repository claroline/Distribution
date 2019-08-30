import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'

import {Button} from '#/main/app/action/components/button'
import {LINK_BUTTON} from '#/main/app/buttons'

const WorkspaceRegistration = (props) => {
  if (props.registered) {
    return (
      <Fragment>

      </Fragment>
    )
  }

  return (
    <Fragment>
      {props.authenticated &&
        <Button
          type={LINK_BUTTON}
          icon="fa fa-fw fa-sign-in"
          label="M'inscrire à l'espace d'activités"
          target="/"
        />
      }
    </Fragment>
  )
}

WorkspaceRegistration.propTypes = {
  authenticated: T.bool.isRequired,
  registered: T.bool.isRequired,
  validation: T.bool.isRequired
}

export {
  WorkspaceRegistration
}
