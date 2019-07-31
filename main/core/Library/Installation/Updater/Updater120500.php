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

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater120500 extends Updater
{
    protected $logger;
    private $container;
    /** @var ObjectManager */
    private $om;
    /** @var PlatformConfigurationHandler */
    private $configHandler;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;
        $this->container = $container;
        $this->om = $container->get('claroline.persistence.object_manager');
        $this->configHandler = $container->get('claroline.config.platform_config_handler');
    }

    public function postUpdate()
    {
        $this->updatePlatformOptions();

        $this->removeTool('my_contacts');
        $this->removeTool('workspace_management');

        $this->updateRoutes();
    }

    private function updatePlatformOptions()
    {
        $header = $this->configHandler->getParameter('header_menu');
        if (!empty($header)) {
            $this->configHandler->setParameter('header_menu', [
                'search',
                'history',
                'favourites',
            ]);
        }

        $homeType = $this->configHandler->getParameter('home.redirection_type');
        $homeData = null;
        if ('login' === $homeType) {
            $homeType = 'none';
        } elseif ('new' === $homeType) {
            $homeType = 'tool';
        } elseif ('url' === $homeType) {
            $homeUrl = $this->configHandler->getParameter('home.redirection_url');
            if (!empty($homeUrl)) {
                $homeData = $homeUrl;
            } else {
                $homeType = 'none';
            }
        }

        $this->configHandler->setParameter('home', [
            'type' => $homeType,
            'data' => $homeData,
        ]);
    }

    private function removeTool($toolName, $admin = false)
    {
        $this->log(sprintf('Removing `%s` tool...', $toolName));

        $tool = $this->om->getRepository($admin ? 'ClarolineCoreBundle:Tool\AdminTool' : 'ClarolineCoreBundle:Tool\Tool')->findOneBy(['name' => $toolName]);
        if (!empty($tool)) {
            $this->om->remove($tool);
            $this->om->flush();
        }
    }

    public function updateRoutes()
    {
        $this->log('Updating routes in database rich text');
        //the list is probably incomplete, but it is a start

        $parsableEntities = [
            'Claroline\CoreBundle\Entity\Content' => ['content'],
            'Claroline\CoreBundle\Entity\Resource\Revision' => ['content'],
            'Claroline\AgendaBundle\Entity\Event' => ['description'],
            'Claroline\AnnouncementBundle\Entity\Announcement' => ['content'],
            'Innova\PathBundle\Entity\Path\Path' => ['description'],
            'Innova\PathBundle\Entity\Step' => ['description'],
            'Claroline\CoreBundle\Entity\Widget\Type\SimpleWidget' => ['content'],
            'UJM\ExoBundle\Entity\Exercise' => ['endMessage'],
            'UJM\ExoBundle\Entity\Item\Item' => ['content'],
            'Claroline\ForumBundle\Entity\Message' => ['content'],
        ];

        //this is the list of regexes we'll need to use
        $regexes = [
        ];

        foreach ($parsableEntities as $entity => $properties) {
            $this->log('Replacing old urls for '.$entity.'...');
            foreach ($properties as $property) {
                $this->log('Looking for property '.$property.'...');
                $em = $this->container->get('doctrine.orm.entity_manager');
                $metadata = $em->getClassMetadata($class);

                $tableName = $metadata->getTableName();
                $columnName = $metadata->getColumnName($property);

                foreach ($regexes as $regex => $replacement) {
                    $this->log('Matching regex '.$regex.'...');
                    $sql = 'SELECT * from '.$tableName.' WHERE '.$columnName." RLIKE '{$regex}'";
                    $this->log($sql);
                    $rsm = new ResultSetMappingBuilder($em);
                    $rsm->addRootEntityFromClassMetadata($class, '');
                    $query = $em->createNativeQuery($sql, $rsm);
                    $data = $query->getResult();
                    $this->log(count($data).'results...');
                    $i = 0;

                    foreach ($data as $entity) {
                        $this->log('Updating '.$i.'/'.count($data));
                        $func = 'get'.ucfirst($property);
                        $text = $entity->$func();
                        $text = preg_replace('#'.$regex.'#', $replacement, $text);
                        $func = 'set'.ucfirst($property);
                        $entity->$func($text);
                        $em->persist($entity);
                        ++$i;
                    }

                    $this->log('Flushing...');
                    $em->flush();
                }
            }
        }
    }
}
