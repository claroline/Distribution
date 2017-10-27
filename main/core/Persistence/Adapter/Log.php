<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Persistence\Adapter;

use Claroline\CoreBundle\Document\Log as MongoLog;
use Claroline\CoreBundle\Entity\Log\Log as MySqlLog;
use Claroline\CoreBundle\Model\Log as ModelLog;
use Claroline\CoreBundle\Model\LogInterface;
use Claroline\CoreBundle\Persistence\AdapterInterface;
use Claroline\CoreBundle\Persistence\Options;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.persistence.adapter.log")
 * @DI\Tag("claroline.adapter")
 */
class Log implements AdapterInterface
{
    //only adapt from model atm, maybe never allow the others
    public function adapt($log, $to)
    {
        $new = $to === Options::MYSQL ?
          new MySqlLog() : new MongoLog();

        return $this->migrate($log, $new);
    }

    private function migrate(LogInterface $model, LogInterface $new)
    {
        $new->setAction($model->getAction());
        $new->setDateLog($model->getDateLog());
        $new->setDetails($model->getDetails());
        $new->setDoerType($model->getDoerType());
        $new->setDoerIp($model->getDoerIp());
        $new->setDoerSessionId($model->getDoerSessionId());
        $new->setDoer($model->getDoer());

        foreach ($model->getDoerPlatformRoles() as $doerPlatformRole) {
            $new->addDoerPlatformRole($doerPlatformRole);
        }

        foreach ($model->getDoerWorkspaceRoles() as $workspaceRole) {
            $new->addDoerWorkspaceRole($workspaceRole);
        }

        $new->setReceiver($model->getReceiver());
        $new->setReceiverGroup($model->getReceiverGroup());
        $new->setOwner($model->getOwner());
        $new->setWorkspace($model->getWorkspace());
        $new->setResourceNode($model->getResourceNode());
        $new->setResourceType($model->getResourceType());
        $new->setRole($model->getRole());
        $new->setToolName($model->getToolName());
        $new->setIsDisplayedInAdmin($model->isDisplayedInAdmin());
        $new->setIsDisplayedInWorkspace($model->isDisplayedInWorkspace());
        $new->setOtherElementId($model->getOtherElementId());

        return $new;
    }

    public function fromMongo($mongoLog)
    {
        //some database fetches will be required at this point
    }

    public function fromMySql($log)
    {
        $model = new ModelLog();

        return $this->migrate($log, $model);
    }

    //maybe use getModel instead
    public function getInterface()
    {
        return 'Claroline\CoreBundle\Model\LogInterface';
    }
}
