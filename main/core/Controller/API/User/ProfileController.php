<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\API\User;

use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations\View;
use JMS\DiExtraBundle\Annotation as DI;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use Claroline\CoreBundle\Manager\FacetManager;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Put;
use Claroline\CoreBundle\Event\Profile\ProfileLinksEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Claroline\CoreBundle\Entity\User;
use Symfony\Component\HttpFoundation\Request;

/**
 * @NamePrefix("api_")
 */
class ProfileController extends FOSRestController
{
    /**
     * @DI\InjectParams({
     *     "facetManager" = @DI\Inject("claroline.manager.facet_manager"),
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "request"      = @DI\Inject("request")
     * })
     */
    public function __construct(
        FacetManager $facetManager,
        TokenStorageInterface $tokenStorage,
        Request $request
    ) {
        $this->facetManager = $facetManager;
        $this->tokenStorage = $tokenStorage;
        $this->request = $request;
    }

    /**
     * @Get("/profile/{user}/facets", name="get_profile_facets", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_profile"})
     */
    public function getFacetsAction(User $user)
    {
        $facets = $this->facetManager->getFacetsByUser($user);
        $ffvs = $this->facetManager->getFieldValuesByUser($user);
        $userRoles = $this->tokenStorage->getToken()->getRoles();

        foreach ($facets as $facet) {
            foreach ($facet->getPanelFacets() as $panelFacet) {
                foreach ($panelFacet->getFieldsFacet() as $field) {
                    foreach ($ffvs as $ffv) {
                        if ($ffv->getFieldFacet()->getId() === $field->getId()) {
                            //for serialization
                            $field->setUserFieldValue($ffv);
                        }
                    }

                    //for serialization
                    $field->setIsEditable(true);
                }
            }
        }

        return $facets;
    }

    /**
     * @Get("/profile/{user}/links", name="get_profile_links", options={ "method_prefix" = false })
     */
    public function getProfileLinksAction(User $user)
    {
        //add check access

        $request = $this->get('request');
        $profileLinksEvent = new ProfileLinksEvent($user, $request->getLocale());
        $this->get('event_dispatcher')->dispatch(
            'profile_link_event',
            $profileLinksEvent
        );

        return $profileLinksEvent->getLinks();
    }

    /**
     * @Put("/profile/{user}/fields", name="put_profile_fields", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_profile"})
     */
    public function putFieldsAction(User $user)
    {
        //add check access

        $fields = $this->request->request->get('fields');

        foreach ($fields as $field) {
            $fieldEntity = $this->facetManager->getFieldFacet($field['id']);
            $value = isset($field['user_field_value']) ? $field['user_field_value'] : null;
            $this->facetManager->setFieldValue($user, $fieldEntity, $value);
        }

        return $user;
    }
}
