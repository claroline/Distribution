<?php

namespace UJM\ExoBundle\Library\Question\Handler\Exception;

use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;

/**
 * Exception thrown when a JSON question handler cannot be registered
 * by the handler collector.
 */
class UnregisterableHandlerException extends \Exception
{
    const DUPLICATE_MIME = 1;
    const NOT_A_STRING_MIME = 2;
    const UNSUPPORTED_MIME = 3;

    public static function notAStringMimeType(QuestionHandlerInterface $handler)
    {
        return self::notAString($handler, 'MIME type', self::NOT_A_STRING_MIME);
    }

    public static function unsupportedMimeType(QuestionHandlerInterface $handler)
    {
        return self::unsupported($handler, 'MIME type', self::UNSUPPORTED_MIME);
    }

    public static function duplicateMimeType(QuestionHandlerInterface $handler)
    {
        return self::duplicate($handler, 'MIME type', $handler->getQuestionMimeType(), self::DUPLICATE_MIME);
    }

    private static function notAString(QuestionHandlerInterface $handler, $type, $error)
    {
        return new self(
            sprintf(
                'Cannot register question handler %s: %s is not a string',
                get_class($handler),
                $type
            ),
            $error
        );
    }

    private static function unsupported(QuestionHandlerInterface $handler, $type, $error)
    {
        return new self(
            sprintf(
                'Cannot register question handler %s: %s is not supported',
                get_class($handler),
                $type
            ),
            $error
        );
    }

    private static function duplicate(QuestionHandlerInterface $handler, $type, $value, $error)
    {
        return new self(
            sprintf(
                'Cannot register question handler %s: a handler is already registered for %s "%s"',
                get_class($handler),
                $type,
                $value
            ),
            $error
        );
    }
}
