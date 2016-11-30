/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class MenuCtrl {
  constructor ($state, ClacoFormService) {
    this.$state = $state
    this.ClacoFormService = ClacoFormService
    this.config = ClacoFormService.getResourceDetails()
  }

  canEdit () {
    return this.ClacoFormService.getCanEdit()
  }

  getResourceNodeName () {
    return this.ClacoFormService.getResourceNodeName()
  }

  getSuccessMessage () {
    return this.ClacoFormService.getSuccessMessage()
  }

  clearSuccessMessage () {
    this.ClacoFormService.clearSuccessMessage()
  }

  canAdd () {
    return this.ClacoFormService.getCanCreateEntry()
  }

  canSearch () {
    return this.ClacoFormService.getCanSearchEntry()
  }
}