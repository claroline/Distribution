<?php

namespace Claroline\AuthenticationBundle\Security\Saml;

use Claroline\CoreBundle\Entity\User;
use Doctrine\Common\Persistence\ObjectManager;
use LightSaml\ClaimTypes;
use LightSaml\Model\Protocol\Response;
use LightSaml\SpBundle\Security\User\UserCreatorInterface;
use LightSaml\SpBundle\Security\User\UsernameMapperInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserCreator implements UserCreatorInterface
{
    /** @var ObjectManager */
    private $objectManager;

    /** @var UsernameMapperInterface */
    private $usernameMapper;

    /**
     * @param ObjectManager           $objectManager
     * @param UsernameMapperInterface $usernameMapper
     */
    public function __construct($objectManager, $usernameMapper)
    {
        $this->objectManager = $objectManager;
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

        $user = new User();
        $user->setUsername($username);

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

        var_dump($email);
        var_dump($firstName);
        die();

        $this->objectManager->persist($user);
        $this->objectManager->flush();

        return $user;
    }
}