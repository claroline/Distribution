import React from 'React'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import MenuItem from 'react-bootstrap/lib/MenuItem'

import {t, trans} from '#/main/core/translation'

import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions} from '#/main/core/administration/theme/actions'

import {select} from '#/main/core/administration/theme/selectors'

import {
  PageContainer as Page,
  PageHeader,
  PageContent,
  PageGroupActions,
  PageActions,
  PageAction,
  MoreAction
} from '#/main/core/layout/page/index'

import {HelpBlock} from '#/main/core/layout/form/components/help-block.jsx'
import {FormSections} from '#/main/core/layout/form/components/form-sections.jsx'
import {TextGroup}    from '#/main/core/layout/form/components/text-group.jsx'
import {FlagGroup}    from '#/main/core/layout/form/components/flag-group.jsx'

import {Color}        from './fields/color.jsx'
import {FontSize}     from './fields/font-size.jsx'
import {FontSelector} from './fields/font-selector.jsx'
import {Size}         from './fields/size.jsx'

const GeneralSection = props =>
  <div className="panel panel-default">
    <fieldset className="panel-body">
      <h2 className="sr-only">General properties</h2>

      <TextGroup
        controlId="theme-name"
        label={trans('theme_name', {}, 'theme')}
        value={props.theme.name}
        onChange={(value) => true}
      />

      <TextGroup
        controlId="theme-description"
        label={trans('theme_description', {}, 'theme')}
        value={props.theme.meta.description}
        long={true}
        onChange={(value) => true}
      />

      <FlagGroup
        controlId="theme-extend-default"
        label={trans('theme_extend_default', {}, 'theme')}
        active={props.theme.parameters.extendDefault}
        onChange={active => true}
        help={trans('theme_extend_default_help', {}, 'theme')}
      />

      <FlagGroup
        controlId="theme-enabled"
        label={trans('theme_enabled', {}, 'theme')}
        active={props.theme.meta.enabled}
        onChange={active => true}
        help={trans('theme_enabled_help', {}, 'theme')}
      />
    </fieldset>
  </div>

GeneralSection.propTypes = {
  theme: T.shape({
    name: T.string.isRequired,
    current: T.bool.isRequired,
    meta: T.shape({
      description: T.string,
      enabled: T.bool,
    }).isRequired,
    parameters: T.shape({
      extendDefault: T.bool
    }).isRequired
  }).isRequired
}

const TypoSection = props =>
  <div>
    <fieldset>
      <legend>{trans('font_headings', {}, 'theme')}</legend>
      <div className="sub-fields">
        <FontSelector
          controlId="headings-font"
          value="Century Gothic"
          onChange={(value) => true}
        />
        <FontSize controlId="headings-size" />
      </div>
    </fieldset>

    <fieldset>
      <legend>{trans('font_content', {}, 'theme')}</legend>
      <div className="sub-fields">
        <FontSelector
          controlId="content-font"
          value="Arial"
          onChange={(value) => true}
        />
        <FontSize controlId="content-size" />
      </div>
    </fieldset>
  </div>

TypoSection.propTypes = {

}

const ColorsSection = props =>
  <fieldset>
    <div className="form-group">
      <label className="control-label">Primary & secondary</label>
      <div className="row primary-colors">
        <div className="col-md-6">
          <Color color="#148AC7" label={{text: 'primary', color: '#FFFFFF'}} />
          <HelpBlock help="Primary color is used to highlight important components." />
        </div>

        <div className="col-md-6">
          <Color color="#C51162" label={{text: 'secondary', color: '#FCD9E9'}} />
          <HelpBlock help="Secondary color is used to highlight user progression components." />
        </div>
      </div>
    </div>

    <div className="form-group">
      <label className="control-label">States</label>

      <div className="row semantic-colors">
        <div className="col-md-3">
          <Color color="#4F7302" label={{text : 'success', color: '#DAFD8D'}} />
        </div>

        <div className="col-md-3">
          <Color color="#ED9E2F" label={{text : 'warning', color: '#FAE0BC'}} />
        </div>

        <div className="col-md-3">
          <Color color="#BF0404" label={{text : 'danger', color: '#FFD5D5'}} />
        </div>

        <div className="col-md-3">
          <Color color="#024F73" label={{text : 'info', color: '#C9EDFE'}} />
        </div>
      </div>

      <a href="">
        <span className="fa fa-fw fa-retweet" /> Show reverse
      </a>
    </div>

    <div className="form-group">
      <label className="control-label">Gray scale</label>
      <div className="gray-scale">
        <Color color="#000000" />
        <Color color="#222222" />
        <Color color="#333333" />
        <Color color="#555555" />
        <Color color="#777777" />
        <Color color="#EEEEEE" />
        <Color color="#FFFFFF" />
      </div>
    </div>

    <div className="form-group layout-colors">
      <label className="control-label">Layout</label>
      <Color color="#262626" label={{text: 'header',  color: '#BFBFBF'}} style={{borderBottom: '3px solid #148ac7'}} />
      <Color color="#FAFAFA" label={{text: 'content', color: '#333333'}} />
      <Color color="#F3F3F3" label={{text: 'footer',  color: '#777777'}} />
    </div>
  </fieldset>

