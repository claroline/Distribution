/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class ClacoFormService {
  constructor ($http, $uibModal) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.canEdit = ClacoFormService._getGlobal('canEdit')
    this.resourceId = ClacoFormService._getGlobal('resourceId')
    this.resourceDetails = ClacoFormService._getGlobal('resourceDetails')
    this.resourceNodeId = ClacoFormService._getGlobal('resourceNodeId')
    this.resourceNodeName = ClacoFormService._getGlobal('resourceNodeName')
  }

  getCanEdit () {
    return this.canEdit
  }

  getResourceId () {
    return this.resourceId
  }

  getResourceDetails () {
    return this.resourceDetails
  }

  getResourceNodeId () {
    return this.resourceNodeId
  }

  getResourceNodeName () {
    return this.resourceNodeName
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