/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Translator*/

export default class EntryEditionCtrl {
  constructor ($state, $stateParams, ClacoFormService, EntryService, FieldService) {
    this.$state = $state
    this.ClacoFormService = ClacoFormService
    this.EntryService = EntryService
    this.entryId = parseInt($stateParams.entryId)
    this.source = {}
    this.entry = {}
    this.entryTitle = {label: Translator.trans('entry_title', {}, 'clacoform'), value: null}
    this.entryErrors = {}
    this.resourceId = ClacoFormService.getResourceId()
    this.title = Translator.trans('entry_edition', {}, 'clacoform')
    this.config = ClacoFormService.getResourceDetails()
    this.template = ClacoFormService.getTemplate()
    this.fields = FieldService.getFields()
    this.tinymceOptions = ClacoFormService.getTinymceConfiguration()
    this.mode = 'edition'
    this.initialize()
  }

  initialize () {
    this.ClacoFormService.clearSuccessMessage()
    this.source = this.EntryService.getEntry(this.entryId)

    if (this.source === undefined) {
      this.cancel()
      //this.EntryService.getEntryById(this.entryId).then(d => {
      //  this.source = d
      //  this.initializeEntry()
      //})
    } else {
      this.initializeEntry()
    }
    const replacedfield = `
      <form-field field="[field['name'], field['fieldFacet']['translation_key'], {error: cfc.entryErrors[field['id']], noLabel: true}]"
                  ng-model="cfc.entry[field['id']]"
      >
      </form-field>
    `
    this.fields.forEach(f => {
      const name = f['name']

      if (this.template) {
        this.template = this.template.replace(`%${name}%`, replacedfield)
      }
    })
  }

  initializeEntry () {
    this.entryTitle['value'] = this.source['title']
    this.fields.forEach(f => {
      const id = f['id']
      this.entry[id] = this.source[id]

      //switch (f['type']) {
      //  case 3 :
      //    this.entry[id] = this.source[id]
      //    //const valueDate = new Date(v['fieldFacetValue']['value'])
      //    //entry[fieldId] = `${valueDate.getDate()}/${valueDate.getMonth() + 1}/${valueDate.getFullYear()}`
      //    break
      //  case 6 :
      //    this.entry[id] = this.source[id].split(',')
      //    break
      //  default :
      //    this.entry[id] = this.source[id]
      //}

      if (f['required']) {
        this.entryErrors[id] = null
      }
    })
  }

  canEdit () {
    return this.ClacoFormService.getCanEdit()
  }

  isAllowed () {
    return this.EntryService.getCanEditEntry(this.entryId)
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
      this.EntryService.editEntry(this.source['id'], this.entry, this.entryTitle['value']).then(d => {
        if (d !== 'null') {
          this.$state.go('entries_list')
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
    this.$state.go('entries_list')
  }
}