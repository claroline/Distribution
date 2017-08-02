<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Twig;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Serializer\User\UserSerializer;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service
 * @DI\Tag("twig.extension")
 */
class UserExtension extends \Twig_Extension
{
    /**
     * @var UserSerializer
     */
    private $userSerializer;

    /**
     * UserExtension constructor.
     *
     * @DI\InjectParams({
     *     "userSerializer" = @DI\Inject("claroline.serializer.user")
     * })
     *
     * @param UserSerializer $userSerializer
     */
    public function __construct(UserSerializer $userSerializer)
    {
        $this->userSerializer = $userSerializer;
    }

    public function getName()
    {
        return 'user_extension';
    }

    public function getFilters()
    {
        return [
            new \Twig_SimpleFilter('get_serialized_user', [$this, 'serializeUser']),
        ];
    }

    /**
     * Gets a serialized representation of the user.
     *
     * @param User $user
     *
     * @return array
     */
    public function serializeUser(User $user)
    {
        return $this->userSerializer->serialize($user);
    }
}
