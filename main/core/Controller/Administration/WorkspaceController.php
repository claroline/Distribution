<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\Administration;

use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Form\WorkspaceImportType;
use Claroline\CoreBundle\Manager\WorkspaceManager;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Tag("security.secure_service")
 * @SEC\PreAuthorize("canOpenAdminTool('workspace_management')")
 */
class WorkspaceController extends Controller
{
    private $om;
    private $eventDispatcher;
    private $finder;
    private $workspaceManager;
    private $authChecker;

    /**
     * WorkspaceController constructor.
     *
     * @DI\InjectParams({
     *     "om"               = @DI\Inject("claroline.persistence.object_manager"),
     *     "eventDispatcher"  = @DI\Inject("claroline.event.event_dispatcher"),
     *     "workspaceManager" = @DI\Inject("claroline.manager.workspace_manager"),
     *     "finder"           = @DI\Inject("claroline.api.finder"),
     *     "tokenStorage"     = @DI\Inject("security.token_storage"),
     *     "authChecker"       = @DI\Inject("security.authorization_checker"),
     * })
     *
     * @param WorkspaceManager $workspaceManager
     * @param ObjectManager    $om
     * @param StrictDispatcher $eventDispatcher
     * @param FinderProvider   $finder,
     * @param AuthorizationCheckerInterface $authChecker
     */
    public function __construct(
        WorkspaceManager $workspaceManager,
        ObjectManager $om,
        StrictDispatcher $eventDispatcher,
        FinderProvider $finder,
        TokenStorageInterface $tokenStorage,
        AuthorizationCheckerInterface $authChecker
    ) {
        $this->workspaceManager = $workspaceManager;
        $this->om = $om;
        $this->eventDispatcher = $eventDispatcher;
        $this->finder = $finder;
        $this->tokenStorage = $tokenStorage;
        $this->authChecker = $authChecker;
    }

    /**
     * @EXT\Template
     * @EXT\Route("", name="claro_admin_workspace_list", options={"expose"=true})
     *
     * @return array
     */
    public function indexAction(Request $request)
    {
        $filters = $request->query->get('filters');
        if ($filters) {
            $filters = ['model' => false, 'personal' => false];
        }

        $workspaces = $this->finder->search(
          'Claroline\CoreBundle\Entity\Workspace\Workspace',
          [
            'limit' => 20,
            'filters' => $filters,
            'sortBy' => 'name',
          ]
        );
        //$userLogged = $this->tokenStorage->getToken()->getUser();
        $isAdmin = $this->authChecker->isGranted('ROLE_ADMIN');
        return [
            'workspaces' => $workspaces,
            'isAdmin' => $isAdmin,
        ];
    }

    /**
     * @EXT\Route("/import/form", name="claro_admin_workspace_import_form", options={"expose"=true})
     * @EXT\Template
     */
    public function importWorkspaceFormAction()
    {
        $form = $this->createForm(new WorkspaceImportType());

        return ['form' => $form->createView()];
    }

    /**
     * @EXT\Route("/import", name="claro_admin_workspace_import")
     * @EXT\Template("ClarolineCoreBundle:Administration/Workspaces:importWorkspaceForm.html.twig")
     */
    public function importWorkspaceAction()
    {
        $form = $this->createForm(new WorkspaceImportType());
        $form->handleRequest($this->get('request'));

        if ($form->isValid()) {
            $file = $form->get('file')->getData();
            $data = file_get_contents($file);
            $data = $this->container->get('claroline.utilities.misc')->formatCsvOutput($data);
            $lines = str_getcsv($data, PHP_EOL);

            $workspaces = [];
            foreach ($lines as $line) {
                if (trim($line) !== '') {
                    $workspaces[] = str_getcsv($line, ';');
                }
            }

            $this->workspaceManager->importWorkspaces($workspaces);

            return $this->redirect($this->generateUrl('claro_admin_open_tool', ['toolName' => 'workspace_management']));
        }

        return ['form' => $form->createView()];
    }
}
