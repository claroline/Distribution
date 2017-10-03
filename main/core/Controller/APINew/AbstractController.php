<?php

namespace Claroline\CoreBundle\Controller\APINew;

use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class AbstractController
{
    /** @var FinderProvider */
    private $finder;

    /** @var SerializerProvider */
    private $serializer;

    /** @var Crud */
    private $crud;

    /** @var ObjectManager */
    private $om;

    /**
     * ThemeController constructor.
     *
     * @DI\InjectParams({
     *     "finder"     = @DI\Inject("claroline.api.finder"),
     *     "crud"       = @DI\Inject("claroline.api.crud"),
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "om"         = @DI\Inject("claroline.persistence.object_manager")
     * })
     */
    public function __construct(
        FinderProvider $finder,
        SerializerProvider $serializer,
        Crud $crud,
        ObjectManager $om
    ) {
        $this->finder = $finder;
        $this->crud = $crud;
        $this->serializer = $serializer;
        $this->om = $om;
    }

    public function listAction(Request $request, $class, $env)
    {
        return new JsonResponse($this->finder->search($class, $request->query->all()));
    }

    public function createAction(Request $request, $class, $env)
    {
        try {
            $object = $this->crud->create($class, $this->decodeRequest($request));

            return new JsonResponse(
              $this->serializer->serialize($object),
              201
            );
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }

    public function updateAction($uuid, Request $request, $class, $env)
    {
        try {
            $object = $this->crud->update($class, $this->decodeRequest($request));

            return new JsonResponse(
                $this->serializer->serialize($object)
            );
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }

    public function deleteBulkAction(Request $request, $class, $env)
    {
        try {
            $this->crud->deleteBulk($this->decodeRequest($request));

            return new JsonResponse(null, 204);
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }

    protected function handleException(\Exception $e, $env)
    {
        if ($env === 'prod') {
            return new JsonResponse($e->getMessage(), 422);
        }
        throw $e;
    }

    protected function decodeRequest(Request $request)
    {
        return json_decode($request->getContent());
    }

    protected function decodeIdsString(Request $request, $class)
    {
        $ids = $request->query->get('ids');
        $property = is_numeric($ids[0]) ? 'id' : 'uuid';

        return $this->om->findList($class, $property, $ids);
    }

    protected function find($class, $id)
    {
        $object = new \stdClass();
        $property = is_numeric($id) ? 'id' : 'uuid';
        $object->{$property} = $property === 'uuid' ? $id : (int) $id;

        return $this->serializer->deserialize($class, $object);
    }
}
