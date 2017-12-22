<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew\Contact;

use Claroline\CoreBundle\Annotations\ApiMeta;
use Claroline\CoreBundle\API\Serializer\Contact\ContactSerializer;
use Claroline\CoreBundle\Controller\APINew\AbstractCrudController;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\ApiManager;
use Claroline\CoreBundle\Manager\ContactManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @ApiMeta(class="Claroline\CoreBundle\Entity\Contact\Contact")
 * @EXT\Route("/contact")
 */
class ContactController extends AbstractCrudController
{
    private $apiManager;
    private $contactManager;
    private $contactSerializer;
    private $tokenStorage;

    /**
     * ContactController constructor
     *
     * @DI\InjectParams({
     *     "apiManager"        = @DI\Inject("claroline.manager.api_manager"),
     *     "contactManager"    = @DI\Inject("claroline.manager.contact_manager"),
     *     "contactSerializer" = @DI\Inject("claroline.serializer.contact"),
     *     "tokenStorage"      = @DI\Inject("security.token_storage")
     * })
     *
     * @param ApiManager            $apiManager
     * @param ContactManager        $contactManager
     * @param ContactSerializer     $contactSerializer
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ApiManager $apiManager,
        ContactManager $contactManager,
        ContactSerializer $contactSerializer,
        TokenStorageInterface $tokenStorage
    ) {
        $this->apiManager = $apiManager;
        $this->contactManager = $contactManager;
        $this->contactSerializer = $contactSerializer;
        $this->tokenStorage = $tokenStorage;
    }

    public function getName()
    {
        return 'contact';
    }

    public function getDefaultHiddenFilters()
    {
        $user = $this->tokenStorage->getToken()->getUser();

        return [
            'user' => $user !== 'anon.' ? $user->getId() : null,
        ];
    }

    /**
     * @EXT\Route(
     *     "/contacts/create",
     *     name="apiv2_contacts_create"
     * )
     * @EXT\ParamConverter("currentUser", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param User $currentUser
     *
     * @return JsonResponse
     */
    public function recursiveListAction(User $currentUser)
    {
        $serializedContacts = [];
        $users = $this->apiManager->getParameters('ids', 'Claroline\CoreBundle\Entity\User');
        $contacts = $this->contactManager->createContacts($currentUser, $users);

        foreach ($contacts as $contact) {
            $serializedContacts[] = $this->contactSerializer->serialize($contact);
        }

        return new JsonResponse($serializedContacts);
    }
}
