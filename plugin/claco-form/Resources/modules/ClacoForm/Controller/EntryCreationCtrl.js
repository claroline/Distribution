/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Translator*/

export default class EntryCreationCtrl {
  constructor ($state, ClacoFormService, EntryService, FieldService) {
    this.$state = $state
    this.ClacoFormService = ClacoFormService
    this.EntryService = EntryService
    this.entry = {}
    this.entryTitle = {label: Translator.trans('entry_title', {}, 'clacoform'), value: null}
    this.entryErrors = {}
    this.resourceId = ClacoFormService.getResourceId()
    this.title = Translator.trans('entry_addition', {}, 'clacoform')
    this.config = ClacoFormService.getResourceDetails()
    this.template = ClacoFormService.getTemplate()
    this.fields = FieldService.getFields()
    this.tinymceOptions = ClacoFormService.getTinymceConfiguration()
    this.mode = 'creation'
    this.initialize()
  }

  initialize () {
    this.ClacoFormService.clearSuccessMessage()
    const replacedfield = `
      <form-field field="[field['name'], field['fieldFacet']['translation_key'], {error: cfc.entryErrors[field['id']], noLabel: true}]"
                  ng-model="cfc.entry[field['id']]"
      >
      </form-field>
    `
    this.fields.forEach(f => {
      const id = f['id']
      const name = f['name']
      this.entry[id] = null

      if (f['required']) {
        this.entryErrors[id] = null
      }
      if (this.template) {
        this.template = this.template.replace(`%${name}%`, replacedfield)
      }
    })
  }

  canEdit () {
    return this.ClacoFormService.getCanEdit()
  }

  isAllowed () {
    return this.ClacoFormService.getCanCreateEntry()
  }

  submit () {
    this.resetErrors()
    this.fields.forEach(f => {
      const id = f['id']

      if (f['required'] && (this.entry[id] === undefined || this.entry[id] === null || this.entry[id] === '' || this.entry[id].length === 0)) {
        this.entryErrors[id] = Translator.trans('form_not_blank_error', {}, 'clacoform')
        this.entry[id] = null
      }
    })

    if (this.isValid()) {
      this.EntryService.createEntry(this.resourceId, this.entry, this.entryTitle['value']).then(d => {
        if (d !== 'null') {
          this.ClacoFormService.setSuccessMessage(Translator.trans('entry_addition_success_message', {}, 'clacoform'))
          this.$state.go('menu')
        }
      })
    }
  }

  resetErrors () {
    for (const key in this.entryErrors) {
      this.entryErrors[key] = null
    }
  }

  isValid () {
    let valid = true

    for (const key in this.entryErrors) {
      if (this.entryErrors[key]) {
        valid = false
        break
      }
    }

    return valid
  }

  cancel () {
    this.$state.go('menu')
  }
}