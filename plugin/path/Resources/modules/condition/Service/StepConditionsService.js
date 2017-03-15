/**
 * StepConditions Service
 */

export default class StepConditionsService {
  /**
   *
   * @param $q
   * @param {CriteriaGroupService} CriteriaGroupService
   */
  constructor($q, CriteriaGroupService, Translator) {
    this.$q = $q
    this.CriteriaGroupService = CriteriaGroupService
    this.Translator = Translator
  }

  /**
   * Generates a new empty conditions
   *
   * @param {object} step
   * @returns {object}
   */
  initialize(step) {
    const newCriteriaGroup = this.CriteriaGroupService.newGroup()

    const newCondition = {
      // ID of the StepCondition entity
      scid: null,
      // list of criteria groups
      criteriagroups: [newCriteriaGroup],
      availableFromDate: undefined,
      availableUntilDate: undefined
    }

    step.condition = newCondition

    return newCondition
  }

  /**
   * Test the condition of a step
   *
   * @param step
   */
  testCondition(step) {
    const deferred = this.$q.defer()

    let errorList = []
    const groups = []

    if (step.condition) {
      let message = this.testDate(step.condition.availableFromDate, step.condition.availableUntilDate)
      if (message != '') {
        errorList.push(message)
      }

      for (let i = 0; i < step.condition.criteriagroups.length; i++) {
        groups.push(
          this.CriteriaGroupService
            .testGroup(step, step.condition.criteriagroups[i])
            .then(errors => {
              errorList = errorList.concat(errors)
            })
        )
      }

      // Wait all criteria groups are resolved before sending the error list
      this.$q
        .all(groups)
        .then(() => {
          deferred.resolve(errorList)
        })
    } else {
      deferred.resolve(errorList)
    }

    return deferred.promise
  }

  /**
   * Check the date condition
   */
  testDate(from, until) {
    let message = ''
    const today = new Date()

    if (from != null && new Date(from) > today) {
      let fromdate = new Date(from)
      let fromstring = this.twoDigits(fromdate.getDate())+'/'+
        this.twoDigits(fromdate.getMonth()+1)+'/'+fromdate.getFullYear()
      message = this.Translator.trans('condition_date_notStarted', {from:fromstring}, 'path_wizards')
    }

    if (until != null && new Date(until) < today) {
      let untildate = new Date(until)
      let untilstring = this.twoDigits(untildate.getDate())+'/'+
        this.twoDigits(untildate.getMonth()+1)+'/'+untildate.getFullYear()
      message = this.Translator.trans('condition_date_finished', {until:untilstring}, 'path_wizards')
    }
    return message
  }

  twoDigits(date) {
    return ('0' + date).slice(-2)
  }
}
