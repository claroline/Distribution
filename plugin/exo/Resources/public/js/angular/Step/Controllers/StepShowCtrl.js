/**
 * Step Show Controller
 * @param {UserPaperService} UserPaperService
 * @param {FeedbackService} FeedbackService
 * @param {QuestionService} QuestionService
 * @constructor
 */
var StepShowCtrl = function StepShowCtrl(UserPaperService, FeedbackService, QuestionService) {
    this.UserPaperService = UserPaperService;
    this.FeedbackService = FeedbackService;
    this.QuestionService = QuestionService;

    // Get the order of items from the Paper of the User (in case they are shuffled)
    this.items = this.UserPaperService.orderQuestions(this.step);
    
    this.FeedbackService
        .on('show', this.onFeedbackShow.bind(this));
};

// Set up dependency injection
StepShowCtrl.$inject = [ 'UserPaperService', 'FeedbackService', 'QuestionService' ];

/**
 * Current step
 * @type {Object}
 */
StepShowCtrl.prototype.step = null;

/**
 * Current feedback
 * @type {Object}
 */
StepShowCtrl.prototype.feedback = null;

/**
 * Items of the Step (correctly ordered)
 * @type {Array}
 */
StepShowCtrl.prototype.items = [];

/**
 * Current step number
 * @type {Object}
 */
StepShowCtrl.prototype.stepIndex = 0;

/**
 *
 * @type {boolean}
 */
StepShowCtrl.prototype.solutionShown = false;

StepShowCtrl.prototype.ALL_ANSWERS_FOUND = 0;
StepShowCtrl.prototype.NOT_ALL_ANSWERS_FOUND = 1;

/**
 * 
 * @type {Integer}
 */
StepShowCtrl.prototype.allAnswersFound = -1;

/**
 * Get the Paper related to the Question
 * @param   {Object} question
 * @returns {Object}
 */
StepShowCtrl.prototype.getQuestionPaper = function getQuestionPaper(question) {
    return this.UserPaperService.getQuestionPaper(question);
};

/**
 * On Feedback Show
 */
StepShowCtrl.prototype.onFeedbackShow = function onFeedbackShow() {
    this.allAnswersFound = this.ALL_ANSWERS_FOUND;
    for (var i=0; i<this.items.length; i++) {
        var question = this.items[0];
        var answer = this.getQuestionPaper(question).answer;
        var state = this.QuestionService.getTypeService(question.type).answersAllFound(question, answer);
        if (state !== 0) {
            this.allAnswersFound = this.NOT_ALL_ANSWERS_FOUND;
        }
    }
};

/**
 * 
 * @returns {undefined}Get the suite feedback sentence
 */
StepShowCtrl.prototype.getSuiteFeedback = function getSuiteFeedback() {
    var sentence = "";
    if (this.allAnswersFound === this.ALL_ANSWERS_FOUND) {
        // Toutes les réponses ont été trouvées
        if (this.items.length === 1) {
            // L'étape comporte une seule question
            if (this.currentTry === 1) {
                // On en est à l'essai 1
                sentence = "perfectly_correct";
            }
            else {
                // L'étape a été jouée plusieurs fois
                sentence = "answers_correct";
            }
        }
        else {
            // L'étape comporte plusieurs questions
            if (this.currentTry === 1) {
                sentence = "all_answers_found";
            }
            else {
                sentence = "answers_now_correct";
            }
        }
    }
    else if (this.allAnswersFound === this.NOT_ALL_ANSWERS_FOUND) {
        // toutes les réponses n'ont pas été trouvées
        if (this.currentTry < this.step.maxAttempts) {
            sentence = "some_answers_miss_try_again";
        }
        else {
            sentence = "max_attempts_reached_see_solution";
        }
    }
    
    return sentence;
};

// Inject controller into AngularJS
angular
    .module('Step')
    .controller('StepShowCtrl', StepShowCtrl);