<?php

namespace UJM\ExoBundle\Manager;

use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Validator\JsonSchema\Answer\AnswerValidator;

class AnswerManager
{
    /**
     * @var AnswerValidator
     */
    private $validator;

    public function __construct(
        AnswerValidator $answerValidator)
    {
        $this->validator = $answerValidator;
    }

    public function submit(Question $question, \stdClass $answer)
    {
        // Validate received data
        $errors = $this->validator->validate($answer);
        if (count($errors) > 0) {
            throw new ValidationException('Answer is not valid', $errors);
        }
    }
}
