import React from 'react'
import {PropTypes as T} from 'prop-types'

import {asset} from '#/main/app/config'
import {url} from '#/main/app/api'

// todo add alt

const SvgLogo = props =>
  <svg className="app-header-logo">
    <use xlinkHref={`${asset(props.url)}#logo-sm`} />
  </svg>

const StandardLogo = props =>
  <img
    className="app-header-logo"
    src={asset(props.url)}
  />

const HeaderBrand = props =>
  <div className="app-header-item app-header-brand">
    {(props.logo.colorized && props.redirectHome) &&
      <a href={url(['claro_index'])}>
        <SvgLogo url={props.logo.url} />
      </a>
    }
    {(props.logo.colorized && !props.redirectHome) &&
      <SvgLogo url={props.logo.url} />
    }

    {!props.logo.colorized &&
      <StandardLogo url={props.logo.url} />
    }
  </div>

HeaderBrand.propTypes = {
  logo: T.shape({
    url: T.string.isRequired,
    colorized: T.bool
  }).isRequired
}

export {
  HeaderBrand
}
