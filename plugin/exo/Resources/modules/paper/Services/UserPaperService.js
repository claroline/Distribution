
import angular from 'angular/index'

/**
 * UserPaper Service
 * Manages Paper of the current User
 */
export default class UserPaperService {
  /**
   * Constructor.
   *
   * @param {Object}          $http
   * @param {Object}          $q
   * @param {Object}          $filter
   * @param {PaperService}    PaperService
   * @param {ExerciseService} ExerciseService
   * @param {url}             url
   */
  constructor($http, $q, $filter, PaperService, ExerciseService, url) {
    this.$http = $http
    this.$q = $q
    this.$filter = $filter
    this.PaperService = PaperService
    this.ExerciseService = ExerciseService
    this.UrlService = url

    /**
     * Current paper of the User.
     *
     * @type {Object}
     */
    this.paper = null

    /**
     * Number of papers already done by the User.
     *
     * @type {number}
     */
    this.nbPapers = 0
  }

  /**
   * Get Paper.
   *
   * @returns {Object}
   */
  getPaper() {
    return this.paper
  }

  /**
   * Set Paper.
   *
   * @param   {Object} paper
   *
   * @returns {UserPaperService}
   */
  setPaper(paper) {
    this.paper = paper

    return this
  }

  /**
   * Get number of Papers.
   *
   * @returns {number}
   */
  getNbPapers() {
    return this.nbPapers
  }

  /**
   * Set number of Papers.
   *
   * @param {number} count
   *
   * @returns {UserPaperService}
   */
  setNbPapers(count) {
    this.nbPapers = count ? parseInt(count) : 0

    return this
  }

  /**
   * Get the index of a Step.
   *
   * @param   {Object} step
   *
   * @returns {Number}
   */
  getIndex(step) {
    let index = 0
    for (let i = 0; i < this.paper.order.length; i++) {
      if (this.paper.order[i].id === step.id) {
        index = i

        break
      }
    }

    return index
  }

  /**
   * Get the next Step as configured in the Paper of the User.
   *
   * @param   {Object} currentStep
   *
   * @returns {Object|null}
   */
  getNextStep(currentStep) {
    let nextId = null
    for (let i = 0; i < this.paper.order.length; i++) {
      if (this.paper.order[i].id === currentStep.id) {
        if (this.paper.order[i + 1]) {
          // There is a Step after the current one
          nextId = this.paper.order[i + 1].id
        }

        break
      }
    }

    return this.ExerciseService.getStep(nextId)
  }

  /**
   * Get the previous Step as configured in the Paper of the User.
   *
   * @param   {Object} currentStep
   *
   * @returns {Object|null}
   */
  getPreviousStep(currentStep) {
    let previousId = null
    for (let i = 0; i < this.paper.order.length; i++) {
      if (this.paper.order[i].id === currentStep.id) {
        if (this.paper.order[i - 1]) {
          // There is a Step after the current one
          previousId = this.paper.order[i - 1].id
        }

        break
      }
    }

    return this.ExerciseService.getStep(previousId)
  }

  /**
   * Order the Questions of a Step.
   *
   * @param   {Object} step
   *
   * @returns {Array} The ordered list of Questions
   */
  orderStepQuestions(step) {
    return this.PaperService.orderStepQuestions(this.paper, step)
  }

  /**
   * Get Paper for a Question.
   *
   * @param {Object} question
   */
  getQuestionPaper(question) {
    return this.PaperService.getQuestionPaper(this.paper, question)
  }

  /**
   * Start the Exercise.
   *
   * @param   {Object} exercise
   *
   * @returns {promise}
   */
  start(exercise) {
    const deferred = this.$q.defer()

    if (!this.paper || this.paper.end) {
      // Start a new Paper (or load an interrupted one)
      this.$http
        .post(this.UrlService('exercise_new_attempt', {id: exercise.id}))
        .success(response => {
          this.paper = response
          deferred.resolve(this.paper)
        })
        .error(() => {
          deferred.reject({})
        })
    } else {
      // Continue the current Paper
      deferred.resolve(this.paper)
    }

    return deferred.promise
  }

  /**
   * Interrupt the current Paper
   */
  interrupt() {
    this.paper.interrupted = true
  }

