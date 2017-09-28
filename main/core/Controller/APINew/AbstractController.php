<?php

namespace Claroline\CoreBundle\Controller\APINew;

use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\API\SerializerProvider;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class AbstractController extends Controller
{
    /** @var FinderProvider */
    private $finder;

    /** @var SerializerProvider */
    private $serializer;

    /** @var Crud */
    private $crud;

    /**
     * ThemeController constructor.
     *
     * @DI\InjectParams({
     *     "finder"     = @DI\Inject("claroline.api.finder"),
     *     "crud"       = @DI\Inject("claroline.api.crud"),
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     * })
     */
    public function __construct(
        FinderProvider $finder,
        SerializerProvider $serializer,
        Crud $crud
    ) {
        $this->finder = $finder;
        $this->crud = $crud;
        $this->serializer = $serializer;
    }

    public function list(Request $request, $class, $page, $limit, $env)
    {
        return new JsonResponse(
            $this->finder->search($class, $page, $limit, $request->query->all())
        );
    }

    public function create(Request $request, $class, $env)
    {
        try {
            $object = $this->crud->create($class, $this->decodeRequest($request));

            return new JsonResponse(
              $this->serializer->serialize($object),
              201
            );
        } catch (\Exception $e) {
            if ($env === 'prod') {
                return new JsonResponse($e->getMessage(), 422);
            }
            throw $e;
        }
    }

    public function update($object, Request $request, $class, $env)
    {
        try {
            $object = $this->crud->update($class, $this->decodeRequest($request));

            return new JsonResponse(
                $this->serializer->serialize($object)
            );
        } catch (\Exception $e) {
            if ($env === 'prod') {
                return new JsonResponse($e->getMessage(), 422);
            }
            throw $e;
        }
    }

    public function deleteBulk(Request $request, $class, $env)
    {
        try {
            $this->crud->deleteBulk($this->decodeRequest($request));

            return new JsonResponse(null, 204);
        } catch (\Exception $e) {
            if ($env === 'prod') {
                return new JsonResponse($e->getMessage(), 422);
            }
            throw $e;
        }
    }

    private function decodeRequest(Request $request)
    {
        return json_decode($request->getContent());
    }
}
