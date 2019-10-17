<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Security;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Testing\MockeryTestCase;

class TokenUpdaterTest extends MockeryTestCase
{
    private $sc;
    private $om;

    public function setUp(): void
    {
        parent::setUp();

        $this->om = $this->mock('Claroline\AppBundle\Persistence\ObjectManager');
        $this->sc = $this->mock('Symfony\Component\Security\Core\SecurityContextInterface');
    }

    public function testUpdateNormal()
    {
        $token = $this->mock('Symfony\Component\Security\Core\Authentication\Token\AbstractToken');
        $token->shouldReceive('getRoles')->once()->andReturn([]);
        $user = new User();
        $token->shouldReceive('getUser')->once()->andReturn($user);
        $this->sc->shouldReceive('setToken')->once()
            ->with(anInstanceOf('Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken'));
        $this->getUpdater()->update($token);
    }

    public function testCancelUsurpation()
    {
        $token = $this->mock('Symfony\Component\Security\Core\Authentication\Token\AbstractToken');
        $user = new User();
        $token->shouldReceive('getUser')->once()->andReturn($user);
        $this->om->shouldReceive('refresh')->once()->with($user);
        $this->sc->shouldReceive('setToken')->once()
            ->with(anInstanceOf('Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken'));
        $this->getUpdater()->cancelUsurpation($token);
    }

    private function getUpdater(array $mockedMethods = [])
    {
        if (0 === count($mockedMethods)) {
            return new TokenUpdater($this->sc, $this->om);
        }

        $stringMocked = '[';
        $stringMocked .= array_pop($mockedMethods);

        foreach ($mockedMethods as $mockedMethod) {
            $stringMocked .= ",{$mockedMethod}";
        }

        $stringMocked .= ']';

        return $this->mock(
            'Claroline\CoreBundle\Controller\AdministrationController'.$stringMocked,
            [$this->sc, $this->om]
        );
    }
}
