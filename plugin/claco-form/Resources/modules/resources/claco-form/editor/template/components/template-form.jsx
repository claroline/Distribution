import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans, t} from '#/main/core/translation'
import {Textarea} from '#/main/core/layout/form/components/field/textarea.jsx'
import {Message} from '../../../components/message.jsx'
import {actions} from '../actions'
import {actions as clacoFormActions} from '../../../actions'
import {formatText, getFieldType} from '../../../utils'

class TemplateForm extends Component {
  componentDidMount() {
    this.props.initializeTemplate()
  }

  validateTemplate() {
    const requiredErrors = []
    const duplicatedErrors = []

    if (this.props.template) {
      const titleRegex = new RegExp('%clacoform_entry_title%', 'g')
      const titleMatches = this.props.template.match(titleRegex)

      if (titleMatches === null) {
        requiredErrors.push({name: 'clacoform_entry_title'})
      } else if (titleMatches.length > 1) {
        duplicatedErrors.push({name: 'clacoform_entry_title'})
      }
      this.props.fields.forEach(f => {
        if (!f.hidden) {
          const regex = new RegExp(`%${formatText(f.name)}%`, 'g')
          const matches = this.props.template.match(regex)

          if (f.required && matches === null) {
            requiredErrors.push(f)
          } else if (matches !== null && matches.length > 1) {
            duplicatedErrors.push(f)
          }
        }
      })
    }
    if (requiredErrors.length > 0 || duplicatedErrors.length > 0) {
      this.generateErrorMessage(requiredErrors, duplicatedErrors)
    } else {
      this.props.saveTemplate()
    }
  }

  generateErrorMessage(requiredErrors, duplicatedErrors) {
    let message = '<div className="alert alert-danger">'

    if (requiredErrors.length > 0) {
      message += `
        ${trans('template_missing_mandatory_variables_message', {}, 'clacoform')}
        <ul>
      `
      requiredErrors.forEach(e => {
        message += `
          <li>%${formatText(e.name)}%</li>
        `
      })
      message += '</ul>'
    }
    if (duplicatedErrors.length > 0) {
      message += `
        ${trans('template_duplicated_variables_message', {}, 'clacoform')}
        <ul>
      `
      duplicatedErrors.forEach(e => {
        message += `
          <li>%${formatText(e.name)}%</li>
        `
      })
      message += '</ul>'
    }
    message += '</div>'
    this.props.updateMessage(message, 'danger')
  }

  render() {
    return (
      <div>
        <h2>{trans('template_management', {}, 'clacoform')}</h2>
        <br/>
        {this.props.canEdit ?
          <div>
            <div className="alert alert-warning">
              <button type="button" className="close" data-dismiss="alert" aria-hidden="true">
                &times;
              </button>
              {trans('template_variables_message', {}, 'clacoform')}
              <hr/>
              <div>
                <h4>
                  {trans('mandatory', {}, 'clacoform')}
                  &nbsp;
                  <small>({trans('template_mandatory_variables_message', {}, 'clacoform')})</small>
                </h4>
                <ul>
                  <li>
                    <b>%clacoform_entry_title%</b> : {trans('entry_title_info', {}, 'clacoform')}
                  </li>
                  {this.props.fields.map(f => {
                    if (f.required && !f.hidden) {
                      return (
                        <li key={`required-${f.id}`}>
                          <b>%{formatText(f.name)}%</b> : {getFieldType(f.type).label}
                        </li>
                      )
                    }
                  })}
                </ul>
              </div>
              <div>
                <hr/>
                <h4>{trans('optional', {}, 'clacoform')}</h4>
                <ul>
                  {this.props.fields.map(f => {
                    if (!f.required && !f.hidden) {
                      return (
                        <li key={`optional-${f.id}`}>
                          <b>%{formatText(f.name)}%</b> : {getFieldType(f.type).label}
                        </li>
                      )
                    }
                  })}
                </ul>
              </div>
            </div>
            <Message/>
            <Textarea
              id="clacoform-template"
              title=""
              content={this.props.template}
              onChange={value => this.props.updateTemplate(value)}
            />
            <div className="template-buttons">
              <button className="btn btn-primary" onClick={() => this.validateTemplate()}>
                {t('ok')}
              </button>
              <a className="btn btn-default" href="#/">
                {t('cancel')}
              </a>
            </div>
          </div> :
          <div className="alert alert-danger">
            {t('unauthorized')}
          </div>
        }
      </div>
    )
  }
}

TemplateForm.propTypes = {
  canEdit: T.bool.isRequired,
  template: T.string,
  fields: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    type: T.number.isRequired,
    required: T.bool.isRequired
  })),
  initializeTemplate: T.func.isRequired,
  updateTemplate: T.func.isRequired,
  saveTemplate: T.func.isRequired,
  updateMessage: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    canEdit: state.canEdit,
    template: state.template,
    fields: state.fields
  }
}

function mapDispatchToProps(dispatch) {
  return {
    initializeTemplate: () => dispatch(actions.initializeTemplate()),
    updateTemplate: (template) => dispatch(actions.updateTemplate(template)),
    saveTemplate: () => dispatch(actions.saveTemplate()),
    updateMessage: (message, status) => dispatch(clacoFormActions.updateMessage(message, status))
  }
}

const ConnectedTemplateForm = connect(mapStateToProps, mapDispatchToProps)(TemplateForm)

export {ConnectedTemplateForm as TemplateForm}