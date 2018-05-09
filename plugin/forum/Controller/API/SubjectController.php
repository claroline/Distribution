<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Annotations\ApiDoc;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\ForumBundle\Entity\Subject;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

/**
 * @EXT\Route("/forum_subject")
 */
class SubjectController extends AbstractCrudController
{
    public function getName()
    {
        return 'forum_subject';
    }

    public function getClass()
    {
        return "Claroline\ForumBundle\Entity\Subject";
    }
    
    /**
     * @EXT\Route("/{id}/messages")
     * @EXT\Method("GET")

     * @ApiDoc(
     *     description="Get the messages of a subject",
     *     queryString={
     *         "$finder=Claroline\ForumBundle\Entity\Message&!parent&!subject",
     *         {"name": "page", "type": "integer", "description": "The queried page."},
     *         {"name": "limit", "type": "integer", "description": "The max amount of objects per page."},
     *         {"name": "sortBy", "type": "string", "description": "Sort by the property if you want to."}
     *     },
     *     parameters={
     *         "id": {
     *              "type": {"string", "integer"},
     *              "description": "The subject id or uuid"
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
    public function getMessagesAction($id, $class, Request $request)
    {
        return new JsonResponse(
          $this->finder->search('Claroline\ForumBundle\Entity\Message', array_merge(
              $request->query->all(),
              ['hiddenFilters' => ['subject' => [$id], 'parent' => null]]
            ))
        );
    }

    /**
     * @EXT\Route("/{id}/message")
     * @EXT\Method("POST")
     * @ParamConverter("forum", options={"mapping": {"id": "uuid"}})
     *
     * @ApiDoc(
     *     description="Create a message in a subject",
     *     parameters={
     *         "id": {
     *              "type": {"string", "integer"},
     *              "description": "The subject id or uuid"
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
    public function createMessage(Subject $subject, Request $request)
    {
        $subject = $this->serializer->serialize($subject);
        $data = $this->decodeRequest($request);
        $data['subject'] = $subject;

        $object = $this->crud->create(
            'Claroline\ForumBundle\Entity\Message',
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
        return "Claroline\ForumBundle\Entity\Subject";
    }
}
