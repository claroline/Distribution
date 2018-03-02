import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import filter from 'lodash/filter'

import {t} from '#/main/core/translation'
import {actions} from '#/main/core/administration/user/user/actions'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_CONFIRM} from '#/main/core/layout/modal'

import {ComparisonTable} from '#/main/core/data/comparisonTable/components/comparison-table.jsx'

const UsersMergeForm = props =>
  <ComparisonTable
    data={props.data}
    rows={[
      {
        name: 'firstName',
        label: t('firstName'),
        type: 'string'
      },
      {
        name: 'lastName',
        label: t('lastName'),
        type: 'string'
      },
      {
        name: 'username',
        label: t('username'),
        type: 'username'
      },
      {
        name: 'email',
        label: t('email'),
        type: 'email'
      },
      {
        name: 'meta.created',
        label: t('created'),
        type: 'date',
        options: {
          time: true
        }
      },
      {
        name: 'meta.lastLogin',
        label: t('lastLogin'),
        type: 'date',
        options: {
          time: true
        }
      },
      {
        name: 'meta.cas.id',
        label: t('casId'),
        type: 'string'
      },
      {
        name: 'meta.mailValidated',
        label: t('mailValidated'),
        type: 'boolean'
      },
      {
        name: 'restrictions.disabled',
        label: t('disabled'),
        type: 'boolean'
      }
    ]}
    action={{
      text: () => 'Conserver cet utilisateur',
      action: (selected, data) => props.mergeModal(selected, data),
      disabled: (selected) => selected.meta.loggedIn
    }}
    title={(selected) => t('username') + ' : ' + selected.username}
  />

UsersMergeForm.propTypes = {
  data: function (props, propName) {
    if (!Array.isArray(props[propName]) || props[propName].length != 2 || !props[propName].every((o) => typeof o === 'object')) {
      return new Error(`${propName} needs to be an array of two objects`)
    }
  },
  mergeModal: T.func.isRequired
}

const UsersMerge = connect(
  state => ({
    data: state.users.compare
  }),
  dispatch => ({
    mergeModal(selected, data) {
      dispatch(
        modalActions.showModal(MODAL_CONFIRM, {
          confirmButtonText: t('merge'),
          dangerous: true,
          question: `La fusion de comptes va conserver le compte de l'utilisateur ${selected.username}. Souhaitez-vous continuer ?`,
          handleConfirm: () => {
            let others = filter(data, (o) => o.id !== selected.id)
            dispatch(actions.merge(selected.id, others[0].id))
          }
        })
      )
    }
  })
)(UsersMergeForm)

export {
    UsersMerge
}