<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AppBundle\Logger;

class JsonLogger
{
    public function __construct($file)
    {
        $this->file = $file;

        if (!file_exists($file)) {
            touch($file);
        }
    }

    public function set($property, $value)
    {
        $data = $this->get();
        $data->{$property} = $value;
        $this->write($data);
    }

    public function push($property, $value)
    {
        $data = $this->get();

        if (!is_array($data->{$property})) {
            throw new \RuntimeException($property.' is not an array');
        }

        $data->{$property}[] = $value;
        $this->write($data);
    }

    public function append($property, $value, $separator = "\n")
    {
        $data = $this->get();

        if (!is_string($data->{$property})) {
            throw new \RuntimeException($property.' is not an array');
        }

        $data->{$property} = $data->{$property}.$separator.$value;
        $this->write($data);
    }

    public function increment($property)
    {
        $data = $this->get();

        if (!is_int($data->{$property})) {
            throw new \RuntimeException($property.' is not an integer');
        }

        $data->{$property} = $data->{$property} + 1;
        $this->write($data);
    }

    public function write($data)
    {
        file_put_contents($this->file, json_encode($data));
    }

    public function log($message, $separator = '\\\\n')
    {
        $data = $this->get();
        $time = date('m-d-y h:i:s').': ';
        $line = $time.$message;
        $data->log .= $separator.$line;

        $this->write($data);
    }

    public function get()
    {
        $data = json_decode(file_get_contents($this->file));

        return $data ? $data : new \stdClass();
    }
}