ColorsSection.propTypes = {

}

const SizingSection = props =>
  <fieldset>
    <Size
      controlId="app-width"
      label={trans('app_max_width', {}, 'theme')}
      value={1200}
      onChange={(value) => true}
    />
  </fieldset>

SizingSection.propTypes = {

}

const ExtraSection = props =>
  <fieldset>
    <FlagGroup
      controlId="enable-shadows"
      label={trans('enable_shadows', {}, 'theme')}
      active={true}
      onChange={active => true}
    />

    <FlagGroup
      controlId="enable-border-radius"
      label={trans('enable_border_radius', {}, 'theme')}
      active={true}
      onChange={active => true}
    />
  </fieldset>

ExtraSection.propTypes = {

}

const Theme = props =>
  <Page id="theme-form">
    <PageHeader
      title={t('themes_management')}
      subtitle={props.theme.name}
    >
      <PageActions>
        <PageGroupActions>
          <PageAction
            id="theme-add"
            title={trans('save_theme', {}, 'theme')}
            icon="fa fa-floppy-o"
            primary={true}
            action="#"
          />
        </PageGroupActions>

        <PageGroupActions>
          <PageAction
            id="themes-list"
            title={trans('themes_list', {}, 'theme')}
            icon="fa fa-list"
            action="#/"
          />
          <MoreAction id="theme-more">
            <MenuItem header={true}>{t('more_actions')}</MenuItem>

            <MenuItem href="#">
              <span className="fa fa-fw fa-refresh" />
              {trans('rebuild_theme', {}, 'theme')}
            </MenuItem>

            <MenuItem href="#">
              <span className="fa fa-fw fa-copy" />
              {trans('copy_theme', {}, 'theme')}
            </MenuItem>

            <MenuItem href="#">
              <span className="fa fa-fw fa-upload" />
              {trans('export_theme', {}, 'theme')}
            </MenuItem>

            <MenuItem divider={true} />

            <MenuItem
              className="dropdown-link-danger"
              onClick={e => {
                {/*e.stopPropagation()
                props.showModal(MODAL_DELETE_CONFIRM, {
                  title: trans('delete', {}, 'theme'),
                  question: trans('delete_confirm_question', {}, 'theme'),
                  handleConfirm: () => true
                })*/}
              }}
            >
              <span className="fa fa-fw fa-trash" />
              {trans('delete_theme', {}, 'theme')}
            </MenuItem>
          </MoreAction>
        </PageGroupActions>
      </PageActions>
    </PageHeader>

    <PageContent>
      <GeneralSection theme={props.theme} />

      <FormSections
        level={2}
        sections={[
          {
            id      : 'theme-colors',
            label   : 'Color schemes',
            icon    : 'fa fa-fw fa-tint',
            children: <ColorsSection />
          }, {
            id      : 'theme-typo',
            label   : 'Typo & fonts',
            icon    : 'fa fa-fw fa-font',
            children: <TypoSection />
          }, {
            id      : 'theme-sizing',
            label   : 'Sizing',
            icon    : 'fa fa-fw fa-arrows-h',
            children: <SizingSection />
          }, {
            id      : 'theme-extra',
            label   : 'Extra features',
            icon    : 'fa fa-fw fa-ellipsis-h',
            children: <ExtraSection />
          }
        ]}
      />
    </PageContent>
  </Page>

Theme.propTypes = {
  // themes
  theme: T.shape({
    name: T.string.isRequired,
    current: T.bool.isRequired,
    meta: T.shape({
      description: T.string,
      enabled: T.bool,
    }).isRequired,
    parameters: T.shape({
      extendDefault: T.bool
    }).isRequired
  }).isRequired,
  copyTheme: T.func.isRequired,
  rebuildThemes: T.func.isRequired,
  removeThemes: T.func.isRequired,

  // modals
  showModal: T.func.isRequired
}

function mapStateToProps(state, onwProps) {
  return {
    theme: select.themes(state).find(theme => onwProps.match.params.id === theme.id)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // modals
    showModal(modalType, modalProps) {
      dispatch(modalActions.showModal(modalType, modalProps))
    },

    // themes
    copyTheme: () => {
      dispatch(actions.copyTheme())
    },

    rebuildThemes: (themes) => {
      dispatch(actions.rebuildThemes(themes))
    },

    removeThemes: (themes) => {
      dispatch(actions.removeThemes(themes))
    }
  }
}

const ConnectedTheme = withRouter(connect(mapStateToProps, mapDispatchToProps)(Theme))

export {ConnectedTheme as Theme}
