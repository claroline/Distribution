/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/
/*global Translator*/
import $ from 'jquery'

export default class ClacoFormService {
  constructor ($http, $uibModal, EntryService) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.EntryService = EntryService
    this.isAnon = ClacoFormService._getGlobal('isAnon')
    this.canEdit = ClacoFormService._getGlobal('canEdit')
    this.userId = ClacoFormService._getGlobal('userId')
    this.resourceId = ClacoFormService._getGlobal('resourceId')
    this.template = ClacoFormService._getGlobal('template')
    this.resourceDetails = ClacoFormService._getGlobal('resourceDetails')
    this.resourceNodeId = ClacoFormService._getGlobal('resourceNodeId')
    this.resourceNodeName = ClacoFormService._getGlobal('resourceNodeName')
    this.successMessage = null
  }

  getIsAnon () {
    return this.isAnon
  }

  getUserId () {
    return this.userId
  }

  getCanEdit () {
    return this.canEdit
  }

  getCanCreateEntry () {
    return this.resourceDetails['creation_enabled'] &&
      !(this.isAnon && this.resourceDetails['max_entries'] > 0) &&
      !(this.resourceDetails['max_entries'] > 0 && this.EntryService.getNbMyEntries() >= this.resourceDetails['max_entries'])
  }

  getCanSearchEntry () {
    return this.resourceDetails['search_enabled'] === 'all' || this.canEdit || !this.isAnon
  }

  getResourceId () {
    return this.resourceId
  }

  getTemplate () {
    return this.template
  }

  getResourceDetails () {
    let details = {}

    for (const key in this.resourceDetails) {
      details[key] = this.resourceDetails[key]
    }

    return details
  }

  getResourceNodeId () {
    return this.resourceNodeId
  }

  getResourceNodeName () {
    return this.resourceNodeName
  }

  getSuccessMessage () {
    return this.successMessage
  }

  setSuccessMessage (message) {
    this.successMessage = message
  }

  clearSuccessMessage () {
    this.successMessage = null
  }

  saveConfiguration (resourceId, config) {
    const url = Routing.generate('claro_claco_form_configuration_edit', {clacoForm: resourceId})

    return this.$http.put(url, {configData: config}).then(d => {
      if (d['status'] === 200) {
        this.successMessage = Translator.trans('config_success_message', {}, 'clacoform')
        this.resourceDetails = d['data']

        return true
      }
    })
  }

  saveTemplate (resourceId, template) {
    const url = Routing.generate('claro_claco_form_template_edit', {clacoForm: resourceId})

    return this.$http.put(url, {template: template}).then(d => {
      if (d['status'] === 200) {
        this.successMessage = Translator.trans('template_success_message', {}, 'clacoform')
        this.template = d['data']['template']

        return true
      }
    })
  }

  getTinymceConfiguration () {
    let tinymce = window.tinymce
    tinymce.claroline.init = tinymce.claroline.init || {}
    tinymce.claroline.plugins = tinymce.claroline.plugins || {}

    let plugins = [
      'autoresize advlist autolink lists link image charmap print preview hr anchor pagebreak',
      'searchreplace wordcount visualblocks visualchars fullscreen',
      'insertdatetime media nonbreaking save table directionality',
      'template paste textcolor emoticons code -accordion -mention -codemirror'
    ]
    let toolbar = 'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | fullscreen displayAllButtons'

    $.each(tinymce.claroline.plugins, (key, value) => {
      if ('autosave' != key &&  value === true) {
        plugins.push(key)
        toolbar += ' ' + key
      }
    })

    let config = {}

    for (const prop in tinymce.claroline.configuration) {
      if (tinymce.claroline.configuration.hasOwnProperty(prop)) {
        config[prop] = tinymce.claroline.configuration[prop]
      }
    }
    config.plugins = plugins
    config.toolbar1 = toolbar
    config.trusted = true
    config.format = 'html'

    return config
  }

  static _getGlobal (name) {
    if (typeof window[name] === 'undefined') {
      throw new Error(
        `Expected ${name} to be exposed in a window.${name} variable`
      )
    }

    return window[name]
  }
}