/**
 * Conditions edit controller
 */

export default class ConditionEditCtrl {
  /**
   *
   * @param {Translator} Translator
   * @param {ConfirmService} ConfirmService
   * @param {StepConditionsService} StepConditionsService
   */
  constructor(Translator, ConfirmService, StepConditionsService) {
    this.Translator = Translator
    this.ConfirmService = ConfirmService
    this.ConditionService = StepConditionsService
    this.filterAvailableFromDate = {
      date: null,
      format: 'dd/MM/yyyy',
      open: false
    }
    this.filterAvailableUntilDate = {
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

  /**
   * Create a condition for the step
   */
  addCondition() {
    this.ConditionService.initialize(this.step)
  }

  /**
   * Remove the condition
   */
  removeCondition() {
    this.ConfirmService.open({
      title:         this.Translator.trans('condition_delete_title',   {}, 'path_wizards'),
      message:       this.Translator.trans('condition_delete_confirm', {}, 'path_wizards'),
      confirmButton: this.Translator.trans('condition_delete',         {}, 'path_wizards')
    },
    // Confirm success callback
    () => {
      //remove the condition (needs to be step.condition to trigger change and allow path save)
      this.step.condition = null
    })
  }

  openAvailableFromPicker() {
    //dirty hack : to avoid a broken datepicker when input field is empty
    if (!this.step.condition.availableFromDate){
      this.step.condition.availableFromDate = new Date()
    }
    this.filterAvailableFromDate['open'] = true
  }

  openAvailableUntilPicker() {
    if (!this.step.condition.availableUntilDate){
      this.step.condition.availableUntilDate = new Date()
    }
    this.filterAvailableUntilDate['open'] = true
  }
}
