<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 3/1/17
 */

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater090300 extends Updater
{
    private $container;
    private $workspaceManager;
    private $orgaManager;
    protected $logger;
    private $fileSystem;
    private $iconSetsDir;

    public function __construct(ContainerInterface $container, $logger)
    {
        $this->container = $container;
        $this->logger = $logger;
        $this->workspaceManager = $this->container->get('claroline.manager.workspace_manager');
        $this->workspaceManager->setLogger($logger);
        $this->orgaManager = $this->container->get('claroline.manager.organization.organization_manager');
        $this->orgaManager->setLogger($logger);
        $this->fileSystem = $container->get('filesystem');
        $this->iconSetsDir = $container->getParameter('claroline.param.icon_sets_directory');
    }

    public function preUpdate()
    {
        $roleManager = $this->container->get('claroline.manager.role_manager');
        $om = $this->container->get('claroline.persistence.object_manager');
        $models = $this->connection->query('SELECT * FROM claro_workspace_model')->fetchAll();

        foreach ($models as $model) {
            $code = '[MOD]'.$model['name'];
            $workspace = $om->getRepository('ClarolineCoreBundle:Workspace\Workspace')->findOneByCode($code);

            if (!$workspace) {
                $this->log('Creating workspace from model '.$model['name']);

                $modelUsers = $this->connection->query("SELECT * FROM claro_workspace_model_user u where u.model_id = {$model['id']}")->fetchAll();
                $modelGroups = $this->connection->query("SELECT * FROM claro_workspace_model_group g where g.model_id = {$model['id']}")->fetchAll();
                $modelResources = $this->connection->query("SELECT * FROM claro_workspace_model_resource r where r.model_id = {$model['id']}")->fetchAll();

                $userIds = array_map(function ($data) {
                    return $data['user_id'];
                }, $modelUsers);
                $groupIds = array_map(function ($data) {
                    return $data['group_id'];
                }, $modelGroups);
                $nodeIds = array_map(function ($data) {
                    return $data['resource_node_id'];
                }, $modelResources);

                $users = $om->findByIds('Claroline\CoreBundle\Entity\User', $userIds);
                $groups = $om->findByIds('Claroline\CoreBundle\Entity\User', $groupIds);
                $nodes = $om->findByIds('Claroline\CoreBundle\Entity\Resource\ResourceNode', $nodeIds);

                $newWorkspace = new Workspace();
                $newWorkspace->setName($name);
                $newWorkspace->setCode('[COPY] - '.$name);
                $this->createWorkspace($newWorkspace);
                $this->duplicateWorkspaceOptions($workspace, $newWorkspace);
                $this->duplicateWorkspaceRoles($workspace, $newWorkspace, $user);
                $this->duplicateOrderedTools($workspace, $newWorkspace);
                $baseRoot = $this->duplicateRoot($workspace, $newWorkspace, $user);
                $this->duplicateResources(
                  $nodes,
                  $this->getArrayRolesByWorkspace($workspace),
                  $user,
                  $baseRoot
                );

                $workspace->setIsModel(true);
                $managerRole = $roleManager->getManagerRole($workspace);
                $roleManager->associateRoleToMultipleSubjects($users, $managerRole);
                $roleManager->associateRoleToMultipleSubjects($groups, $managerRole);
                $this->om->persist($workspace);
                $this->om->endFlushSuite();
            } else {
                $this->log('Workspace already exists');
            }

            //TODO MODEL
            //migration des cursus ici aussi
        }
    }

    public function postUpdate()
    {
        $this->workspaceManager->bindWorkspaceToOrganization();
        $this->createPublicDirectory();
    }

    private function createPublicDirectory()
    {
        if (!$this->fileSystem->exists($this->iconSetsDir)) {
            $this->log('Creating icon sets directory in public files directory...');
            $this->fileSystem->mkdir($this->iconSetsDir, 0775);
            $this->fileSystem->chmod($this->iconSetsDir, 0775, 0000, true);
        }
    }
}
