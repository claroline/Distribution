<?php

namespace Innova\CollecticielBundle\Event\Log;

use Claroline\CoreBundle\Event\Log\AbstractLogResourceEvent;
use Claroline\CoreBundle\Event\Log\LogGenericEvent;
use Innova\CollecticielBundle\Entity\Drop;
use Innova\CollecticielBundle\Entity\Dropzone;

class LogDropEvaluateEvent extends AbstractLogResourceEvent
{
    const ACTION = 'resource-innova_collecticiel-drop_evaluate';

    /**
     * @param Dropzone $dropzone
     * @param Drop     $drop
     * @param string   $grade
     */
    public function __construct(Dropzone $dropzone, Drop $drop, $grade)
    {
        $documentsDetails = [];
        foreach ($drop->getDocuments() as $document) {
            $documentsDetails[] = $document->toArray();
        }

        $details = [
            'dropzone' => [
                'id' => $dropzone->getId(),
            ],
            'drop' => [
                'id' => $drop->getId(),
                'documents' => $documentsDetails,
                'owner' => [
                    'id' => $drop->getUser()->getId(),
                    'lastName' => $drop->getUser()->getLastName(),
                    'firstName' => $drop->getUser()->getFirstName(),
                    'username' => $drop->getUser()->getUsername(),
                ],
            ],
            'result' => $grade,
            'resultMax' => 20,
        ];

        parent::__construct($dropzone->getResourceNode(), $details);
    }

    /**
     * @return array
     */
    public static function getRestriction()
    {
        return [LogGenericEvent::DISPLAYED_WORKSPACE];
    }
}
