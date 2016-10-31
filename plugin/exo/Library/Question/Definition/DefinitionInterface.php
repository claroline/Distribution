<?php

namespace UJM\ExoBundle\Library\Question\Definition;

interface DefinitionInterface
{
    /**
     * @return string
     */
    public function getMimeType();

    /**
     * @return mixed
     */
    public function getEntityClass();

    /**
     * @return mixed
     */
    public function getValidator();

    /**
     * @return mixed
     */
    public function getSerializer();

    /**
     * @return mixed
     */
    public function getQTIEncoder();

    /**
     * @return mixed
     */
    public function getAnswerValidator();

    /**
     * @return mixed
     */
    public function getAnswerSerializer();

    /**
     * @return float
     */
    public function getScore();

    /**
     * @return float
     */
    public function getTotal();
}
