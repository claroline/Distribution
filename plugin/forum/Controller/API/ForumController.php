<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Annotations\ApiDoc;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

/**
 * @EXT\Route("/forum")
 */
class ForumController extends AbstractCrudController
{
    public function getName()
    {
        return 'forum';
    }

    /**
     * @EXT\Route("/{id}/subjects")
     * @EXT\Method("GET")
     *
     * @ApiDoc(
     *     description="Get the subjects of a forum",
     *     queryString={
     *         "$finder=Claroline\ForumBundle\Entity\Subject&!forum",
     *         {"name": "page", "type": "integer", "description": "The queried page."},
     *         {"name": "limit", "type": "integer", "description": "The max amount of objects per page."},
     *         {"name": "sortBy", "type": "string", "description": "Sort by the property if you want to."}
     *     },
     *     parameters={
     *         "id": {
     *              "type": {"string", "integer"},
     *              "description": "The forum id or uuid"
     *          }
     *     }
     * )
     *
     * @param string  $id
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getSubjectsAction($id, Request $request)
    {
        return new JsonResponse(
            $this->finder->search('Claroline\ForumBundle\Entity\Subject', array_merge(
                $request->query->all(),
                ['hiddenFilters' => ['forum' => [$id]]]
            ))
        );
    }

    /**
     * @EXT\Route("/{id}/subject")
     * @EXT\Method("POST")
     * @ParamConverter("forum", options={"mapping": {"id": "uuid"}})
     *
     * @ApiDoc(
     *     description="Create a subject in a forum",
     *     parameters={
     *         "id": {
     *              "type": {"string", "integer"},
     *              "description": "The forum id or uuid"
     *          }
     *     }
     * )
     *
     * @param string  $id
     * @param string  $class
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function createSubject(Forum $forum, Request $request)
    {
        $forum = $this->serializer->serialize($forum);
        $data = $this->decodeRequest($request);
        $data['forum'] = $forum;

        $object = $this->crud->create(
            'Claroline\ForumBundle\Entity\Subject',
            $data,
            $this->options['create']
        );

        if (is_array($object)) {
            return new JsonResponse($object, 400);
        }

        return new JsonResponse(
            $this->serializer->serialize($object, $this->options['get']),
            201
        );
    }

    public function getClass()
    {
        return "Claroline\ForumBundle\Entity\Forum";
    }
}
