<?php

namespace Claroline\CoreBundle\Controller\APINew;

use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Validator\Exception\InvalidDataException;
use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class AbstractController extends ContainerAware
{
    /** @var FinderProvider */
    protected $finder;

    /** @var SerializerProvider */
    protected $serializer;

    /** @var Crud */
    protected $crud;

    /** @var ObjectManager */
    protected $om;

    /** @var ContainerInterface */
    protected $container;

    protected $options;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
        $this->finder = $container->get('claroline.api.finder');
        $this->serializer = $container->get('claroline.api.serializer');
        $this->crud = $container->get('claroline.api.crud');
        $this->om = $container->get('claroline.persistence.object_manager');
        $this->options = $this->mergeOptions();
    }

    public function getAction($id, $class, $env)
    {
        $object = $this->find($class, $id);

        return $object ?
            new JsonResponse(
                $this->serializer->serialize($object, $this->options['get'])
            ) :
            new JsonResponse('', 404);
    }

    public function listAction(Request $request, $class, $env)
    {
        return new JsonResponse($this->finder->search(
            $class,
            $request->query->all(),
            $this->options['list']
        ));
    }

    public function createAction(Request $request, $class, $env)
    {
        try {
            $object = $this->crud->create(
                $class,
                $this->decodeRequest($request),
                $this->options['create']
            );

            return new JsonResponse(
                $this->serializer->serialize($object, $this->options['get']),
                201
            );
        } catch (\Exception $e) {
            return $this->handleException($e, $env);
        }
    }

    public function updateAction($id, Request $request, $class, $env)
    {
        try {
            $object = $this->crud->update(
                $class,
                $this->decodeRequest($request),
                $this->options['update']
            );

            return new JsonResponse(
                $this->serializer->serialize($object, $this->options['get'])
            );
        } catch (\Exception $e) {
            return $this->handleException($e, $env);
        }
    }

    public function deleteBulkAction(Request $request, $class, $env)
    {
        try {
            $this->crud->deleteBulk(
                $this->decodeIdsString($request, $class),
                $this->options['deleteBulk']
            );

            return new JsonResponse(null, 204);
        } catch (\Exception $e) {
            return $this->handleException($e, $env);
        }
    }

    //maybe handle the exception better ?
    protected function handleException(\Exception $e, $env)
    {
        if ($e instanceof InvalidDataException) {
            return new JsonResponse($e->getErrors(), 422);
        }

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

    //@todo: not as lazy implementation
    protected function find($class, $id)
    {
        return $this->om->getRepository($class)->findOneBy(
            !is_numeric($id) && property_exists($class, 'uuid') ?
                ['uuid' => $id] :
                ['id' => $id]
        );
    }

    private function getDefaultOptions()
    {
        return [
            'list' => [],
            'get' => [],
            'create' => [],
            'update' => [],
            'deleteBulk' => []
        ];
    }

    private function mergeOptions()
    {
        return method_exists($this, 'getOptions') ?
            array_merge_recursive($this->getDefaultOptions(), $this->getOptions()):
            $this->getDefaultOptions();
    }
}
