<?php
/**
 * This file is part of the Claroline Connect package
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 2/19/15
 */

namespace Claroline\InwicastPluginBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\InwicastPluginBundle\Entity\Mediacenter;
use Claroline\InwicastPluginBundle\Repository\MediacenterUserRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\Session\Session;

/**
 * Class MediacenterUserManager
 * @package Claroline\InwicastPluginBundle\Manager
 *
 * @DI\Service("inwicast.plugin.manager.mediacenteruser")
 */
class MediacenterUserManager
{
    /**
     * @var \Claroline\InwicastPluginBundle\Repository\MediacenterUserRepository
     */
    private $mediacenterUserRepository;

    /**
     * @var \Symfony\Component\HttpFoundation\Session\Session
     */
    private $session;

    /**
     * @DI\InjectParams({
     *      "mediacenterUserRepository"     = @DI\Inject("inwicast.plugin.repository.mediacenteruser"),
     *      "session"                       = @DI\Inject("session")
     * })
     */
    public function __construct(
        MediacenterUserRepository $mediacenterUserRepository,
        Session $session
    ) {
        $this->mediacenterUserRepository = $mediacenterUserRepository;
        $this->session = $session;
    }

    public function getMediacenterUserToken(User $user, Mediacenter $mediacenter)
    {
        $hasInwicastToken = $this->session->get("has_inwicast_token");
        $token = $this->session->getId();
        if (!$hasInwicastToken) {
            $this->mediacenterUserRepository->createInwicastUserIfNotExists($user, $token, $mediacenter);
            $this->session->set("has_inwicast_token", true);
        }

        return $token;
    }
}
