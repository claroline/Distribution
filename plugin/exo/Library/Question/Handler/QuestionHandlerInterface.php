<?php

namespace UJM\ExoBundle\Library\Question\Handler;

interface QuestionHandlerInterface
{
    /**
     * Returns the supported MIME type (e.g. "application/x.choice+json").
     *
     * @return string
     */
    public function getQuestionMimeType();
}
