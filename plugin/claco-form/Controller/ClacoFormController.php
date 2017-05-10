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
use Claroline\ClacoFormBundle\Entity\Comment;
use Claroline\ClacoFormBundle\Entity\Entry;
use Claroline\ClacoFormBundle\Entity\Field;
use Claroline\ClacoFormBundle\Entity\Keyword;
use Claroline\ClacoFormBundle\Manager\ClacoFormManager;
use Claroline\CoreBundle\Entity\Facet\FieldFacet;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\UserManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\Serializer;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ClacoFormController extends Controller
{
    private $clacoFormManager;
    private $filesDir;
    private $platformConfigHandler;
    private $request;
    private $serializer;
    private $tokenStorage;
    private $userManager;

    /**
     * @DI\InjectParams({
     *     "clacoFormManager"      = @DI\Inject("claroline.manager.claco_form_manager"),
     *     "filesDir"              = @DI\Inject("%claroline.param.files_directory%"),
     *     "platformConfigHandler" = @DI\Inject("claroline.config.platform_config_handler"),
     *     "request"               = @DI\Inject("request"),
     *     "serializer"            = @DI\Inject("jms_serializer"),
     *     "tokenStorage"          = @DI\Inject("security.token_storage"),
     *     "userManager"           = @DI\Inject("claroline.manager.user_manager")
     * })
     */
    public function __construct(
        ClacoFormManager $clacoFormManager,
        $filesDir,
        PlatformConfigurationHandler $platformConfigHandler,
        Request $request,
        Serializer $serializer,
        TokenStorageInterface $tokenStorage,
        UserManager $userManager
    ) {
        $this->clacoFormManager = $clacoFormManager;
        $this->filesDir = $filesDir;
        $this->platformConfigHandler = $platformConfigHandler;
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
        $this->clacoFormManager->checkRight($clacoForm, 'OPEN');
        $canEdit = $this->clacoFormManager->hasRight($clacoForm, 'EDIT');
        $user = $this->tokenStorage->getToken()->getUser();
        $isAnon = $user === 'anon.';
        $fields = $this->clacoFormManager->getFieldsByClacoForm($clacoForm);
        $keywords = $clacoForm->getKeywords();
        $categories = $clacoForm->getCategories();
        $allEntries = $this->clacoFormManager->getAllEntries($clacoForm);
        $publishedEntries = $this->clacoFormManager->getPublishedEntries($clacoForm);
        $nbEntries = count($allEntries);
        $nbPublishedEntries = count($publishedEntries);
        $myEntries = $isAnon ? [] : $this->clacoFormManager->getUserEntries($clacoForm, $user);
        $myCategories = $isAnon ? [] : $this->clacoFormManager->getCategoriesByManager($clacoForm, $user);
        $isCategoryManager = count($myCategories) > 0;
        $managerEntries = $isAnon ? [] : $this->clacoFormManager->getEntriesByCategories($clacoForm, $myCategories);
        $serializedFields = $this->serializer->serialize(
            $fields,
            'json',
            SerializationContext::create()->setGroups(['api_facet_admin'])
        );
        $serializedKeywords = $this->serializer->serialize(
            $keywords,
            'json',
            SerializationContext::create()->setGroups(['api_claco_form'])
        );
        $serializedCategories = $this->serializer->serialize(
            $categories,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );
        $serializedMyEntries = $this->serializer->serialize(
            $myEntries,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );
        $serializedManagerEntries = $this->serializer->serialize(
            $managerEntries,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );
        $canGeneratePdf = !$isAnon &&
            $this->platformConfigHandler->hasParameter('knp_pdf_binary_path') &&
            file_exists($this->platformConfigHandler->getParameter('knp_pdf_binary_path'));
        $sharedEntries = $this->clacoFormManager->generateSharedEntriesData($clacoForm);
        $cascadeLevelMax = $this->platformConfigHandler->hasParameter('claco_form_cascade_select_level_max') ?
            $this->platformConfigHandler->getParameter('claco_form_cascade_select_level_max') :
            2;

        return [
            'isAnon' => $isAnon,
            'userId' => $isAnon ? null : $user->getId(),
            'canEdit' => $canEdit,
            'isCategoryManager' => $isCategoryManager,
            'clacoForm' => $clacoForm,
            'fields' => $serializedFields,
            'keywords' => $serializedKeywords,
            'categories' => $serializedCategories,
            'myEntries' => $serializedMyEntries,
            'managerEntries' => $serializedManagerEntries,
            'nbEntries' => $nbEntries,
            'nbPublishedEntries' => $nbPublishedEntries,
            'canGeneratePdf' => $canGeneratePdf,
            'sharedEntries' => $sharedEntries,
            'cascadeLevelMax' => $cascadeLevelMax,
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
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
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
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
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
     *
     * Creates a field
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function fieldCreateAction(ClacoForm $clacoForm)
    {
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $fieldData = $this->request->request->get('fieldData', false);
        $choicesData = $this->request->request->get('choicesData', false);
        $choices = $choicesData ? $choicesData : [];

        foreach ($choices as $key => $choice) {
            $categoryId = isset($choice['category']['id']) ? $choice['category']['id'] : null;
            $choices[$key]['categoryId'] = $categoryId;
        }
        $required = is_bool($fieldData['required']) ? $fieldData['required'] : $fieldData['required'] === 'true';
        $isMetadata = is_bool($fieldData['isMetadata']) ? $fieldData['isMetadata'] : $fieldData['isMetadata'] === 'true';
        $locked = is_bool($fieldData['locked']) ? $fieldData['locked'] : $fieldData['locked'] === 'true';
        $lockedEditionOnly = is_bool($fieldData['lockedEditionOnly']) ?
            $fieldData['lockedEditionOnly'] :
            $fieldData['lockedEditionOnly'] === 'true';
        $hidden = is_bool($fieldData['hidden']) ? $fieldData['hidden'] : $fieldData['hidden'] === 'true';
        $choiceChildrenData = $this->request->request->get('choicesChildrenData', false);
        $choicesChildren = $fieldData['type'] === FieldFacet::SELECT_TYPE && $choiceChildrenData ?
            $choiceChildrenData :
            [];

        foreach ($choicesChildren as $parentId => $choicesList) {
            foreach ($choicesList as $key => $choice) {
                $categoryId = isset($choice['category']['id']) ? $choice['category']['id'] : null;
                $choicesChildren[$parentId][$key]['categoryId'] = $categoryId;
            }
        }
        $field = $this->clacoFormManager->createField(
            $clacoForm,
            $fieldData['name'],
            $fieldData['type'],
            $required,
            $isMetadata,
            $locked,
            $lockedEditionOnly,
            $hidden,
            $choices,
            $choicesChildren
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
     *
     * Edits a field
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function fieldEditAction(Field $field)
    {
        $clacoForm = $field->getClacoForm();
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $fieldData = $this->request->request->get('fieldData', false);
        $choicesData = $this->request->request->get('choicesData', false);
        $choices = $choicesData ? $choicesData : [];

        foreach ($choices as $key => $choice) {
            $categoryId = isset($choice['category']['id']) ? $choice['category']['id'] : null;
            $choices[$key]['categoryId'] = $categoryId;
        }
        $required = is_bool($fieldData['required']) ? $fieldData['required'] : $fieldData['required'] === 'true';
        $isMetadata = is_bool($fieldData['isMetadata']) ? $fieldData['isMetadata'] : $fieldData['isMetadata'] === 'true';
        $locked = is_bool($fieldData['locked']) ? $fieldData['locked'] : $fieldData['locked'] === 'true';
        $lockedEditionOnly = is_bool($fieldData['lockedEditionOnly']) ?
            $fieldData['lockedEditionOnly'] :
            $fieldData['lockedEditionOnly'] === 'true';
        $hidden = is_bool($fieldData['hidden']) ? $fieldData['hidden'] : $fieldData['hidden'] === 'true';
        $choiceChildrenData = $this->request->request->get('choicesChildrenData', false);
        $choicesChildren = $fieldData['type'] === FieldFacet::SELECT_TYPE && $choiceChildrenData ?
            $choiceChildrenData :
            [];

        foreach ($choicesChildren as $parentId => $choicesList) {
            foreach ($choicesList as $key => $choice) {
                $categoryId = isset($choice['category']['id']) ? $choice['category']['id'] : null;
                $choicesChildren[$parentId][$key]['categoryId'] = $categoryId;
            }
        }
        $this->clacoFormManager->editField(
            $field,
            $fieldData['name'],
            $fieldData['type'],
            $required,
            $isMetadata,
            $locked,
            $lockedEditionOnly,
            $hidden,
            $choices,
            $choicesChildren
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
     *
     * Deletes a field
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function fieldDeleteAction(Field $field)
    {
        $clacoForm = $field->getClacoForm();
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
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
     *
     * Returns the field
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getFieldByNameExcludingIdAction(ClacoForm $clacoForm, $name, $id = 0)
    {
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
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
     *     "/claco/form/field/{field}/choices/categories/retrieve",
     *     name="claro_claco_form_field_choices_categories_retrieve",
     *     options = {"expose"=true}
     * )
     *
     * Retrieves categories associated to choices from a field
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function fieldChoicesCategoriesRetrieveAction(Field $field)
    {
        $clacoForm = $field->getClacoForm();
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $fieldChoicesCategories = $this->clacoFormManager->getFieldChoicesCategoriesByField($field);
        $serializedFieldChoicesCategories = $this->serializer->serialize(
            $fieldChoicesCategories,
            'json',
            SerializationContext::create()->setGroups(['api_facet_admin'])
        );

        return new JsonResponse($serializedFieldChoicesCategories, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/category/create",
     *     name="claro_claco_form_category_create",
     *     options = {"expose"=true}
     * )
     *
     * Creates a category
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function categoryCreateAction(ClacoForm $clacoForm)
    {
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $categoryData = $this->request->request->get('categoryData', false);
        $notifyAddition = is_bool($categoryData['notifyAddition']) ?
            $categoryData['notifyAddition'] :
            $categoryData['notifyAddition'] === 'true';
        $notifyEdition = is_bool($categoryData['notifyEdition']) ?
            $categoryData['notifyEdition'] :
            $categoryData['notifyEdition'] === 'true';
        $notifyRemoval = is_bool($categoryData['notifyRemoval']) ?
            $categoryData['notifyRemoval'] :
            $categoryData['notifyRemoval'] === 'true';
        $notifyPendingComment = is_bool($categoryData['notifyPendingComment']) ?
            $categoryData['notifyPendingComment'] :
            $categoryData['notifyPendingComment'] === 'true';
        $managers = isset($categoryData['managers']) && count($categoryData['managers']) > 0 ?
            $this->userManager->getUsersByIds($categoryData['managers']) :
            [];
        $category = $this->clacoFormManager->createCategory(
            $clacoForm,
            $categoryData['name'],
            $managers,
            $categoryData['color'],
            $notifyAddition,
            $notifyEdition,
            $notifyRemoval,
            $notifyPendingComment
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
     *
     * Edits a category
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function categoryEditAction(Category $category)
    {
        $clacoForm = $category->getClacoForm();
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $categoryData = $this->request->request->get('categoryData', false);
        $notifyAddition = is_bool($categoryData['notifyAddition']) ?
            $categoryData['notifyAddition'] :
            $categoryData['notifyAddition'] === 'true';
        $notifyEdition = is_bool($categoryData['notifyEdition']) ?
            $categoryData['notifyEdition'] :
            $categoryData['notifyEdition'] === 'true';
        $notifyRemoval = is_bool($categoryData['notifyRemoval']) ?
            $categoryData['notifyRemoval'] :
            $categoryData['notifyRemoval'] === 'true';
        $notifyPendingComment = is_bool($categoryData['notifyPendingComment']) ?
            $categoryData['notifyPendingComment'] :
            $categoryData['notifyPendingComment'] === 'true';
        $managers = isset($categoryData['managers']) && count($categoryData['managers']) > 0 ?
            $this->userManager->getUsersByIds($categoryData['managers']) :
            [];
        $category = $this->clacoFormManager->editCategory(
            $category,
            $categoryData['name'],
            $managers,
            $categoryData['color'],
            $notifyAddition,
            $notifyEdition,
            $notifyRemoval,
            $notifyPendingComment
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
     *
     * Deletes a category
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function categoryDeleteAction(Category $category)
    {
        $clacoForm = $category->getClacoForm();
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $serializedCategory = $this->serializer->serialize(
            $category,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );
        $this->clacoFormManager->deleteCategory($category);

        return new JsonResponse($serializedCategory, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/keyword/create",
     *     name="claro_claco_form_keyword_create",
     *     options = {"expose"=true}
     * )
     *
     * Creates a keyword
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function keywordCreateAction(ClacoForm $clacoForm)
    {
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $keywordData = $this->request->request->get('keywordData', false);
        $keyword = $this->clacoFormManager->createKeyword($clacoForm, $keywordData['name']);
        $serializedKeyword = $this->serializer->serialize(
            $keyword,
            'json',
            SerializationContext::create()->setGroups(['api_claco_form'])
        );

        return new JsonResponse($serializedKeyword, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/keyword/{keyword}/edit",
     *     name="claro_claco_form_keyword_edit",
     *     options = {"expose"=true}
     * )
     *
     * Edits a keyword
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function keywordEditAction(Keyword $keyword)
    {
        $clacoForm = $keyword->getClacoForm();
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $keywordData = $this->request->request->get('keywordData', false);
        $this->clacoFormManager->editKeyword($keyword, $keywordData['name']);
        $serializedKeyword = $this->serializer->serialize(
            $keyword,
            'json',
            SerializationContext::create()->setGroups(['api_claco_form'])
        );

        return new JsonResponse($serializedKeyword, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/keyword/{keyword}/delete",
     *     name="claro_claco_form_keyword_delete",
     *     options = {"expose"=true}
     * )
     *
     * Deletes a keyword
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function keywordDeleteAction(Keyword $keyword)
    {
        $clacoForm = $keyword->getClacoForm();
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $serializedKeyword = $this->serializer->serialize(
            $keyword,
            'json',
            SerializationContext::create()->setGroups(['api_claco_form'])
        );
        $this->clacoFormManager->deleteKeyword($keyword);

        return new JsonResponse($serializedKeyword, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/keyword/get/by/name/{name}/excluding/id/{id}",
     *     name="claro_claco_form_get_keyword_by_name_excluding_id",
     *     options = {"expose"=true}
     * )
     *
     * Returns the keyword
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getKeywordByNameExcludingIdAction(ClacoForm $clacoForm, $name, $id = 0)
    {
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $keyword = $this->clacoFormManager->getKeywordByNameExcludingId($clacoForm, $name, $id);
        $serializedKeyword = $this->serializer->serialize(
            $keyword,
            'json',
            SerializationContext::create()->setGroups(['api_claco_form'])
        );

        return new JsonResponse($serializedKeyword, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/entry/random",
     *     name="claro_claco_form_entry_random",
     *     options = {"expose"=true}
     * )
     *
     * Returns id of a random entry
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entryRandomAction(ClacoForm $clacoForm)
    {
        $this->clacoFormManager->checkRight($clacoForm, 'OPEN');
        $entryId = $this->clacoFormManager->getRandomEntryId($clacoForm);

        return new JsonResponse($entryId, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/entries/list",
     *     name="claro_claco_form_entries_list",
     *     options = {"expose"=true}
     * )
     *
     * Returns the list of entries
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entriesListAction(ClacoForm $clacoForm)
    {
        $this->clacoFormManager->checkRight($clacoForm, 'OPEN');
        $currentUser = $this->tokenStorage->getToken()->getUser();
        $user = $currentUser === 'anon.' ? null : $currentUser;
        $entries = $this->clacoFormManager->getEntriesForUser($clacoForm, $user);
        $serializedEntries = $this->serializer->serialize(
            $entries,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedEntries, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/entry/create",
     *     name="claro_claco_form_entry_create",
     *     options = {"expose"=true}
     * )
     *
     * Creates an entry
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entryCreateAction(ClacoForm $clacoForm)
    {
        $this->clacoFormManager->checkRight($clacoForm, 'OPEN');
        $user = $this->tokenStorage->getToken()->getUser();
        $entryUser = $user === 'anon.' ? null : $user;
        $entryData = $this->request->request->get('entryData', false);
        $title = $this->request->request->get('titleData', false);
        $keywordsData = $this->request->request->get('keywordsData', false);

        if ($this->clacoFormManager->canCreateEntry($clacoForm, $entryUser)) {
            $entry = $this->clacoFormManager->createEntry($clacoForm, $entryData, $title, $keywordsData, $entryUser);
        } else {
            $entry = null;
        }
        $serializedEntry = $this->serializer->serialize(
            $entry,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedEntry, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/edit",
     *     name="claro_claco_form_entry_edit",
     *     options = {"expose"=true}
     * )
     *
     * Edits entry
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entryEditAction(Entry $entry)
    {
        $this->clacoFormManager->checkEntryEdition($entry);
        $entryData = $this->request->request->get('entryData', false);
        $title = $this->request->request->get('titleData', false);
        $categoriesIds = $this->request->request->get('categoriesData', false);
        $keywordsData = $this->request->request->get('keywordsData', false);
        $updatedEntry = $this->clacoFormManager->editEntry($entry, $entryData, $title, $categoriesIds, $keywordsData);
        $serializedEntry = $this->serializer->serialize(
            $updatedEntry,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedEntry, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/delete",
     *     name="claro_claco_form_entry_delete",
     *     options = {"expose"=true}
     * )
     *
     * Deletes an entry
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entryDeleteAction(Entry $entry)
    {
        $this->clacoFormManager->checkEntryEdition($entry);
        $serializedEntry = $this->serializer->serialize(
            $entry,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );
        $this->clacoFormManager->deleteEntry($entry);

        return new JsonResponse($serializedEntry, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/retrieve",
     *     name="claro_claco_form_entry_retrieve",
     *     options = {"expose"=true}
     * )
     *
     * Retrieves an entry
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entryRetrieveAction(Entry $entry)
    {
        $this->clacoFormManager->checkEntryAccess($entry);
        $serializedEntry = $this->serializer->serialize(
            $entry,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedEntry, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/status/change",
     *     name="claro_claco_form_entry_status_change",
     *     options = {"expose"=true}
     * )
     *
     * Changes status of an entry
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entryStatusChangeAction(Entry $entry)
    {
        $this->clacoFormManager->checkEntryModeration($entry);
        $updatedEntry = $this->clacoFormManager->changeEntryStatus($entry);
        $serializedEntry = $this->serializer->serialize(
            $updatedEntry,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedEntry, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/comments/retrieve",
     *     name="claro_claco_form_entry_comments_retrieve",
     *     options = {"expose"=true}
     * )
     *
     * Retrieves comments of an entry
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entryCommentsRetrieveAction(Entry $entry)
    {
        $this->clacoFormManager->checkEntryAccess($entry);
        $user = $this->tokenStorage->getToken()->getUser();

        if ($user === 'anon.') {
            $comments = $this->clacoFormManager->getCommentsByEntryAndStatus($entry, Comment::VALIDATED);
        } elseif ($this->clacoFormManager->hasEntryModerationRight($entry)) {
            $comments = $this->clacoFormManager->getCommentsByEntry($entry);
        } else {
            $comments = $this->clacoFormManager->getAvailableCommentsForUser($entry, $user);
        }
        $serializedComments = $this->serializer->serialize(
            $comments,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedComments, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/comment/create",
     *     name="claro_claco_form_entry_comment_create",
     *     options = {"expose"=true}
     * )
     *
     * Creates a comment
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function commentCreateAction(Entry $entry)
    {
        $this->clacoFormManager->checkCommentCreationRight($entry);
        $content = $this->request->request->get('commentData', false);
        $authenticatedUser = $this->tokenStorage->getToken()->getUser();
        $user = $authenticatedUser !== 'anon.' ? $authenticatedUser : null;
        $comment = $this->clacoFormManager->createComment($entry, $content, $user);
        $serializedComment = $this->serializer->serialize(
            $comment,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedComment, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/comment/{comment}/edit",
     *     name="claro_claco_form_entry_comment_edit",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Edits a comment
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function commentEditAction(Comment $comment)
    {
        $this->clacoFormManager->checkCommentEditionRight($comment);
        $content = $this->request->request->get('commentData', false);
        $comment = $this->clacoFormManager->editComment($comment, $content);
        $serializedComment = $this->serializer->serialize(
            $comment,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedComment, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/comment/{comment}/delete",
     *     name="claro_claco_form_entry_comment_delete",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Deletes a comment
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function commentDeleteAction(Comment $comment)
    {
        $this->clacoFormManager->checkCommentEditionRight($comment);
        $serializedComment = $this->serializer->serialize(
            $comment,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );
        $this->clacoFormManager->deleteComment($comment);

        return new JsonResponse($serializedComment, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/comment/{comment}/activate",
     *     name="claro_claco_form_entry_comment_activate",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Activates a comment
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function commentActivateAction(Comment $comment)
    {
        $this->clacoFormManager->checkEntryModeration($comment->getEntry());
        $comment = $this->clacoFormManager->changeCommentStatus($comment, Comment::VALIDATED);
        $serializedComment = $this->serializer->serialize(
            $comment,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedComment, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/comment/{comment}/block",
     *     name="claro_claco_form_entry_comment_block",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Blocks a comment
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function commentBlockAction(Comment $comment)
    {
        $this->clacoFormManager->checkEntryModeration($comment->getEntry());
        $comment = $this->clacoFormManager->changeCommentStatus($comment, Comment::BLOCKED);
        $serializedComment = $this->serializer->serialize(
            $comment,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );

        return new JsonResponse($serializedComment, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/user/retrieve",
     *     name="claro_claco_form_entry_user_retrieve",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Retrieves an entry options for current user
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entryUserRetrieveAction(User $user, Entry $entry)
    {
        $this->clacoFormManager->checkEntryAccess($entry);
        $entryUser = $this->clacoFormManager->getEntryUser($entry, $user);
        $serializedEntryUser = $this->serializer->serialize(
            $entryUser,
            'json',
            SerializationContext::create()->setGroups(['api_claco_form'])
        );

        return new JsonResponse($serializedEntryUser, 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/user/save",
     *     name="claro_claco_form_entry_user_save",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Saves entry options for current user
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entryUserSaveAction(User $user, Entry $entry)
    {
        $this->clacoFormManager->checkEntryAccess($entry);
        $entryUser = $this->clacoFormManager->getEntryUser($entry, $user);
        $entryUserData = $this->request->request->get('entryUserData', false);

        if (isset($entryUserData['shared'])) {
            $entryUser->setShared($entryUserData['shared']);
        }
        if (isset($entryUserData['notifyEdition'])) {
            $entryUser->setNotifyEdition($entryUserData['notifyEdition']);
        }
        if (isset($entryUserData['notifyComment'])) {
            $entryUser->setNotifyComment($entryUserData['notifyComment']);
        }
        if (isset($entryUserData['notifyVote'])) {
            $entryUser->setNotifyVote($entryUserData['notifyVote']);
        }
        $this->clacoFormManager->persistEntryUser($entryUser);

        return new JsonResponse('success', 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/pdf/download",
     *     name="claro_claco_form_entry_pdf_download",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Downloads pdf version of entry
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function entryPdfDownloadAction(User $user, Entry $entry)
    {
        $this->clacoFormManager->checkEntryAccess($entry);
        $pdf = $this->clacoFormManager->generatePdfForEntry($entry, $user);

        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$entry->getTitle().'.pdf"',
        ];

        return new Response(
            file_get_contents($this->filesDir.DIRECTORY_SEPARATOR.'pdf'.DIRECTORY_SEPARATOR.$pdf->getPath()),
            200,
            $headers
        );
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/shared/users/list",
     *     name="claro_claco_form_entry_shared_users_list",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * Retrieves list of users the entry is shared with
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entrySharedUsersListAction(User $user, Entry $entry)
    {
        $this->clacoFormManager->checkEntryShareRight($entry);
        $users = $this->clacoFormManager->getSharedEntryUsers($entry);
        $serializedUsers = $this->serializer->serialize(
            $users,
            'json',
            SerializationContext::create()->setGroups(['api_user_min'])
        );
        $whitelist = $this->userManager->getAllVisibleUsersIdsForUserPicker($user);

        return new JsonResponse(['users' => $serializedUsers, 'whitelist' => $whitelist], 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/users/share",
     *     name="claro_claco_form_entry_users_share",
     *     options = {"expose"=true}
     * )
     *
     * Shares entry ownership to users
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entryUsersShareAction(Entry $entry)
    {
        $this->clacoFormManager->checkEntryShareRight($entry);
        $usersIds = $this->request->request->get('usersIds', false);

        if ($usersIds) {
            $this->clacoFormManager->shareEntryWithUsers($entry, $usersIds);
        }

        return new JsonResponse('success', 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/entry/{entry}/user/{user}/unshare",
     *     name="claro_claco_form_entry_user_unshare",
     *     options = {"expose"=true}
     * )
     *
     * Shares entry ownership to users
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function entryUserUnshareAction(Entry $entry, User $user)
    {
        $this->clacoFormManager->checkEntryShareRight($entry);
        $this->clacoFormManager->switchEntryUserShared($entry, $user, false);

        return new JsonResponse('success', 200);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/entries/export",
     *     name="claro_claco_form_entries_export",
     *     options = {"expose"=true}
     * )
     *
     * Exports entries
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function clacoFormEntriesExportAction(ClacoForm $clacoForm)
    {
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $content = $this->clacoFormManager->exportEntries($clacoForm);
        $headers = [
            'Content-Transfer-Encoding' => 'octet-stream',
            'Content-Type' => 'application/vnd.ms-excel; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="'.$clacoForm->getResourceNode()->getName().'.xls"',
        ];

        return new Response($content, 200, $headers);
    }

    /**
     * @EXT\Route(
     *     "/claco/form/{clacoForm}/all/entries/delete",
     *     name="claro_claco_form_all_entries_delete",
     *     options={"expose"=true}
     * )
     *
     * Deletes all entries
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function clacoFormAllEntriesDeleteAction(ClacoForm $clacoForm)
    {
        $this->clacoFormManager->checkRight($clacoForm, 'EDIT');
        $this->clacoFormManager->deleteAllEntries($clacoForm);

        return new JsonResponse('success', 200);
    }
}
