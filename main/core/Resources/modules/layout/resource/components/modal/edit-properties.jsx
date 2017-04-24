import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'

import Modal      from 'react-bootstrap/lib/Modal'
import Panel      from 'react-bootstrap/lib/Panel'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'

import {t}          from '#/main/core/translation'
import {formatDate} from '#/main/core/date'
import {t_res}      from '#/main/core/layout/resource/translation'
import {BaseModal}  from '#/main/core/layout/modal/components/base.jsx'
import {FormGroup}  from '#/main/core/layout/form/components/form-group.jsx'
import {Textarea}   from '#/main/core/layout/form/components/textarea.jsx'
import {DatePicker} from '#/main/core/layout/form/components/date-picker.jsx'

export const MODAL_RESOURCE_PROPERTIES = 'MODAL_RESOURCE_PROPERTIES'

const MetaPanel = props =>
  <fieldset>
    <FormGroup
      controlId={`resource-description`}
      label={t_res('resource_description')}
    >
      <Textarea
        id={`resource-description`}
        content={props.description}
        onChange={description => props.updateParameter('description', description)}
      />
    </FormGroup>

    <div className="checkbox">
      <label htmlFor="resource-published">
        <input
          id="resource-published"
          type="checkbox"
          checked={props.published}
          onChange={() => props.updateParameter('published', !props.published)}
        />
        {props.published ?
          t_res('resource_published') :
          t_res('resource_not_published')
        }
      </label>
    </div>
  </fieldset>

MetaPanel.propTypes = {
  description: T.string.isRequired,
  published: T.bool.isRequired,
  updateParameter: T.func.isRequired
}

const AccessibilityDatesPanel = props =>
  <fieldset>
    <FormGroup
      controlId="resource-accessible-from"
      label={t_res('resource_accessible_from')}
    >
      <DatePicker
        id="resource-accessible-from"
        name="resource-accessible-from"
        value={props.accessibleFrom}
        onChange={date => props.updateParameter('accessibleFrom', formatDate(date))}
      />
    </FormGroup>

    <FormGroup
      controlId="resource-accessible-until"
      label={t_res('resource_accessible_until')}
    >
      <DatePicker
        id="resource-accessible-until"
        name="resource-accessible-until"
        value={props.accessibleUntil}
        onChange={date => props.updateParameter('accessibleUntil', formatDate(date))}
      />
    </FormGroup>
  </fieldset>

AccessibilityDatesPanel.propTypes = {
  accessibleFrom: T.string.isRequired,
  accessibleUntil: T.string.isRequired,
  updateParameter: T.func.isRequired
}

const DisplayPanel = props =>
  <fieldset>
    <div className="checkbox">
      <label htmlFor="resource-fullscreen">
        <input
          id="resource-fullscreen"
          type="checkbox"
          checked={props.fullscreen}
          onChange={() => props.updateParameter('fullscreen', !props.fullscreen)}
        />
        {t_res('resource_fullscreen')}
      </label>
    </div>

    <div className="checkbox">
      <label htmlFor="resource-closable">
        <input
          id="resource-closable"
          type="checkbox"
          checked={props.closable}
          onChange={() => props.updateParameter('closable', !props.closable)}
        />
        {t_res('resource_closable')}
      </label>
    </div>

    <FormGroup
      controlId="resource-close-target"
      label={t_res('resource_close_target')}
    >
      <input
        id="resource-close-target"
        type="text"
        value={props.closeTarget}
        className="form-control"
        onChange={(e) => props.updateParameter('closeTarget', e.target.value)}
      />
    </FormGroup>
  </fieldset>

DisplayPanel.propTypes = {
  fullscreen: T.bool.isRequired,
  closable: T.bool.isRequired,
  closeTarget: T.string.isRequired,
  updateParameter: T.func.isRequired
}

const LicensePanel = props =>
  <fieldset>
    <FormGroup
      controlId="resource-authors"
      label={t_res('resource_authors')}
    >
      <input
        id="resource-authors"
        type="text"
        className="form-control"
        value={props.authors}
        onChange={(e) => props.updateParameter('authors', e.target.value)}
      />
    </FormGroup>

    <FormGroup
      controlId="resource-license"
      label={t_res('resource_license')}
    >
      <input
        id="resource-license"
        type="text"
        className="form-control"
        value={props.license}
        onChange={(e) => props.updateParameter('license', e.target.value)}
      />
    </FormGroup>
  </fieldset>

