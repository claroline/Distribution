<?php

namespace UJM\ExoBundle\Library\Options;

/**
 * Defines grid question sum sub modes available.
 */
final class GridSumMode
{
    /**
     * @var string
     */
    const SUM_CELL = 'cell';

    /**
     * @var string
     */
    const SUM_COLUMN = 'col';

    /**
     * @var string
     */
    const SUM_ROW = 'row';

    /**
     * Returns the list of sum modes.
     *
     * @return array
     */
    public static function getList()
    {
        return [
            static::SUM_CELL,
            static::SUM_COLUMN,
            static::SUM_ROW,
        ];
    }
}
