/**
 * Cloze Question Controller
 * @param {FeedbackService}      FeedbackService
 * @param {ClozeQuestionService} ClozeQuestionService
 * @constructor
 */
var ClozeQuestionCtrl = function ClozeQuestionCtrl(FeedbackService, ClozeQuestionService) {
    AbstractQuestionCtrl.apply(this, arguments);

    this.ClozeQuestionService = ClozeQuestionService;
};

// Extends AbstractQuestionCtrl
ClozeQuestionCtrl.prototype = Object.create(AbstractQuestionCtrl.prototype);

// Set up dependency injection (get DI from parent too)
ClozeQuestionCtrl.$inject = AbstractQuestionCtrl.$inject.concat([ 'ClozeQuestionService' ]);

/**
 * Stores Holes to be able to toggle there state
 * This object is populated while compiling the directive to add data-binding on cloze
 * @type {Object}
 */
ClozeQuestionCtrl.prototype.holes = {};

/**
 * Check whether a Hole is valid or not
 * @param   {Object} hole
 * @returns {Boolean}
 */
ClozeQuestionCtrl.prototype.isHoleValid = function isHoleValid(hole) {
    var answer   = this.getHoleAnswer(hole);
    if (answer) {
        var correct = this.ClozeQuestionService.getHoleCorrectAnswer(this.question, hole);
        if (correct) {
            // The right response has been found, we can check the User answer
            if (hole.selector) {
                return answer.answerText === correct.id;
            } else {
                return !!((correct.caseSensitive && correct.text === answer.answerText)
                || (!correct.caseSensitive && correct.text.toLowerCase() === answer.answerText.toLowerCase()));
            }
        }
    }
};

/**
 * Get the User answer for a Hole
 * @param   {Object} hole
 * @returns {Object}
 */
ClozeQuestionCtrl.prototype.getHoleAnswer = function getHoleAnswer(hole) {
    var answer = this.ClozeQuestionService.getHoleAnswer(this.answer, hole);
    if (null === answer) {
        // Generate an empty response
        answer = {
            holeId     : hole.id,
            answerText : ''
        };

        // Add to the list of answers
        this.answer.push(answer);
    }

    return answer;
};

/**
 * Get the Feedback of a Hole
 * @param   {Object} hole
 * @returns {string}
 */
ClozeQuestionCtrl.prototype.getHoleFeedback = function getHoleFeedback(hole) {
    return this.ClozeQuestionService.getHoleFeedback(this.question, hole);
};

/**
 * Validate Holes when feedback are shown to know which answers are valid
 */
ClozeQuestionCtrl.prototype.onFeedbackShow = function onFeedbackShow() {
    // Validate holes
    if (this.question.solutions) {
        for (var holeId in this.holes) {
            if (this.holes.hasOwnProperty(holeId)) {
                this.holes[holeId].valid = this.isHoleValid(this.holes[holeId]);
            }
        }
    }
    
    this.answersAllFound();
};

ClozeQuestionCtrl.prototype.answersAllFound = function answersAllFound() {
    var numAnswersFound = 0;
    
    for (var i=0; i<this.question.solutions.length; i++) {
        var holeId = parseInt(this.question.solutions[i].holeId);
        var answer = this.ClozeQuestionService.getHoleAnswer(this.answer, this.holes[holeId]);
        for (var j=0; j<this.question.solutions[i].answers.length; j++) {
            for (var k=0; k<this.question.holes.length; k++) {
                if (this.question.holes[k].id === this.question.solutions[i].holeId && this.question.solutions[i].answers[j].text === answer.answerText && this.question.solutions[i].answers[j].score > 0 && !this.question.holes[k].selector) {
                    numAnswersFound++;
                }
                else if (this.question.holes[k].id === this.question.solutions[i].holeId && this.question.solutions[i].answers[j].id === answer.answerText && this.question.solutions[i].answers[j].score > 0 && this.question.holes[k].selector) {
                    numAnswersFound++;
                }
            }
        }
    }
    
    if (numAnswersFound === this.question.solutions.length) {
        // all answers have been found
        this.feedback.state = 0;
    }
    else if (numAnswersFound === this.question.solutions.length -1) {
        // one answer remains to be found
        this.feedback.state = 1;
    }
    else {
        // more answers remain to be found
        this.feedback.state = 2;
    }
};

// Register controller into AngularJS
angular
    .module('Question')
    .controller('ClozeQuestionCtrl', ClozeQuestionCtrl);