LicensePanel.propTypes = {
  authors: T.string.isRequired,
  license: T.string.isRequired,
  updateParameter: T.func.isRequired
}

function makePanel(key, Section, icon, title, props) {
  return (
    <Panel
      eventKey="resource-meta"
      header={
        <h5 className="panel-title">
          <span className="fa fa-fw fa-info" style={{marginRight: 10}} />
          Information
        </h5>
      }
    >
      <MetaPanel
        published={this.state.published}
        description={this.state.description}
        updateParameter={(parameter, value) => this.setState({[parameter]: value})}
      />
    </Panel>
  )
}

class EditPropertiesModal extends Component {
  constructor(props) {
    super(props)

    this.state = Object.assign({}, props)
  }

  render() {
    return (
      <BaseModal
        icon="fa fa-fw fa-pencil"
        title={t_res('edit-properties')}
        className="resource-edit-properties-modal"
        {...this.props}
      >
        <Modal.Body>
          <FormGroup
            controlId="resource-name"
            label={t_res('resource_name')}
          >
            <input
              id="resource-name"
              type="text"
              className="form-control"
              value={this.state.name}
              onChange={(e) => this.setState({name: e.target.value})}
            />
          </FormGroup>
        </Modal.Body>

        <PanelGroup
          accordion
          activeKey={this.state.openedPanel}
          onSelect={(activeKey) => this.setState({openedPanel: activeKey !== this.state.openedPanel ? activeKey : null})}
        >
          <Panel
            eventKey="resource-meta"
            header={
              <h5 className={classes('panel-title', {opened: 'resource-meta' === this.state.openedPanel})}>
                <span className="fa fa-fw fa-info" style={{marginRight: 10}} />
                Information
              </h5>
            }
          >
            <MetaPanel
              published={this.state.published}
              description={this.state.description}
              updateParameter={(parameter, value) => this.setState({[parameter]: value})}
            />
          </Panel>

          <Panel
            eventKey="resource-dates"
            header={
              <h5 className={classes('panel-title', {opened: 'resource-dates' === this.state.openedPanel})}>
                <span className="fa fa-fw fa-calendar" style={{marginRight: 10}} />
                Accessibility dates
              </h5>
            }
          >
            <AccessibilityDatesPanel
              accessibleFrom={this.state.accessibleFrom}
              accessibleUntil={this.state.accessibleUntil}
              updateParameter={(parameter, value) => this.setState({[parameter]: value})}
            />
          </Panel>

          <Panel
            eventKey="resource-display"
            header={
              <h5 className={classes('panel-title', {opened: 'resource-display' === this.state.openedPanel})}>
                <span className="fa fa-fw fa-desktop" style={{marginRight: 10}} />
                Display parameters
              </h5>
            }
          >
            <DisplayPanel
              fullscreen={this.state.fullscreen}
              closable={this.state.closable}
              closeTarget={this.state.closeTarget}
              updateParameter={(parameter, value) => this.setState({[parameter]: value})}
            />
          </Panel>

          <Panel
            eventKey="resource-license"
            header={
              <h5 className={classes('panel-title', {opened: 'resource-license' === this.state.openedPanel})}>
                <span className="fa fa-fw fa-copyright" style={{marginRight: 10}} />
                Authors & License
              </h5>
            }
          >
            <LicensePanel
              authors={this.state.authors}
              license={this.state.license}
              updateParameter={(parameter, value) => this.setState({[parameter]: value})}
            />
          </Panel>
        </PanelGroup>

        <button className="modal-btn btn btn-primary" onClick={() => this.props.save(this.state)}>
          {t('save')}
        </button>
      </BaseModal>
    )
  }
}

EditPropertiesModal.propTypes = {
  name: T.string.isRequired,
  description: T.string,
  accessibleFrom: T.string,
  accessibleUntil: T.string,
  closable: T.bool,
  closeTarget: T.string,
  authors: T.string,
  license: T.string,
  published: T.bool.isRequired,
  fullscreen: T.bool
  /*,

  save: T.func.isRequired*/
}

EditPropertiesModal.defaultProps = {
  description: '',
  accessibleFrom: '',
  accessibleUntil: '',
  closable: false,
  closeTarget: '',
  authors: '',
  license: '',
  fullscreen: false
}

export {EditPropertiesModal}
