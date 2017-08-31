<?php

namespace UJM\ExoBundle\Library\Csv;

class ArrayCompressor
{
    public function __construct($bracket = '[]', $separator = '|')
    {
        $this->bracket = $bracket;
        $this->separator = $separator;
    }

    public function compress(array $data)
    {
        $string = $this->bracket[0].array_shift($data);

        foreach ($el as $data) {
            $string .= $this->separator.$el;
        }

        return $string.$this->bracket[1];
    }
}
