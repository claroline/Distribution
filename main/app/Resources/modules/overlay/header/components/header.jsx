import React from 'react'
import {PropTypes as T} from 'prop-types'

import {HeaderBrand} from '#/main/app/overlay/header/components/brand'
import {HeaderLocale} from '#/main/app/overlay/header/components/locale'
import {HeaderTitle} from '#/main/app/overlay/header/components/title'
import {HeaderTools} from '#/main/app/overlay/header/components/tools'
import {HeaderUser} from '#/main/app/overlay/header/components/user'
import {HeaderWorkspaces} from '#/main/app/overlay/header/components/workspaces'

const Header = props =>
  <header className="app-header">
    {props.logo &&
      <HeaderBrand
        logo={props.logo}
      />
    }

    {props.title &&
      <HeaderTitle
        title={props.title}
        subtitle={props.subtitle}
      />
    }

    {0 !== props.tools.length &&
      <HeaderTools
        icon="fa fa-fw fa-wrench"
        label={trans('tools')}
        tools={props.tools}
      />
    }

    <HeaderWorkspaces
      {...props.workspaces}
    />

    {0 !== props.administration.length &&
      <HeaderTools
        icon="fa fa-fw fa-cogs"
        label={trans('administration')}
        tools={props.administration}
      />
    }

    <HeaderUser
      registration={props.registration}
      currentUser={props.currentUser}
      authenticated={props.authenticated}
      help={props.help}
    />

    <HeaderLocale locale={props.locale} />
  </header>

Header.propTypes = {
  locale: T.shape({
    current: T.string.isRequired,
    available: T.arrayOf(T.string).isRequired,
  }).isRequired,
  logo: T.shape({
    url: T.string.isRequired,
    colorized: T.bool
  }),
  title: T.string,
  subtitle: T.string,

  /**
   * The currently logged user.
   */
  currentUser: T.shape({

  }).isRequired,
  authenticated: T.bool.isRequired,

  tools: T.arrayOf(T.shape({

  })),

  administration: T.arrayOf(T.shape({

  })),

  registration: T.bool,
  help: T.string,
  workspaces: T.shape({
    personal: T.shape({

    }),
    current: T.shape({

    }),
    history: T.arrayOf(T.shape({

    }))
  }).isRequired
}

Header.defaultProps = {
  currentUser: null,
  tools: [],
  administration: [],
  registration: false
}

export {
  Header
}
