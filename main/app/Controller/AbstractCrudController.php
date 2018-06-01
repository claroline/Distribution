<?php

namespace Claroline\AppBundle\Controller;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

abstract class AbstractCrudController extends AbstractApiController
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

    /** @var array */
    protected $options;

    /**
     * Get the name of the managed entity.
     *
     * @return string
     */
    abstract public function getName();

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
        $this->finder = $container->get('claroline.api.finder');
        $this->serializer = $container->get('claroline.api.serializer');
        $this->crud = $container->get('claroline.api.crud');
        $this->om = $container->get('claroline.persistence.object_manager');
        $this->options = $this->mergeOptions();
    }

    /**
     * @param Request $request
     * @param string  $class
     *
     * @return JsonResponse
     */
    public function findAction(Request $request, $class)
    {
        $query = $request->query->all();
        $data = $this->finder->fetch($class, $query['filters'], [], 0, 2);

        switch (count($data)) {
            case 0:
                return $this->sendResponse('No object found', 404);
                break;
            case 1:
                return $this->sendResponse(
                    $this->serializer->serialize($data[0], $this->options['get'])
                );
                break;
            default:
                return $this->sendResponse('Multiple results, use "list" instead', 400);
        }
    }

    /**
     * @param string $class
     *
     * @return JsonResponse
     */
    public function schemaAction($class)
    {
        return $this->sendResponse($this->serializer->getSchema($class));
    }

    /**
     * @param string|int $id
     * @param string     $class
     * @param string     $env
     *
     * @return JsonResponse
     */
    public function getAction($id, $class)
    {
        $object = $this->find($class, $id);

        return $object ?
            $this->sendResponse(
                $this->serializer->serialize($object, $this->options['get'])
            ) :
            $this->sendResponse("No object found for id {$id} of class {$class}", 404);
    }

    /**
     * @param string $class
     * @param string $field
     * @param string $value
     *
     * @return JsonResponse
     */
    public function existAction($class, $field, $value)
    {
        $objects = $this->om->getRepository($class)->findBy([$field => $value]);

        return $this->sendResponse(count($objects) > 0);
    }

    /**
     * @param Request $request
     * @param string  $class
     *
     * @return JsonResponse
     */
    public function listAction(Request $request, $class)
    {
        $query = $request->query->all();
        $hiddenFilters = isset($query['hiddenFilters']) ? $query['hiddenFilters'] : [];
        $query['hiddenFilters'] = array_merge($hiddenFilters, $this->getDefaultHiddenFilters());

        return $this->sendResponse($this->finder->search(
            $class,
            $query,
            $this->options['list']
        ));
    }

    /**
     * @param Request $request
     * @param string  $class
     *
     * @return JsonResponse
     */
    public function createAction(Request $request, $class)
    {
        $object = $this->crud->create(
            $class,
            $this->decodeRequest($request),
            $this->options['create']
        );

        if (is_array($object)) {
            return $this->sendResponse($object, 400);
        }

        return $this->sendResponse(
            $this->serializer->serialize($object, $this->options['get']),
            201
        );
    }

    /**
     * @param string|int $id
     * @param Request    $request
     * @param string     $class
     *
     * @return JsonResponse
     */
    public function updateAction($id, Request $request, $class)
    {
        $data = $this->decodeRequest($request);

        if (!isset($data['id'])) {
            $data['id'] = $id;
        }

        $object = $this->crud->update(
            $class,
            $data,
            $this->options['update']
        );

        if (is_array($object)) {
            return $this->sendResponse($object, 400);
        }

        return $this->sendResponse(
            $this->serializer->serialize($object, $this->options['get'])
        );
    }

    /**
     * @param Request $request
     * @param string  $class
     *
     * @return JsonResponse
     */
    public function deleteBulkAction(Request $request, $class)
    {
        $this->crud->deleteBulk(
            $this->decodeIdsString($request, $class),
            $this->options['deleteBulk']
        );

        return $this->sendResponse(null, 204);
    }

    /**
     * @param Request $request
     * @param string  $class
     *
     * @return JsonResponse
     */
    public function copyBulkAction(Request $request, $class)
    {
        $serializer = $this->serializer;
        $options = $this->options;

        $copies = $this->crud->copyBulk(
            $class,
            $this->decodeIdsString($request, $class),
            $this->options['copyBulk']
        );

        return $this->sendResponse(array_map(function ($copy) use ($serializer, $options) {
            return $serializer->serialize($copy, $options['get']);
        }, $copies), 200);
    }

    /**
     * @param Request $request
     * @param string  $class
     */
    protected function decodeIdsString(Request $request, $class)
    {
        $ids = $request->query->get('ids');
        $property = is_numeric($ids[0]) ? 'id' : 'uuid';

        return $this->om->findList($class, $property, $ids);
    }

    /**
     * @param string     $class
     * @param string|int $id
     */
    protected function find($class, $id)
    {
        return $this->om->getRepository($class)->findOneBy(
            !is_numeric($id) && property_exists($class, 'uuid') ?
                ['uuid' => $id] :
                ['id' => $id]
        );
    }

    /**
     * @return array
     */
    protected function getDefaultOptions()
    {
        return [
            'list' => [],
            'get' => [],
            'create' => [],
            'update' => [],
            'deleteBulk' => [],
            'copyBulk' => [],
            'exist' => [],
            'schema' => [],
            'find' => [],
        ];
    }

    /**
     * @return array
     */
    private function getDefaultRequirements()
    {
        return [
          'get' => ['id' => '^(?!.*(schema|copy|parameters|find|\/)).*'],
          'update' => ['id' => '^(?!.*(schema|parameters|find|\/)).*'],
          'exist' => [],
        ];
    }

    /**
     * @return array
     */
    protected function getRequirements()
    {
        return [];
    }

    /**
     * @return array
     */
    public function mergeRequirements()
    {
        return array_merge($this->getDefaultRequirements(), $this->getRequirements());
    }

    /**
     * @return array
     */
    protected function getOptions()
    {
        return [];
    }

    /**
     * @return array
     */
    private function mergeOptions()
    {
        return array_merge_recursive($this->getDefaultOptions(), $this->getOptions());
    }

    /**
     * @return array
     */
    public function getDefaultHiddenFilters()
    {
        return [];
    }
}
