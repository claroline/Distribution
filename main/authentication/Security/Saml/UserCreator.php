<?php

namespace Claroline\AuthenticationBundle\Security\Saml;

use Claroline\AppBundle\API\Crud;
use Claroline\CoreBundle\Entity\User;
use LightSaml\Model\Protocol\Response;
use LightSaml\SpBundle\Security\User\UserCreatorInterface;
use LightSaml\SpBundle\Security\User\UsernameMapperInterface;
use Symfony\Component\Security\Core\Authentication\Token\AnonymousToken;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserCreator implements UserCreatorInterface
{
    /** @var string */
    private $secret;
    /** @var TokenStorageInterface */
    private $tokenStorage;
    /** @var UsernameMapperInterface */
    private $usernameMapper;
    /** @var Crud */
    private $crud;

    /**
     * @param string                  $secret
     * @param TokenStorageInterface   $tokenStorage
     * @param UsernameMapperInterface $usernameMapper
     * @param Crud                    $crud
     */
    public function __construct(string $secret, TokenStorageInterface $tokenStorage, UsernameMapperInterface $usernameMapper, Crud $crud)
    {
        $this->secret = $secret;
        $this->tokenStorage = $tokenStorage;
        $this->usernameMapper = $usernameMapper;
        $this->crud = $crud;
    }

    /**
     * @param Response $response
     *
     * @return UserInterface|null
     */
    public function createUser(Response $response)
    {
        $username = $this->usernameMapper->getUsername($response);

        $email = $response
            ->getFirstAssertion()
            ->getFirstAttributeStatement()
            ->getFirstAttributeByName('iam-email')
            ->getFirstAttributeValue();

        $firstName = $response
            ->getFirstAssertion()
            ->getFirstAttributeStatement()
            ->getFirstAttributeByName('iam-firstname')
            ->getFirstAttributeValue();

        $lastName = $response
            ->getFirstAssertion()
            ->getFirstAttributeStatement()
            ->getFirstAttributeByName('iam-lastname')
            ->getFirstAttributeValue();


        // FIXME : I need a token to be able to start user creation process
        // but it's not already filled and I can't rewrite the whole process to test token existence.
        $this->setToken();

        try {
            /** @var User $user */
            $user = $this->crud->create(User::class, [
                'username' => $username,
                'firstName' => $firstName,
                'lastName' => $lastName,
                'email' => $email,
                'plainPassword' => uniqid(), // I cannot create a user without pass
            ], [Crud::THROW_EXCEPTION]);
        } catch (\Exception $e) {
            debug_print_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 50);
            die($e->getMessage());
        }

        return $user;
    }

    private function setToken()
    {
        if (null !== $this->tokenStorage->getToken()) {
            // user is already authenticated, there is nothing to do.
            return;
        }

        // creates an anonymous token with a dedicated role.
        $this->tokenStorage->setToken(
            new AnonymousToken($this->secret, 'anon.', ['ROLE_ANONYMOUS'])
        );
    }
}