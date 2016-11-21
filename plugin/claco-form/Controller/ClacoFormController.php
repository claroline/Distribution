<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ClacoFormBundle\Controller;

use Claroline\ClacoFormBundle\Entity\Category;
use Claroline\ClacoFormBundle\Entity\ClacoForm;
use Claroline\ClacoFormBundle\Entity\Field;
use Claroline\ClacoFormBundle\Manager\ClacoFormManager;
use Claroline\CoreBundle\Library\Security\Collection\ResourceCollection;
use Claroline\CoreBundle\Manager\UserManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\Serializer;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class ClacoFormController extends Controller
{
    private $authorization;
    private $clacoFormManager;
    private $request;
    private $serializer;
    private $tokenStorage;
    private $userManager;

    /**
     * @DI\InjectParams({
     *     "authorization"    = @DI\Inject("security.authorization_checker"),
     *     "clacoFormManager" = @DI\Inject("claroline.manager.claco_form_manager"),
     *     "request"          = @DI\Inject("request"),
     *     "serializer"       = @DI\Inject("jms_serializer"),
     *     "tokenStorage"     = @DI\Inject("security.token_storage"),
     *     "userManager"      = @DI\Inject("claroline.manager.user_manager")
     * })
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        ClacoFormManager $clacoFormManager,
        Request $request,
        Serializer $serializer,
        TokenStorageInterface $tokenStorage,
        UserManager $userManager
    ) {
        $this->authorization = $authorization;
        $this->clacoFormManager = $clacoFormManager;
        $this->request = $request;
        $this->serializer = $serializer;
        $this->tokenStorage = $tokenStorage;
        $this->userManager = $userManager;
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/open",
     *     name="claro_claco_form_open",
     *     options={"expose"=true}
     * )
     * @EXT\Template()
     */
    public function clacoFormOpenAction(ClacoForm $clacoForm)
    {
        $this->checkRight($clacoForm, 'OPEN');
        $canEdit = $this->hasRight($clacoForm, 'EDIT');
        $fields = $clacoForm->getFields();
        $categories = $clacoForm->getCategories();
        $serializedFields = $this->serializer->serialize(
            $fields,
            'json',
            SerializationContext::create()->setGroups(['api_facet_admin'])
        );
        $serializedCategories = $this->serializer->serialize(
            $categories,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return [
            'canEdit' => $canEdit,
            'clacoForm' => $clacoForm,
            'fields' => $serializedFields,
            'categories' => $serializedCategories,
        ];
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/config/edit",
     *     name="claro_claco_form_configuration_edit",
     *     options={"expose"=true}
     * )
     */
    public function clacoFormConfigurationEditAction(ClacoForm $clacoForm)
    {
        $this->checkRight($clacoForm, 'EDIT');
        $configData = $this->request->request->get('configData', false);
        $details = $this->clacoFormManager->saveClacoFormConfig($clacoForm, $configData);

        return new JsonResponse($details, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/template/edit",
     *     name="claro_claco_form_template_edit",
     *     options={"expose"=true}
     * )
     */
    public function clacoFormTemplateEditAction(ClacoForm $clacoForm)
    {
        $this->checkRight($clacoForm, 'EDIT');
        $template = $this->request->request->get('template', false);
        $clacoFormTemplate = $this->clacoFormManager->saveClacoFormTemplate($clacoForm, $template);

        return new JsonResponse(['template' => $clacoFormTemplate], 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/field/create",
     *     name="claro_claco_form_field_create",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Creates a field
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function fieldCreateAction(ClacoForm $clacoForm)
    {
        $this->checkRight($clacoForm, 'EDIT');
        $fieldData = $this->request->request->get('fieldData', false);
        $field = $this->clacoFormManager->createField(
            $clacoForm,
            $fieldData['name'],
            $fieldData['type'],
            boolval($fieldData['required']),
            boolval($fieldData['searchable']),
            boolval($fieldData['isMetadata'])
        );
        $serializedField = $this->serializer->serialize(
            $field,
            'json',
            SerializationContext::create()->setGroups(['api_facet_admin'])
        );

        return new JsonResponse($serializedField, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/field/{field}/edit",
     *     name="claro_claco_form_field_edit",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Edits a field
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function fieldEditAction(Field $field)
    {
        $clacoForm = $field->getClacoForm();
        $this->checkRight($clacoForm, 'EDIT');
        $fieldData = $this->request->request->get('fieldData', false);
        $this->clacoFormManager->editField(
            $field,
            $fieldData['name'],
            $fieldData['type'],
            boolval($fieldData['required']),
            boolval($fieldData['searchable']),
            boolval($fieldData['isMetadata'])
        );
        $serializedField = $this->serializer->serialize(
            $field,
            'json',
            SerializationContext::create()->setGroups(['api_facet_admin'])
        );

        return new JsonResponse($serializedField, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/field/{field}/delete",
     *     name="claro_claco_form_field_delete",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Deletes a field
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function fieldDeleteAction(Field $field)
    {
        $clacoForm = $field->getClacoForm();
        $this->checkRight($clacoForm, 'EDIT');
        $serializedField = $this->serializer->serialize(
            $field,
            'json',
            SerializationContext::create()->setGroups(['api_facet_admin'])
        );
        $this->clacoFormManager->deleteField($field);

        return new JsonResponse($serializedField, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/field/get/by/name/{name}/excluding/id/{id}",
     *     name="claro_claco_form_get_field_by_name_excluding_id",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Returns the field
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getFieldByNameExcludingIdAction(ClacoForm $clacoForm, $name, $id = 0)
    {
        $this->checkRight($clacoForm, 'EDIT');
        $field = $this->clacoFormManager->getFieldByNameExcludingId($clacoForm, $name, $id);
        $serializedField = $this->serializer->serialize(
            $field,
            'json',
            SerializationContext::create()->setGroups(['api_facet_admin'])
        );

        return new JsonResponse($serializedField, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/category/create",
     *     name="claro_claco_form_category_create",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Creates a category
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function categoryCreateAction(ClacoForm $clacoForm)
    {
        $this->checkRight($clacoForm, 'EDIT');
        $categoryData = $this->request->request->get('categoryData', false);
        $managers = isset($categoryData['managers']) && count($categoryData['managers']) > 0 ?
            $this->userManager->getUsersByIds($categoryData['managers']) :
            [];
        $category = $this->clacoFormManager->createCategory(
            $clacoForm,
            $categoryData['name'],
            $managers,
            $categoryData['color'],
            boolval($categoryData['notifyAddition']),
            boolval($categoryData['notifyEdition']),
            boolval($categoryData['notifyRemoval'])
        );
        $serializedCategory = $this->serializer->serialize(
            $category,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedCategory, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/category/{category}/edit",
     *     name="claro_claco_form_category_edit",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Edits a category
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function categoryEditAction(Category $category)
    {
        $clacoForm = $category->getClacoForm();
        $this->checkRight($clacoForm, 'EDIT');
        $categoryData = $this->request->request->get('categoryData', false);
        $managers = isset($categoryData['managers']) && count($categoryData['managers']) > 0 ?
            $this->userManager->getUsersByIds($categoryData['managers']) :
            [];
        $category = $this->clacoFormManager->editCategory(
            $category,
            $categoryData['name'],
            $managers,
            $categoryData['color'],
            boolval($categoryData['notifyAddition']),
            boolval($categoryData['notifyEdition']),
            boolval($categoryData['notifyRemoval'])
        );
        $serializedCategory = $this->serializer->serialize(
            $category,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedCategory, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/category/{category}/delete",
     *     name="claro_claco_form_category_delete",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Deletes a category
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function categoryDeleteAction(Category $category)
    {
        $clacoForm = $category->getClacoForm();
        $this->checkRight($clacoForm, 'EDIT');
        $serializedCategory = $this->serializer->serialize(
            $category,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );
        $this->clacoFormManager->deleteCategory($category);

        return new JsonResponse($serializedCategory, 200);
    }

    private function checkRight(ClacoForm $clacoForm, $right)
    {
        $collection = new ResourceCollection([$clacoForm->getResourceNode()]);

        if (!$this->authorization->isGranted($right, $collection)) {
            throw new AccessDeniedException($collection->getErrorsForDisplay());
        }
    }

    private function hasRight(ClacoForm $clacoForm, $right)
    {
        $collection = new ResourceCollection([$clacoForm->getResourceNode()]);

        return $this->authorization->isGranted($right, $collection);
    }
}
