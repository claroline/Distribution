/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class GeneralConfigurationCtrl {
  constructor ($state, ClacoFormService) {
    this.$state = $state
    this.ClacoFormService = ClacoFormService
    this.config = ClacoFormService.getResourceDetails()
    this.configErrors = {
      max_entries: null
    }
    this.isCollapsed = {
      general: false,
      display: true,
      random: true,
      find: true,
      data: true,
      categories: true,
      comments: true,
      votes: true,
      keywords: true
    }
    this.randomStartDate = {
      date: null,
      format: 'dd/MM/yyyy',
      open: false
    }
    this.randomEndDate = {
      date: null,
      format: 'dd/MM/yyyy',
      open: false
    }
    this.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      placeHolder: 'jj/mm/aaaa'
    }
  }

  canEdit () {
    return this.ClacoFormService.getCanEdit()
  }

  submit () {
    console.log(this.config)
    //this.$state.go('menu')
  }

  openStartDatePicker () {
    this.randomStartDate['open'] = true
  }

  openEndDatePicker () {
    this.randomEndDate['open'] = true
  }
}