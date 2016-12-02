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
  constructor ($state, ClacoFormService, EntryService, FieldService, KeywordService) {
    this.$state = $state
    this.ClacoFormService = ClacoFormService
    this.EntryService = EntryService
    this.KeywordService = KeywordService
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
    this.keywordssChoices = []
    this.keywords = []
    this.selectedKeyword = null
    this.showKeywordsSelect = false
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
    this.initializeKeywords()
  }

  initializeKeywords () {
    this.keywordsChoices = this.KeywordService.getKeywords()
  }

  canEdit () {
    return this.ClacoFormService.getCanEdit()
  }

  isAllowed () {
    return this.ClacoFormService.getCanCreateEntry()
  }

  canManageKeywords () {
    return this.isAllowed() && this.config['keywords_enabled']
  }

  enableKeywordsSelect () {
    this.showKeywordsSelect = true
  }

  disableKeywordsSelect () {
    this.showKeywordsSelect = false
    this.selectedKeyword = null
  }

  addSelectedKeyword () {
    if (this.selectedKeyword) {
      if (this.config['new_keywords_enabled']) {
        const existingKeyword = this.keywords.find(k => k.toUpperCase() === this.selectedKeyword.toUpperCase())

        if (!existingKeyword) {
          this.keywords.push(this.selectedKeyword)
        }
      } else {
        const existingKeyword = this.keywords.find(k => k.toUpperCase() === this.selectedKeyword['name'].toUpperCase())

        if (!existingKeyword) {
          this.keywords.push(this.selectedKeyword['name'])
        }
      }
    }
    this.showKeywordsSelect = false
    this.selectedKeyword = null
  }

  removeKeyword (keyword) {
    const index = this.keywords.findIndex(k => k === keyword)

    if (index > -1) {
      this.keywords.splice(index, 1)
    }
  }

  submit () {
    this.resetErrors()

    if (!this.entryTitle['value']) {
      this.entryErrors['entry_title'] = Translator.trans('form_not_blank_error', {}, 'clacoform')
    }
    this.fields.forEach(f => {
      const id = f['id']

      if (f['required'] && (this.entry[id] === undefined || this.entry[id] === null || this.entry[id] === '' || this.entry[id].length === 0)) {
        this.entryErrors[id] = Translator.trans('form_not_blank_error', {}, 'clacoform')
        this.entry[id] = null
      }
    })

    if (this.isValid()) {
      this.EntryService.createEntry(this.resourceId, this.entry, this.entryTitle['value'], this.keywords).then(d => {
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