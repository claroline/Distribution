/**
 * Base question service
 * @constructor
 */
export default class AbstractQuestionService {
  /**
   * Constructor.
   * 
   * @param {Object} $log
   * @param {ScoreService} ScoreService
   */
  constructor($log, ScoreService, FeedbackService) {
    this.$log = $log
    this.ScoreService = ScoreService
    this.FeedbackService = FeedbackService
  }
  
  /**
   * Initialize the answer object for the Question
   */
  initAnswer() {
    this.$log.error('Each instance of AbstractQuestionType must implement the `initAnswer`.');
  }

  /**
   * Get the correct answer from the solutions of a Question
   * @param   {Object} question
   * @returns {Object|Array}
   */
  getCorrectAnswer(question) {
    this.$log.error('Each instance of AbstractQuestionType must implement the `getCorrectAnswer`.');
  }

  getTotalScore(question) {
    
  }

  getAnswerScore(question, answer) {

  }
}
