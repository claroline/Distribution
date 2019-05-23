<?php

namespace Claroline\CoreBundle\API\Transfer\Action\Workspace;

use Claroline\AppBundle\API\Transfer\Action\AbstractDeleteAction;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.action")
 */
class Delete extends AbstractDeleteAction
{
    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Workspace\Workspace';
    }

    public function getAction()
    {
        return ['workspace', self::MODE_DELETE];
    }

    public function getBatchSize()
    {
        return 500;
    }

    public function supports($format, $options = null)
    {
        return in_array($format, ['json', 'csv']);
    }
}
