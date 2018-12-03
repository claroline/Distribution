import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {EmptyPlaceholder} from '#/main/core/layout/components/placeholder'

import {Organization as OrganizationType} from '#/main/core/user/prop-types'
import {OrganizationCard} from '#/main/core/user/data/components/organization-card'

const OrganizationDisplay = (props) => !isEmpty(props.data) ?
  <div>
    {props.data.map(organization =>
      <OrganizationCard
        key={`organization-card-${organization.id}`}
        data={organization}
        size="sm"
        orientation="col"
      />
    )}
  </div> :
  <EmptyPlaceholder
    size="lg"
    icon="fa fa-users"
    title={trans('no_organization')}
  />

OrganizationDisplay.propTypes = {
  data: T.arrayOf(T.shape(OrganizationType.propTypes))
}

export {
  OrganizationDisplay
}
