<?php

namespace Claroline\AuthenticationBundle\Security\Saml;

use Claroline\AppBundle\API\Crud;
use Claroline\CoreBundle\Entity\User;
use LightSaml\Model\Protocol\Response;
use LightSaml\SpBundle\Security\User\UserCreatorInterface;
use LightSaml\SpBundle\Security\User\UsernameMapperInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserCreator implements UserCreatorInterface
{
    /** @var UsernameMapperInterface */
    private $usernameMapper;

    /** @var Crud */
    private $crud;

    /**
     * @param UsernameMapperInterface $usernameMapper
     * @param Crud                    $crud
     */
    public function __construct(TokenStorageInterface $tokenStorage, UsernameMapperInterface $usernameMapper, Crud $crud)
    {
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

        var_dump($this->tokenStorage->getToken());
        die();

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
}