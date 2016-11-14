<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ClacoFormBundle\Controller;

use Claroline\ClacoFormBundle\Entity\ClacoForm;
use Claroline\ClacoFormBundle\Manager\ClacoFormManager;
use Claroline\CoreBundle\Library\Security\Collection\ResourceCollection;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class ClacoFormController extends Controller
{
    private $authorization;
    private $clacoFormManager;
    private $tokenStorage;

    /**
     * @DI\InjectParams({
     *     "authorization"    = @DI\Inject("security.authorization_checker"),
     *     "clacoFormManager" = @DI\Inject("claroline.manager.claco_form_manager"),
     *     "tokenStorage"     = @DI\Inject("security.token_storage")
     * })
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        ClacoFormManager $clacoFormManager,
        TokenStorageInterface $tokenStorage
    ) {
        $this->authorization = $authorization;
        $this->clacoFormManager = $clacoFormManager;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{$clacoForm}/open",
     *     name="claro_claco_form_open",
     *     options={"expose"=true}
     * )
     * @EXT\Template()
     */
    public function clacoFormOpenAction(ClacoForm $clacoForm)
    {
        $this->checkRight($clacoForm, 'OPEN');
        $canEdit = $this->hasRight($clacoForm, 'EDIT');

        return [
            'clacoForm' => $clacoForm,
            'canEdit' => $canEdit,
        ];
    }

    private function checkRight(ClacoForm $clacoForm, $right)
    {
        $collection = new ResourceCollection([$clacoForm->getResourceNode()]);

        if (!$this->authorization->isGranted($right, $collection)) {
            throw new AccessDeniedException($collection->getErrorsForDisplay());
        }
    }

    private function hasRight(ClacoForm $clacoForm, $right)
    {
        $collection = new ResourceCollection([$clacoForm->getResourceNode()]);

        return $this->authorization->isGranted($right, $collection);
    }
}