  /**
   * Submit a Step answers to the server.
   *
   * @param {Object} step
   */
  submitStep(step) {
    const deferred = this.$q.defer()

    // Get answers for each Question of the Step
    const stepAnswers = {}
    if (step && step.items) {
      for (let i = 0; i < step.items.length; i++) {
        let item = step.items[i]
        let itemPaper = this.getQuestionPaper(item)

        if (itemPaper && itemPaper.answer) {
          stepAnswers[item.id] = itemPaper.answer
        } else {
          stepAnswers[item.id] = ''
        }
      }
    }

    // There are answers to post
    this.$http
      .put(
        this.UrlService('exercise_submit_step', {paperId: this.paper.id, stepId: step.id}),
        {data: stepAnswers}
      )
      .success(response => {
        if (response) {
          for (let i = 0; i < response.length; i++) {
            if (response[i]) {
              let item = null

              // Get item in Step
              for (let j = 0; j < step.items.length; j++) {
                if (response[i].question.id === step.items[j].id) {
                  item = step.items[j]
                  break // Stop searching
                }
              }

              if (item) {
                // Update question with solutions and feedback
                item.solutions = response[i].question.solutions ? response[i].question.solutions : []
                item.feedback = response[i].question.feedback ? response[i].question.feedback : null

                // Update paper with Score
                const paper = this.getQuestionPaper(item)
                paper.score = response[i].answer.score
                paper.nbTries = response[i].answer.nbTries
              }
            }
          }
        }

        deferred.resolve(response)
      })
      .error(() => {
        deferred.reject([])
      })

    return deferred.promise
  }

  /**
   * End the Exercise.
   *
   * @returns {promise}
   */
  end() {
    const deferred = this.$q.defer()

    // Set end of the paper
    this.paper.end = this.$filter('date')(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss')
    this.paper.interrupted = false

    this.$http
      .put(this.UrlService('exercise_finish_paper', {id: this.paper.id}))
      .success(response => {
        // Update the number of finished papers
        this.nbPapers++

        // Update the current User Paper with updated data (endDate particularly)
        angular.merge(this.paper, response)

        deferred.resolve(response)
      })
      .error(() => {
        deferred.reject({})
      })

    return deferred.promise
  }

  /**
   * Check if the User is allowed to compose (max attempts of the Exercise is not reached).
   *
   * @returns {boolean}
   */
  isAllowedToCompose() {
    const exercise = this.ExerciseService.getExercise()

    let allowed = true
    if (exercise.meta.maxAttempts && this.nbPapers >= exercise.meta.maxAttempts) {
      // Max attempts reached => user can not do the exercise
      allowed = false
    }

    return allowed
  }

  /**
   * Check if the correction of the Exercise is available.
   *
   * @param {Object} paper
   *
   * @returns {Boolean}
   */
  isCorrectionAvailable(paper) {
    let available = false

    if (this.ExerciseService.isEditEnabled()) {
      // Always show correction for exercise's administrators
      available = true
    } else {
      // Use the configuration of the Exercise to know if it's available
      const exercise = this.ExerciseService.getExercise()

      switch (exercise.meta.correctionMode) {
        // At the end of assessment
        case '1':
          available = null !== paper.end
          break

        // After the last attempt
        case '2':
          available = (0 === exercise.meta.maxAttempts || this.nbPapers >= exercise.meta.maxAttempts)
          break

        // From a fixed date
        case '3':
          const now = new Date()

          let correctionDate = null
          if (null !== exercise.meta.correctionDate) {
            correctionDate = new Date(Date.parse(exercise.meta.correctionDate))
          }

          available = (null === correctionDate || now >= correctionDate)
          break

        // Never
        default:
        case '4':
          available = false
          break
      }
    }

    return available
  }

  /**
   * Check if the score obtained by the User for the Exercise is available.
   *
   * @param {Object} paper
   * 
   * @returns {Boolean}
   */
  isScoreAvailable(paper) {
    let available = false

    if (this.ExerciseService.isEditEnabled()) {
      // Always show score for exercise's administrators
      available = true
    } else {
      // Use the configuration of the Exercise to know if it's available
      const exercise = this.ExerciseService.getExercise()

      switch (exercise.meta.markMode) {
        // At the same time that the correction
        case '1':
          available = this.isCorrectionAvailable(paper)
          break

        // At the end of the assessment
        case '2':
          available = null !== paper.end
          break

        // Show score if nothing specified
        default:
          available = false
          break
      }
    }

    return available
  }
}
