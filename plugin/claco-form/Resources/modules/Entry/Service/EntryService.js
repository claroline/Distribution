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
//import fieldFormTemplate from '../Partial/field_form_modal.html'

export default class EntryService {
  constructor ($http, $uibModal, ClarolineAPIService, FieldService) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.ClarolineAPIService = ClarolineAPIService
    this.FieldService = FieldService
    this.canEdit = EntryService._getGlobal('canEdit')
    this.resourceId = EntryService._getGlobal('resourceId')
    this.resourceDetails = EntryService._getGlobal('resourceDetails')
    this.myEntries = EntryService._getGlobal('myEntries')
    this.entries = []
    this._updateEntryCallback = this._updateEntryCallback.bind(this)
    this._removeEntryCallback = this._removeEntryCallback.bind(this)
    this.initialize()
  }

  _updateEntryCallback (data) {
    let entry = JSON.parse(data)
    this.formatEntry(entry)
    const entriesIndex = this.entries.findIndex(e => e['id'] === entry['id'])
    const myEntriesIndex = this.myEntries.findIndex(e => e['id'] === entry['id'])

    if (entriesIndex > -1) {
      this.entries[entriesIndex] = entry
    }
    if (myEntriesIndex > -1) {
      this.myEntries[myEntriesIndex] = entry
    }
  }

  _removeEntryCallback (data) {
    const entry = JSON.parse(data)
    const entriesIndex = this.entries.findIndex(e => e['id'] === entry['id'])
    const myEntriesIndex = this.myEntries.findIndex(e => e['id'] === entry['id'])

    if (entriesIndex > -1) {
      this.entries.splice(entriesIndex, 1)
    }
    if (myEntriesIndex > -1) {
      this.myEntries.splice(myEntriesIndex, 1)
    }
  }

  initialize () {
    this.myEntries.forEach(e => this.formatEntry(e))
    const url = Routing.generate('claro_claco_form_entries_list', {clacoForm: this.resourceId})
    this.$http.get(url).then(d => {
      const data = JSON.parse(d['data'])
      data.forEach(e => {
        this.formatEntry(e)
        this.entries.push(e)
      })
    })
  }

  getEntries () {
    return this.entries
  }

  getMyEntries () {
    return this.myEntries
  }

  getEntry (entryId) {
    return this.entries.find(e => e['id'] === entryId)
  }

  getEntryById (entryId) {
    const url = Routing.generate('claro_claco_form_entry_retrieve', {entry: entryId})

    return this.$http.get(url).then(d => {
      let entry = JSON.parse(d['data'])
      this.formatEntry(entry)

      return entry
    })
  }

  getNbMyEntries () {
    return this.myEntries.length
  }

  getCanEditEntry (entryId) {
    return this.canEdit || (this.resourceDetails['edition_enabled'] && this.isMyEntry(entryId))
  }

  isMyEntry(entryId) {
    return this.myEntries.find(e => e['id'] === entryId) !== undefined
  }

  createEntry (resourceId, entryData, entryTitle = null) {
    const url = Routing.generate('claro_claco_form_entry_create', {clacoForm: resourceId})

    return this.$http.post(url, {entryData: entryData, titleData: entryTitle}).then(d => {
      if (d['status'] === 200) {
        let entry = JSON.parse(d['data'])
        this.entries.push(entry)
        this.myEntries.push(entry)
        this.formatEntry(entry)

        return entry
      }
    })
  }

  editEntry (entryId, entryData, entryTitle = null, callback = null) {
    const url = Routing.generate('claro_claco_form_entry_edit', {entry: entryId})
    const updateCallback = callback !== null ? callback : this._updateEntryCallback

    return this.$http.post(url, {entryData: entryData, titleData: entryTitle}).then(d => {
      if (d['status'] === 200) {
        updateCallback(d['data'])

        return true
      }
    })
  }

  formatEntry (entry) {
    const creationDate = new Date(entry['creationDate'])
    entry['creationDateString'] = `${creationDate.getDate()}/${creationDate.getMonth() + 1}/${creationDate.getFullYear()}`

    if (entry['user']) {
      entry['userString'] = `${entry['user']['firstName']} ${entry['user']['lastName']}`
    } else {
      entry['userString'] = '-'
    }
    entry['alert'] = (entry['status'] === 0) || entry['comments'].length > 0
    entry['fieldValues'].forEach(v => {
      const fieldId = v['field']['id']
      const fieldLabel = `field_${fieldId}`
      entry[fieldId] = v['fieldFacetValue']['value']

      switch (v['fieldFacetValue']['field_facet']['type']) {
        case 3 :
          const valueDate = new Date(v['fieldFacetValue']['value'])
          entry[fieldLabel] = `${valueDate.getDate()}/${valueDate.getMonth() + 1}/${valueDate.getFullYear()}`
          break
        case 6 :
          entry[fieldLabel] = v['fieldFacetValue']['value'].join()
          break
        case 7 :
          entry[fieldLabel] = this.FieldService.getCountryNameFromCode(v['fieldFacetValue']['value'])
          break
        default :
          entry[fieldLabel] = v['fieldFacetValue']['value']
      }
    })
    entry['actions'] = this.getCanEditEntry(entry['id'])
  }

  deleteEntry (entry, callback = null) {
    const url = Routing.generate('claro_claco_form_entry_delete', {entry: entry['id']})
    const deleteCallback = callback !== null ? callback : this._removeEntryCallback

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      deleteCallback,
      Translator.trans('delete_entry', {}, 'clacoform'),
      Translator.trans('delete_entry_confirm_message', {title: entry['title']}, 'clacoform')
    )
  }

  changeEntryStatus (entry, callback = null) {
    const url = Routing.generate('claro_claco_form_entry_status_change', {entry: entry['id']})
    const updateCallback = callback !== null ? callback : this._updateEntryCallback
    this.$http.put(url).then(d => {
      if (d['status'] === 200) {
        updateCallback(d['data'])
      }
    })
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