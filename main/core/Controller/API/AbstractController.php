<?php

namespace Claroline\CoreBundle\Controller\API;

use Claroline\CoreBundle\API\Crud;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\Request;

class AbstractController
{
    /** @var FinderProvider */
    private $finder;

    /** @var Crud */
    private $crud;

    /**
     * ThemeController constructor.
     *
     * @DI\InjectParams({
     *     "finder" = @DI\Inject("claroline.api.finder"),
     *     "crud"   = @DI\Inject("claroline.api.crud")
     * })
     *
     * @param FinderProvider $finder
     * @param ThemeManager   $manager
     */
    public function __construct(
        FinderProvider $finder,
        Crud $crud
    ) {
        $this->finder = $finder;
        $this->crud = $crud;
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function listAction(Request $request)
    {
        return new JsonResponse(
          $this->finder->search(
              'Claroline\CoreBundle\Entity\Theme\Theme',
              $request->query->all()
          )
        );
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function createAction(Request $request)
    {
        try {
            $object = $this->crud->create->create(json_decode($request->getContent(), true));

            return new JsonResponse(
              $this->manager->serialize($object),
              201
            );
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * @return JsonResponse
     */
    public function updateAction(Request $request)
    {
        try {
            $this->manager->update($theme, json_decode($request->getContent(), true));

            return new JsonResponse(
                $this->manager->serialize($theme)
            );
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    public function deleteBulkAction(Request $request)
    {
        try {
            $this->manager->deleteBulk(json_decode($request->getContent()));

            return new JsonResponse(null, 204);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * Gets and Deserializes JSON data from Request.
     *
     * @param Request $request
     *
     * @return mixed $data
     */
    protected function decodeRequestData(Request $request)
    {
        $dataRaw = $request->getContent();

        $data = null;
        if (!empty($dataRaw)) {
            $data = json_decode($dataRaw);
        }

        return $data;
    }
}
