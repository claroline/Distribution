import AbstractQuestionService from './AbstractQuestionService'

/**
 * Graphic Question Service
 * @param {FeedbackService} FeedbackService
 * @param {ImageAreaService} ImageAreaService
 * @constructor
 */
function GraphicQuestionService($log, ScoreService, FeedbackService, ImageAreaService) {
    AbstractQuestionService.apply(this, arguments);

    this.ImageAreaService = ImageAreaService;
}

// Extends AbstractQuestionCtrl
GraphicQuestionService.prototype = Object.create(AbstractQuestionService.prototype);

/**
 * Initialize the answer object for the Question
 */
GraphicQuestionService.prototype.initAnswer = function initAnswer() {
    return [];
};

/**
 * Get the correct answer from the solutions of a Question
 * @param   {Object} question
 * @returns {Array}
 */
GraphicQuestionService.prototype.getCorrectAnswer = function getCorrectAnswer(question) {
    var answer = [];

    return answer;
};

/**
 *
 */
GraphicQuestionService.prototype.answersAllFound = function answersAllFound(question, answers) {
    var feedbackState = -1;

    if (question.solutions) {
        var notFound = 0;
        for (var i = 0; i < question.solutions.length; i++) {
            for (var j = 0; j < answers.length; j++) {
                var found = this.ImageAreaService.isInArea(question.solutions[i], answers[j]);
                if (found) {
                    break;
                }
            }

            if (!found) {
                // zone has no answer
                notFound++;
            }
        }

        if (0 === notFound) {
            feedbackState = this.FeedbackService.SOLUTION_FOUND;
        } else if (1 === notFound) {
            feedbackState = this.FeedbackService.ONE_ANSWER_MISSING;
        } else {
            feedbackState = this.FeedbackService.MULTIPLE_ANSWERS_MISSING;
        }
    }

    return feedbackState;
};

GraphicQuestionService.prototype.getAreaStats = function getAreaStats(question, areaId) {
    var stats = null;

    if (question.stats && question.stats.solutions) {
        for (var area in question.stats.solutions) {
            if (question.stats.solutions.hasOwnProperty(area)) {
                if (question.stats.solutions[area].id = areaId) {
                    stats = question.stats.solutions[area];
                    break;
                }
            }
        }

        if (!stats) {
            // No User have chosen this answer
            stats = {
                id: areaId,
                count: 0
            };
        }
    }

    return stats;
};

GraphicQuestionService.prototype.getTotalScore = function (question) {
  let total = 0

  for (let i = 0; i < question.solutions.length; i++) {
    total += question.solutions[i].score
  }

  return total
}

GraphicQuestionService.prototype.getAnswerScore = function (question, answer) {
  let score = 0

  const foundSolutions = this.getFoundSolutions(question, answer)
  for (let i = 0; i < foundSolutions.length; i++) {
    score += foundSolutions[i].score
  }

  return score
}

GraphicQuestionService.prototype.getFoundSolutions = function (question, answer) {
  let found = []

  if (answer && 0 !== answer.length) {
    for (let i = 0; i < question.solutions.length; i++) {
      for (let j = 0; j < answer.length; j++) {
        let found = this.ImageAreaService.isInArea(question.solutions[i], answer[j])
        if (found) {
          found.push(question.solutions[i])
          break
        }
      }
    }
  }

  return found
}

export default GraphicQuestionService
