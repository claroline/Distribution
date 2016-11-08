<?php

namespace UJM\ExoBundle\Controller\Api\Question;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\BrowserKit\Request;
use UJM\ExoBundle\Entity\Category;

/**
 * Category API Controller exposes REST API.
 *
 * @EXT\Route(
 *     "/categories",
 *     options={"expose"=true},
 *     defaults={"_format": "json"}
 * )
 * @EXT\Method("GET")
 */
class CategoryController
{
    private $categoryManager;

    public function __construct()
    {
        
    }

    public function updateAction(Category $category)
    {

    }

    public function createAction(Request $request)
    {

    }

    public function deleteAction(Category $category)
    {

    }

    public function reassignQuestionsAction()
    {

    }
}
