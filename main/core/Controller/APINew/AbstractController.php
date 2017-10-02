<?php

namespace Claroline\CoreBundle\Controller\APINew;

use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Persistence\ObjectManager;
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

    public function list(Request $request, $class, $env)
    {
        return new JsonResponse($this->finder->search($class, $request->query->all()));
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
            $this->handleException($e, $env);
        }
    }

    public function update($uuid, Request $request, $class, $env)
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

    public function deleteBulk(Request $request, $class, $env)
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
        //get the id list
        $ids = [];

        return $this->om->findByIds($class, $ids);
    }

    protected function find($class, $id)
    {
        $object = new \stdClass();
        $object->id = $id;

        return $this->serializer->deserialize($class, $object);
    }
}
