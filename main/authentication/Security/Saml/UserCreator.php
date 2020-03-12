<?php

namespace Claroline\AuthenticationBundle\Security\Saml;

use Claroline\AppBundle\API\Crud;
use Claroline\CoreBundle\Entity\User;
use LightSaml\Model\Protocol\Response;
use LightSaml\SpBundle\Security\User\UserCreatorInterface;
use LightSaml\SpBundle\Security\User\UsernameMapperInterface;
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
    public function __construct(UsernameMapperInterface $usernameMapper, Crud $crud)
    {
        $this->usernameMapper = $usernameMapper;
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
            ->getFirstAttributeByName('iam-firstname')
            ->getFirstAttributeValue();

        /** @var User $user */
        $user = $this->crud->create(User::class, [
            'username' => $username,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'email' => $email,
            'plainPassword' => uniqid(), // I cannot create a user without pass
        ], [Crud::THROW_EXCEPTION]);

        return $user;
    }
}