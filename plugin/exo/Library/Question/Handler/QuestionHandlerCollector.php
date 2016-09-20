<?php

namespace UJM\ExoBundle\Library\Question\Handler;

use UJM\ExoBundle\Library\Question\Handler\Exception\UnregisterableHandlerException;
use UJM\ExoBundle\Library\Question\Handler\Exception\UnregisteredHandlerException;
use UJM\ExoBundle\Library\Question\QuestionType;

/**
 * Collects handler for each Question type defined.
 *
 * This class can be used for any service which needs to manage Question Types (e.g. export of Question Types).
 * The handlers are injected during compilation passes.
 */
abstract class QuestionHandlerCollector
{
    /**
     * @var QuestionHandlerInterface[]
     */
    private $handlers = [];

    /**
     * Adds a question handler to the collection.
     *
     * @param QuestionHandlerInterface $handler
     *
     * @throws UnregisterableHandlerException
     */
    public function addHandler(QuestionHandlerInterface $handler)
    {
        if (!is_string($handler->getQuestionMimeType())) {
            throw UnregisterableHandlerException::notAStringMimeType($handler);
        }

        if (!in_array($handler->getQuestionMimeType(), QuestionType::getList())) {
            throw UnregisterableHandlerException::unsupportedMimeType($handler);
        }

        if ($this->hasHandlerForMimeType($handler->getQuestionMimeType())) {
            throw UnregisterableHandlerException::duplicateMimeType($handler);
        }

        $this->handlers[$handler->getQuestionMimeType()] = $handler;
    }

    /**
     * Returns the handler for a specific MIME type, if any.
     *
     * @param string $type
     *
     * @throws UnregisteredHandlerException
     *
     * @return QuestionHandlerInterface
     */
    public function getHandlerForMimeType($type)
    {
        if (isset($this->handlers[$type])) {
            return $this->handlers[$type];
        }

        throw new UnregisteredHandlerException(
            $type,
            UnregisteredHandlerException::TARGET_MIME_TYPE
        );
    }

    /**
     * @param string $type
     *
     * @return bool
     */
    public function hasHandlerForMimeType($type)
    {
        return isset($this->handlers[$type]);
    }
}
