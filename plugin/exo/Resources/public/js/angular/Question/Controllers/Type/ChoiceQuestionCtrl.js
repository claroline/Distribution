/**
 * Choice Question Controller
 * @param {FeedbackService}       FeedbackService
 * @param {ChoiceQuestionService} ChoiceQuestionService
 * @constructor
 */
var ChoiceQuestionCtrl = function ChoiceQuestionCtrl(FeedbackService, ChoiceQuestionService) {
    AbstractQuestionCtrl.apply(this, arguments);

    this.ChoiceQuestionService = ChoiceQuestionService;

    if (this.question.choices) {
        this.choices = this.question.choices;
    }
};

// Extends AbstractQuestionCtrl
ChoiceQuestionCtrl.prototype = Object.create(AbstractQuestionCtrl.prototype);

// Set up dependency injection (get DI from parent too)
ChoiceQuestionCtrl.$inject = AbstractQuestionCtrl.$inject.concat([ 'ChoiceQuestionService' ]);

/**
 * Stores Choices to be able to toggle there state
 * @type {Array}
 */
ChoiceQuestionCtrl.prototype.choices = [];

/**
 * Toggle the selected state of a Choice
 * @param {Object} choice
 */
ChoiceQuestionCtrl.prototype.toggleChoice = function toggleChoice(choice) {
    if (!this.feedback.visible && 1 !== choice.valid && !this.isUniqueChoiceValid()) {
        // Toggle value only if field is not locked
        if (!this.isChoiceSelected(choice)) {
            // Choice is not already selected => SELECT IT
            if (!this.question.multiple) {
                // Only one response authorized for this question, so we need to empty the response array
                this.answer.splice(0, this.answer.length);
            }

            // Add new choice into the response array
            this.answer.push(choice.id);
        } else {
            // Choice is already selected => UNSELECT IT
            var choicePosition = this.answer.indexOf(choice.id);

            this.answer.splice(choicePosition, 1);
        }
    }
};

/**
 * Check if choice is valid or not
 *    0 = nothing (unexpected answer not checked by user)
 *    1 = valid   (expected answer checked by user)
 *    2 = false   (unexpected answer checked by user OR valid answer not checked by user)
 * @param   {Object} choice
 * @returns {Number}
 *
 * @todo expected answers not checked by user should not be shown as bad result except after the last step try
 */
ChoiceQuestionCtrl.prototype.isChoiceValid = function isChoiceValid(choice) {
    var isValid = 0;

    // if there is any answer in student data
    if (this.answer && this.answer.length > 0 && this.question.solutions) {
        if (this.isChoiceSelected(choice)) {
            // The choice has been selected by User => check if it's a right response or not
            if (this.ChoiceQuestionService.isChoiceValid(this.question, choice)) {
                // The current choice is part of the right response => User choice is Valid
                isValid = 1;
            } else {
                // The current choice is not part of the right response => User choice is Invalid
                isValid = 2;
            }
        }
    }

    return isValid;
};

/**
 * For unique choice
 * @returns {Boolean}
 */
ChoiceQuestionCtrl.prototype.isUniqueChoiceValid = function isUniqueChoiceValid() {
    var valid = false;
    if (!this.question.multiple) {
        // Loop over all choice to see if the correct one has been selected
        for (var i = 0; i < this.choices.length; i++) {
            if (1 === this.isChoiceValid(this.choices[i])) {
                valid = true;
                break;
            }
        }
    }

    return valid;
};

/**
 * Check if a choice has been selected by User
 * @param   {Object} choice
 * @returns {Boolean}
 */
ChoiceQuestionCtrl.prototype.isChoiceSelected = function isChoiceSelected(choice) {
    return this.ChoiceQuestionService.isChoiceSelected(this.answer, choice);
};

/**
 * Get the Feedback of a Choice
 * @param   {Object} choice
 * @returns {String}
 */
ChoiceQuestionCtrl.prototype.getChoiceFeedback = function getChoiceFeedback(choice) {
    var feedback = null;
    if (this.isChoiceSelected(choice)) {
        feedback = this.ChoiceQuestionService.getChoiceFeedback(this.question, choice);
    }

    return feedback;
};

/**
 * Validate Holes when feedback are shown to know which answers are valid
 */
ChoiceQuestionCtrl.prototype.onFeedbackShow = function onFeedbackShow() {
    // Validate holes
    if (this.question.solutions) {
        for (var i = 0; i < this.choices.length; i++) {
            this.choices[i].valid = this.isChoiceValid(this.choices[i]);
        }
    }
    
    this.answersAllFound();
};

ChoiceQuestionCtrl.prototype.answersAllFound = function answersAllFound() {
    var numAnswersFound = 0;
    var numSolutions = 0;
    for (var i=0; i<this.question.solutions.length; i++) {
        if (this.question.solutions[i].score > 0) {
            numSolutions++;
        }
        for (var j=0; j<this.answer.length; j++) {
            if (this.question.solutions[i].id === this.answer[j] && this.question.solutions[i].score > 0) {
                numAnswersFound++;
            }
        }
    }
    
    if (numAnswersFound === numSolutions) {
        // all answers have been found
        this.feedback.state = 0;
    }
    else if (numAnswersFound === numSolutions -1 && this.question.multiple) {
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
    .controller('ChoiceQuestionCtrl', ChoiceQuestionCtrl);
