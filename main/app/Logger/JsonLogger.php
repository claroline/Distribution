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
    private $file;
    private $cache;

    public function __construct($file)
    {
        $this->file = $file;
        $this->cache = null;

        if (!file_exists($file)) {
            if (!touch($file)) {
                throw new \Exception('Impossible to create log file '.$file);
            }
        }
    }

    public function set($property, $value)
    {
        $data = $this->get();
        $data[$property] = $value;
        $this->write($data);
    }

    public function push($property, $value)
    {
        $data = $this->get();

        if (isset($data[$property]) && !is_array($data[$property])) {
            throw new \RuntimeException($property.' is not an array');
        }

        $data[$property][] = $value;
        $this->write($data);
    }

    public function append($property, $value, $separator = "\n")
    {
        $data = $this->get();

        if (isset($data[$property]) && !is_string($data[$property])) {
            throw new \RuntimeException($property.' is not an array');
        }

        $data[$property] = $data[$property].$separator.$value;
        $this->write($data);
    }

    public function increment($property)
    {
        $data = $this->get();

        if (isset($data[$property]) && !is_int($data[$property])) {
            throw new \RuntimeException($property.' is not an integer');
        }

        $data[$property] = $data[$property] + 1;
        $this->write($data);
    }

    public function write($data)
    {
        $this->cache = $data;
        file_put_contents($this->file, json_encode($data));
    }

    public function log($message, $separator = '\\\\n')
    {
        $data = $this->get();
        $time = date('m-d-y h:i:s').': ';
        $line = $time.$message;
        isset($data['log']) ?
          $data['log'] .= $separator.$line :
          $data['log'] = $line;

        $this->write($data);
    }

    public function get()
    {
        $data = $this->cache ? $this->cache : json_decode(file_get_contents($this->file), true);

        return $data ? $data : [];
    }
}
