<?php

namespace Claroline\CoreBundle\Security\Authentication;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Cryptography\ApiToken;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\PreAuthenticatedToken;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authentication\SimplePreAuthenticatorInterface;

/**
 * Manages authentication of users with api tokens.
 *
 * @DI\Service("claroline.security.authentication.apitoken_authenticator")
 */
class ApiTokenAuthenticator implements SimplePreAuthenticatorInterface
{
    private $om;

    /**
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager"),
     * })
     *
     * @param ObjectManager $om
     */
    public function inject(ObjectManager $om)
    {
        $this->om = $om;
    }

    public function supportsToken(TokenInterface $token, $providerKey)
    {/*
        var_dump('do I support ?'.$providerKey);
        var_dump($token instanceof PreAuthenticatedToken && $token->getProviderKey() === $providerKey);
*/
        return $token instanceof PreAuthenticatedToken && $token->getProviderKey() === $providerKey || $token instanceof UsernamePasswordToken;
    }

    public function createToken(Request $request, $providerKey)
    {
        $session = $request->hasPreviousSession() ? $request->getSession() : null;

        if ($session) {
            $token = $session->get('_security_main');
            $token = unserialize($token);

            return $token;
        }

        $apiKey = $request->query->get('apitoken');
        //skip if unavailable

        if (!$apiKey) {
            return null;
        }

        // initialize a new token for the user
        return new PreAuthenticatedToken(
            'anon.',
            $apiKey,
            $providerKey
        );
    }

    public function authenticateToken(TokenInterface $token, UserProviderInterface $userProvider, $providerKey)
    {
        if ($token instanceof UsernamePasswordToken) {
            var_dump($token);
            //return $token;
        }

        $apiKey = $token->getCredentials();
        $user = $this->om->getRepository(ApiToken::class)->findOneByToken($apiKey)->getUser();

        if (!$user) {
            throw new AuthenticationException(
                sprintf('No user found for api token "%s"', $apiKey)
            );
        }

        return new PreAuthenticatedToken(
            $user,
            $apiKey,
            $providerKey,
            $user->getRoles()
        );
    }
}
