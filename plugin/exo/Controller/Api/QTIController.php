<?php

namespace UJM\ExoBundle\Controller\Api;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * Transfers questions in QTI format.
 *
 * @EXT\Route(
 *     "/qti",
 *     options={"expose"=true},
 *     defaults={"_format": "json"}
 * )
 */
class QTIController
{
    /**
     * Imports questions in QTI format.
     *
     * @EXT\Route(
     *     "/import",
     *     name="question_qti_import"
     * )
     * @EXT\Method("POST")
     */
    public function importAction()
    {

    }

    /**
     * Exports questions in QTI format.
     *
     * @EXT\Route(
     *     "/import",
     *     name="question_qti_export"
     * )
     * @EXT\Method("POST")
     */
    public function exportAction()
    {

    }
}
