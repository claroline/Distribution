import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import invariant from 'invariant'
import get from 'lodash/get'
import merge from 'lodash/merge'

import {t} from '#/main/core/translation'
import {getTypeOrDefault} from '#/main/core/layout/data'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {ToggleableSet} from '#/main/core/layout/form/components/fieldset/toggleable-set.jsx'

const FormField = props => {
  const typeDef = getTypeOrDefault(props.type)
  invariant(typeDef.components.form, `form component cannot be found for '${props.type}'`)

  return React.createElement(typeDef.components.form, merge({}, props.options, {
    id: props.name,
    label: props.label,
    hideLabel: props.hideLabel,
    disabled: props.disabled,
    help: props.help,
    error: props.error,
    warnOnly: !props.validating,
    value: props.value,
    onChange: props.onChange
  }))
}

FormField.propTypes = {
  validating: T.bool,

  name: T.string.isRequired,
  type: T.string,
  label: T.string.isRequired,
  help: T.string,
  hideLabel: T.bool,
  disabled: T.bool,
  options: T.object,
  onChange: T.func,

  value: T.any,
  error: T.string
}

const AdvancedSection = props =>
  <ToggleableSet
    showText={props.showText}
    hideText={props.hideText}
  >
    {props.fields.map(field =>
      <FormField
        key={field.name}
        {...field}
      />
    )}
  </ToggleableSet>

AdvancedSection.propTypes = {
  showText: T.string,
  hideText: T.string,
  fields: T.array.isRequired
}

AdvancedSection.defaultProps = {
  showText: t('show_advanced_options'),
  hideText: t('hide_advanced_options')
}

class Form extends Component {
  constructor(props) {
    super(props)

    this.warnPendingChanges = this.warnPendingChanges.bind(this)
  }

  warnPendingChanges(e) {
    if (this.props.pendingChanges) {
      // note: this is supposed to be the text displayed in the browser built-in
      // popup (see https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload#Example)
      // but it doesn't seem to be actually used in modern browsers. We use it
      // here because a string is needed anyway.
      e.returnValue = t('unsaved_changes_warning')

      return e.returnValue
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.warnPendingChanges)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.warnPendingChanges)
  }

  render() {
    const primarySection = 1 === this.props.sections.length ? this.props.sections[0] : this.props.sections.find(section => section.primary)
    const otherSections = this.props.sections.filter(section => section !== primarySection)
    const openedSection = otherSections.find(section => section.defaultOpened)

    return (
      <form action="#" className={classes('form', this.props.className)}>
        {primarySection &&
          <div className="panel panel-default">
            <fieldset className="panel-body">
              {React.createElement('h'+this.props.level, {
                className: 'sr-only'
              }, primarySection.title)}

              {primarySection.fields.map(field =>
                <FormField
                  {...field}
                  key={field.name}
                  disabled={field.disabled ? field.disabled(this.props.data) : false}
                  value={get(this.props.data, field.name)}
                  error={get(this.props.errors, field.name)}
                  onChange={(value) => this.props.updateProp(field.name, value)}
                />
              )}

              {primarySection.advanced &&
                <AdvancedSection {...primarySection.advanced} />
              }
            </fieldset>
          </div>
        }

        {0 !== otherSections &&
          <FormSections
            level={this.props.level}
            defaultOpened={openedSection ? openedSection.id : undefined}
          >
            {otherSections.map(section =>
              <FormSection
                key={section.id}
                id={section.id}
                icon={section.icon}
                title={section.title}
                errors={this.props.errors}
                validating={this.props.validating}
              >
                {section.fields.map(field =>
                  <FormField
                    {...field}
                    key={field.name}
                    disabled={field.disabled ? field.disabled(this.props.data) : false}
                    value={get(this.props.data, field.name)}
                    error={get(this.props.errors, field.name)}
                    onChange={(value) => this.props.updateProp(field.name, value)}
                  />
                )}

                {section.advanced &&
                <AdvancedSection {...section.advanced} />
                }
              </FormSection>
            )}
          </FormSections>
        }

        {this.props.children &&
          <hr />
        }

        {this.props.children}
      </form>
    )
  }
}

Form.propTypes = {
  level: T.number,
  data: T.object,
  errors: T.object,
  validating: T.bool,
  pendingChanges: T.bool,
  sections: T.arrayOf(T.shape({
    id: T.string.isRequired,
    icon: T.string,
    title: T.string.isRequired,
    primary: T.bool,
    defaultOpened: T.bool,
    fields: T.arrayOf(T.shape({
      name: T.string.isRequired,
      type: T.string,
      label: T.string.isRequired,
      help: T.string,
      hideLabel: T.bool,
      disabled: T.func,
      options: T.object,
      onChange: T.func
    })).isRequired,
    advanced: T.shape({
      showText: T.string,
      hideText: T.string,
      fields: T.arrayOf(T.shape({
        // same as regular fields
      })).isRequired
    })
  })).isRequired,
  updateProp: T.func.isRequired,
  className: T.string,
  children: T.element
}

Form.defaultProps = {
  data: {},
  level: 2,
  errors: {},
  validating: false,
  pendingChanges: false
}

export {
  Form
}