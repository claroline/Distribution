<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\User;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\API\Serializer\User\ProfileSerializer;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Repository\UserRepository;
use Doctrine\ORM\NoResultException;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @EXT\Route("/user/profile")
 */
class ProfileController extends Controller
{
    /** @var TokenStorageInterface */
    private $tokenStorage;
    /** @var PlatformConfigurationHandler */
    private $configHandler;
    /** @var UserRepository */
    private $repository;
    /** @var UserSerializer */
    private $userSerializer;
    /** @var ProfileSerializer */
    private $profileSerializer;
    /** @var ParametersSerializer */
    private $parametersSerializer;

    /**
     * ProfileController constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage"         = @DI\Inject("security.token_storage"),
     *     "configHandler"        = @DI\Inject("claroline.config.platform_config_handler"),
     *     "om"                   = @DI\Inject("claroline.persistence.object_manager"),
     *     "userSerializer"       = @DI\Inject("claroline.serializer.user"),
     *     "profileSerializer"    = @DI\Inject("claroline.serializer.profile"),
     *     "parametersSerializer" = @DI\Inject("claroline.serializer.parameters")
     * })
     *
     * @param TokenStorageInterface        $tokenStorage
     * @param PlatformConfigurationHandler $configHandler
     * @param ObjectManager                $om
     * @param UserSerializer               $userSerializer
     * @param ProfileSerializer            $profileSerializer
     * @param ParametersSerializer         $parametersSerializer
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        PlatformConfigurationHandler $configHandler,
        ObjectManager $om,
        UserSerializer $userSerializer,
        ProfileSerializer $profileSerializer,
        ParametersSerializer $parametersSerializer
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->configHandler = $configHandler;
        $this->repository = $om->getRepository('ClarolineCoreBundle:User');
        $this->userSerializer = $userSerializer;
        $this->profileSerializer = $profileSerializer;
        $this->parametersSerializer = $parametersSerializer;
    }

    /**
     * Displays a user profile from its public URL or ID.
     *
     * @EXT\Route("/{user}", name="claro_user_profile")
     * @EXT\Template("ClarolineCoreBundle:user:profile.html.twig")
     *
     * @param string|int $user
     *
     * @return array
     */
    public function indexAction($user)
    {
        try {
            $profileUser = $this->repository->findOneByIdOrPublicUrl($user);
            $serializedUser = $this->userSerializer->serialize($profileUser, [Options::SERIALIZE_FACET]);

            return [
                'user' => $serializedUser,
                'facets' => $this->profileSerializer->serialize(),
                'parameters' => $this->parametersSerializer->serialize()['profile'],
            ];
        } catch (NoResultException $e) {
            throw new NotFoundHttpException('Page not found');
        }
    }
}
