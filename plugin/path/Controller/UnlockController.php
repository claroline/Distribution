<?php
namespace Innova\PathBundle\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
// Controller dependencies
use Symfony\Bundle\FrameworkBundle\Controller\Controller as BaseController;
use Doctrine\Common\Persistence\ObjectManager;
use Innova\PathBundle\Manager\PathManager;
/**
 * Class UnlockController
 *
 * @Route(
 *      "/unlock",
 *      name    = "innova_path",
 * )
 */
class UnlockController extends BaseController
{
    protected $om;
    protected $pathManager;
    /**
     * Class constructor - Inject required services
     * @param \Doctrine\Common\Persistence\ObjectManager       $objectManager
     * @param \Innova\PathBundle\Manager\PathManager           $pathManager
     */
    public function __construct(
        ObjectManager          $objectManager,
        PathManager             $pathManager)
    {
        $this->om              = $objectManager;
        $this->pathManager     = $pathManager;
    }
    /**
     * List users using this path
     * @Route(
     *     "/list/{id}",
     *     name         = "innova_path_publish",
     *     requirements = {"id" = "\d+"},
     *     options      = {"expose" = true}
     * )
     * @Template("InnovaPathBundle::pathManagement.html.twig")
     * @Method("GET")
     */
    public function listUserAction(Path $path)
    {
        //retrieve users doing the path
        //???
        /*foreach ($users as $user)
        {
            //get their progression
            $progression = $this->pathManager->getUserProgression($path, $user);
            //
        }*/
        $paths = $this->container->get('innova_path.manager.path')->findAccessibleByUser();
        return array (
            'paths'      => $paths,
        );
    }
    /**
     * Ajax call for unlocking step
     * @Route(
     *     "/unlock/{path}/{step}/{user}",
     *     name="innova_paths_unlock",
     *     options={"expose"=true}
     * )
     * @Method("GET")
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function unlockAction(Path $path, Step $step, User $user)
    {
    }
}
