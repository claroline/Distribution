<?php

namespace UJM\ExoBundle\Library\Attempt;

/**
 * A user answer to a question, formatted to be marked.
 */
class CorrectedAnswer
{
    /**
     * The expected answers that have been chosen by the user.
     *
     * @var array
     */
    private $expected = [];

    /**
     * The expected answers that have been missed by the user.
     *
     * @var array
     */
    private $missing = [];

    /**
     * The answers that are not supposed to be chosen by the user.
     *
     * @var array
     */
    private $unexpected = [];

    /**
     * Penalties to apply to apply (eg. hints).
     *
     * @var array
     */
    private $penalties = [];

    public function getExpected()
    {
        return $this->expected;
    }

    public function getMissing()
    {
        return $this->missing;
    }

    public function getUnexpected()
    {
        return $this->unexpected;
    }

    public function getPenalties()
    {
        return $this->penalties;
    }
}
