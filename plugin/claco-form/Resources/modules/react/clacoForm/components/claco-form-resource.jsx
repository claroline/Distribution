import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {Route, Switch, withRouter} from 'react-router-dom'
import {ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'
import {trans} from '#/main/core/translation'
import {actions} from '../actions'
import {ClacoFormMainMenu} from './claco-form-main-menu.jsx'
import {ClacoFormConfig} from './claco-form-config.jsx'
import {CategoriesList} from '../../category/components/categories-list.jsx'
import {KeywordsList} from '../../keyword/components/keywords-list.jsx'
import {FieldsList} from '../../field/components/fields-list.jsx'
import {TemplateForm} from '../../template/components/template-form.jsx'

const ClacoFormResource = props =>
  <ResourceContainer
    editor={{
      opened: '/edit' === props.location.pathname,
      open: '#/edit',
      save: {
        disabled: false,
        action: props.saveParameters
      }
    }}
    customActions={customActions(props)}
  >
    <Switch>
      <Route path="/" component={ClacoFormMainMenu} exact={true} />
      <Route path="/edit" component={ClacoFormConfig} />
      <Route path="/categories" component={CategoriesList} />
      <Route path="/keywords" component={KeywordsList} />
      <Route path="/fields" component={FieldsList} />
      <Route path="/template" component={TemplateForm} />
    </Switch>
  </ResourceContainer>

ClacoFormResource.propTypes = {
  location: T.shape({
    pathname: T.string.isRequired
  }).isRequired,
  saveParameters: T.func.isRequired
}

function customActions(props) {
  const actions = []

  actions.push({
    icon: 'fa fa-fw fa-home',
    label: trans('main_menu', {}, 'clacoform'),
    action: '#/'
  })

  if (props.canEdit) {
    actions.push({
      icon: 'fa fa-fw fa-th-list',
      label: trans('fields_management', {}, 'clacoform'),
      action: '#/fields'
    })
    actions.push({
      icon: 'fa fa-fw fa-file-text-o',
      label: trans('template_management', {}, 'clacoform'),
      action: '#/template'
    })
    actions.push({
      icon: 'fa fa-fw fa-table',
      label: trans('categories_management', {}, 'clacoform'),
      action: '#/categories'
    })
    actions.push({
      icon: 'fa fa-fw fa-font',
      label: trans('keywords_management', {}, 'clacoform'),
      action: '#/keywords'
    })
  }

  return actions
}

function mapStateToProps(state) {
  return {
    canEdit: state.canEdit
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveParameters: () => dispatch(actions.saveParameters())
  }
}

const ConnectedClacoFormResource = withRouter(connect(mapStateToProps, mapDispatchToProps)(ClacoFormResource))

export {ConnectedClacoFormResource as ClacoFormResource}
