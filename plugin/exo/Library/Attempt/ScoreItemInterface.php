<?php

namespace UJM\ExoBundle\Library\Attempt;

/**
 * Represents an item that an user can use (eg. an grid cell item) in the context of his attempt
 * and which will apply a score to final score.
 * This is usefull in case of a row/columns score définition (for now only in GridQuestion type)
 * where each row item have the same score but the score must be applied just once
 */
interface ScoreItemInterface
{
    /**
     * Get the score to apply.
     *
     * @return float
     */
    public function getScore();
}
