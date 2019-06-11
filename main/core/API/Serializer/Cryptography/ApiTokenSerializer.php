<?php

namespace Claroline\CoreBundle\API\Serializer\Cryptography;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\Entity\Cryptography\ApiToken;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.api_token_serializer")
 * @DI\Tag("claroline.serializer")
 */
class ApiTokenSerializer
{
    use SerializerTrait;

    private $userSerializer;

    /**
     * OptionsSerializer constructor.
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

    /**
     * @param Options $options
     *
     * @return array
     */
    public function serialize(ApiToken $token, array $options = [])
    {
        return [
            'id' => $token->getUuid(),
            'token' => $token->getToken(),
            'description' => $token->getDescription(),
            'user' => $token->getUser() ? $this->userSerializer->serialize($token->getUser()) : null,
        ];
    }

    /**
     * @param array        $data
     * @param Options|null $options
     *
     * @return Options
     */
    public function deserialize(array $data, ApiToken $token, array $options = [])
    {
        $this->sipe('description', 'setDescription', $data, $token);

        return $token;
    }

    public function getClass()
    {
        return ApiToken::class;
    }
}
