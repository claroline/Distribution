<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\AppBundle\API\Options;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Workspace\WorkspaceOptions;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater120501 extends Updater
{
    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;
        $this->container = $container;
        $this->conn = $container->get('doctrine.dbal.default_connection');
    }

    public function postUpdate()
    {
        $this->updateWorkspaceRedirection();
        $this->updateWorkspaceResourceRedirection();
    }

    public function updateWorkspaceRedirection()
    {
        $this->log('Updating workspace redirection');

        $data = [
          'platform_dashboard' => 'dashboard',
          'agenda_' => 'agenda',
          'resource_manager' => 'resources',
          'users' => 'community',
          'user_management' => 'community',
          'data_transfer' => 'transfer',
        ];

        foreach ($data as $old => $new) {
            $sql = "UPDATE claro_workspace_options SET details = REPLACE(details, '$old', '$new')";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
        }
    }

    public function updateWorkspaceResourceRedirection()
    {
        $this->log('Updating resource redirection');
        $om = $this->container->get('claroline.persistence.object_manager');

        $options = $om->getRepository(WorkspaceOptions::class)->createQueryBuilder('w')
          ->where('w.details LIKE :details')
          ->setParameter('details', '%\"opening_type\":\"resource\"%')
          ->getQuery()
          ->getResult();

        $i = 0;

        foreach ($options as $option) {
            $this->log('Restoring '.$option->getWorkspace()->getCode().' opening parameters.');
            $details = $option->getDetails();
            $resource = $om->getRepository(ResourceNode::class)->find($details['workspace_opening_resource']);

            if ($resource) {
                $this->log('Serialializing resource from workspace '.$option->getWorkspace()->getCode().'. Target is '.$resource->getName());
                $details['opening_target'] = $this->container->get('claroline.serializer.resource_node')->serialize($resource, [Options::ONLY_INDENTIFIERS]);
                $option->setDetails($details);
                $om->persist($option);

                ++$i;

                if (0 === $i % 500) {
                    $om->flush();
                }
            }
        }

        $om->flush();
    }
}
