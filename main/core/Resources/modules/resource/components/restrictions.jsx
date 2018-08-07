import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {Button} from '#/main/app/action'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {Password} from '#/main/core/layout/form/components/field/password'
import {EmptyPlaceholder} from '#/main/core/layout/components/placeholder'

const Restriction = props =>
  <div className={classes('access-restriction alert alert-detailed', {
    'alert-success': props.validated,
    'alert-warning': !props.validated && props.onlyWarn,
    'alert-danger': !props.validated && !props.onlyWarn
  })}>
    <span className={classes('alert-icon', props.icon)} />

    <div className="alert-content">
      <h5 className="alert-title h4">{props.title}</h5>

      {props.help &&
        <p className="alert-text">{props.help}</p>
      }

      {props.children}
    </div>
  </div>

Restriction.propTypes = {
  icon: T.string.isRequired,
  title: T.string.isRequired,
  help: T.string,
  validated: T.bool.isRequired,
  onlyWarn: T.bool, // we only warn for restrictions that can be fixed
  children: T.node
}

Restriction.defaultProps = {
  validated: false,
  onlyWarn: false
}

const DeletedRestriction = props =>
  <Restriction
    icon="fa fa-fw fa-trash-o"
    title="La ressource est supprimée."
    help="Vous ne pouvez plus accéder au contenu des ressources supprimées."
  >
    <Button
      className="btn btn-default"
      type={ASYNC_BUTTON}
      icon="fa fa-fw fa-recycle"
      label={trans('restore', {}, 'actions')}
      request={{

      }}
    />
  </Restriction>

const PublishedRestriction = props =>
  <Restriction
    icon="fa fa-fw fa-eye-slash"
    title="La ressource n'est pas encore publiée."
    help="Veuillez patienter en attendant que l'un des gestionnaires publie la ressource."
  >
    <Button
      className="btn btn-default"
      type={ASYNC_BUTTON}
      icon="fa fa-fw fa-eye"
      label={trans('publish', {}, 'actions')}
      request={{

      }}
    />
  </Restriction>

const DateRestriction = props =>
  <Restriction
    icon="fa fa-fw fa-calendar"
    validated={props.validated}
  >
  </Restriction>

const CodeRestriction = props =>
  <Restriction
    icon="fa fa-fw fa-key"
    title="L'accès requiert un code."
    help="Veuillez saisir le code qui vous a été remis afin d'accéder à la ressource."
    validated={props.validated}
    onlyWarn={true}
  >
    {!props.validated &&
      <Password
        id="access-code"
        value=""
        onChange={() => true}
      />
    }
  </Restriction>

const LocationRestriction = props =>
  <Restriction
    icon="fa fa-fw fa-laptop"
    title="L'accès doit s'effectuer depuis un poste de travail authorisé."
    help="Veuillez utiliser l'un des postes de travail authorisés afin d'accéder à la ressource."
    validated={props.validated}
    onlyWarn={true}
  >

  </Restriction>

const ResourceRestrictions = props =>
  <div className="">
    <EmptyPlaceholder
      size="lg"
      icon="fa fa-lock"
      title={trans('restricted_access')}
      help={trans('restricted_access_message', {}, 'resource')}
    >
      <DeletedRestriction />

      <PublishedRestriction
        validated={false}
      />

      <DateRestriction
        validated={false}
      />

      <CodeRestriction
        validated={false}
      />

      <LocationRestriction
        validated={false}
      />
    </EmptyPlaceholder>

    {/*<h4 className="h3">Conditions à remplir</h4>*/}


  </div>

ResourceRestrictions.propTypes = {

}

export {
  ResourceRestrictions
}
