<?php

namespace UJM\ExoBundle\Serializer\Question;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerCollector;

/**
 * Collects question type serializers.
 *
 * @DI\Service("ujm_exo.serializer.question_collector")
 */
class QuestionSerializerCollector extends QuestionHandlerCollector
{
}
