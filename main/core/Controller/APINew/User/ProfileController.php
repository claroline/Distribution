<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew\User;

use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\User\ProfileSerializer;
use Claroline\CoreBundle\Controller\APINew\AbstractApiController;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @EXT\Route("/profile")
 */
class ProfileController extends AbstractApiController
{
    /** @var Crud */
    private $crud;

    /** @var ProfileSerializer */
    private $serializer;

    /**
     * ProfileController constructor.
     *
     * @DI\InjectParams({
     *     "crud"       = @DI\Inject("claroline.api.crud"),
     *     "serializer" = @DI\Inject("claroline.serializer.profile")
     * })
     *
     * @param Crud              $crud
     * @param ProfileSerializer $serializer
     */
    public function __construct(
        Crud $crud,
        ProfileSerializer $serializer
    ) {
        $this->crud = $crud;
        $this->serializer = $serializer;
    }

    public function getName()
    {
        return 'profile';
    }

    /**
     * @EXT\Route("")
     * @EXT\Method("GET")
     */
    public function getAction()
    {
        return new JsonResponse(
            $this->serializer->serialize()
        );
    }

    /**
     * @EXT\Route("")
     * @EXT\Method("PUT")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function updateAction(Request $request)
    {
        $formData = $this->decodeRequest($request);

        $updatedFacets = [];
        foreach ($formData as $facetData) {
            $updatedFacets[] = $this->crud->update(
                'Claroline\CoreBundle\Entity\Facet\Facet',
                $facetData,
                [Options::DEEP_DESERIALIZE]
            );
        }

        return new JsonResponse(
            $this->serializer->serialize()
        );
    }
}
