<?php

namespace UJM\ExoBundle\Serializer;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Hint;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * Serializer for hint data.
 *
 * @DI\Service("ujm_exo.serializer.hint")
 */
class HintSerializer implements SerializerInterface
{
    /**
     * {@inheritdoc}
     *
     * @param Hint  $hint
     * @param array $options
     *
     * @return \stdClass
     */
    public function serialize($hint, array $options = [])
    {
        $hintData = new \stdClass();
        $hintData->id = (string) $hint->getId();

        if (0 !== $hint->getPenalty()) {
            $hintData->penalty = $hint->getPenalty();
        }

        if (isset($options['includeSolutions']) && $options['includeSolutions']) {
            $hintData->value = $hint->getValue();
        }

        return $hintData;
    }

    /**
     * {@inheritdoc}
     *
     * @param \stdClass $data
     * @param Hint      $hint
     * @param array     $options
     *
     * @return Hint
     */
    public function deserialize($data, $hint = null, array $options = [])
    {
        if (empty($hint)) {
            $hint = new Hint();
        }

        if (!empty($data->penalty) || 0 === $data->penalty) {
            $hint->setPenalty($data->penalty);
        }

        $hint->setValue($data->value);

        return $hint;
    }
}
