<?php

namespace Claroline\CoreBundle\Tests\NewAPI;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Symfony\Component\Security\Core\Authentication\Token\AnonymousToken;

class FinderProviderTest extends TransactionalTestCase
{
    /** @var SerializerProvider */
    private $provider;
    /** @var mixed[] */
    private $serializers;

    protected function setUp()
    {
        parent::setUp();
        $this->provider = $this->client->getContainer()->get('claroline.api.finder');
        $tokenStorage = $this->client->getContainer()->get('security.token_storage');
        $token = new AnonymousToken('key', 'anon.');
        $tokenStorage->setToken($token);
    }
}
