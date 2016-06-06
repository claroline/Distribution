<?php

namespace Innova\PathBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
// Controller dependencies
use Innova\PathBundle\Manager\PathManager;
use Doctrine\Common\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Entity\User;
use Innova\PathBundle\Entity\Path\Path;

/**
 * Class ManageResultsController
 *
 * @Route(
 *      "/manage",
 *      name    = "innova_path_manageresults",
 *      service = "innova_path.controller.manageresults"
 * )
 */
class ManageResultsController
{
    /**
     * Current path manager
     * @var \Innova\PathBundle\Manager\PathManager
     */
    protected $pathManager;

    /**
     * Object manager
     * @var \Doctrine\Common\Persistence\ObjectManager
     */
    protected $om;

    /**
     * Class constructor
     *
     * @param \Innova\PathBundle\Manager\PathManager                     $pathManager
     * @param \Doctrine\Common\Persistence\ObjectManager                 $om
     */
    public function __construct(
        PathManager             $pathManager,
        ObjectManager           $objectManager)
    {
        $this->pathManager      = $pathManager;
        $this->om               = $objectManager;
    }

    /**
     * Display dashboard for path of users
     * @Route(
     *     "/userpath/{id}",
     *     name         = "innova_path_manage_results",
     *     requirements = {"id" = "\d+"},
     *     options      = {"expose" = true}
     * )
     * @Method("GET")
     * @ParamConverter("path", class="InnovaPathBundle:Path\Path", options={"id" = "id"})
     * @Template("InnovaPathBundle::manageResults.html.twig")
     */
    public function displayStepUnlockAction(Path $path)
    {
        //prevent direct access
        $this->pathManager->checkAccess('EDIT', $path);

        $data = array();
        $workspace = $path->getWorkspace();
        //get list of paths for WS
        $paths = $this->pathManager->getWorkspacePaths($workspace);

        //retrieve users having access to the WS
        //TODO Optimize
        $users = $this->om->getRepository('ClarolineCoreBundle:User')->findUsersByWorkspace($workspace);
        $userdata = array();
        //for all users in the WS
        foreach ($users as $user) {
            //get their progression
            $userdata[] = array(
                'user'          => $user,
                'progression'   => $this->pathManager->getUserProgression($path, $user),
                'locked'        => $this->pathManager->getPathLockedProgression($path)
            );
        }
        $data = array(
            'path'      => $path,
            'userdata'  => $userdata
        );
        return array(
            '_resource' => $path,
            'workspace' => $workspace,
            'data'      => $data
        );
    }
}
