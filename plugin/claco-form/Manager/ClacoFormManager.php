<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ClacoFormBundle\Manager;

use Claroline\ClacoFormBundle\Entity\Category;
use Claroline\ClacoFormBundle\Entity\ClacoForm;
use Claroline\ClacoFormBundle\Entity\Field;
use Claroline\ClacoFormBundle\Entity\Keyword;
use Claroline\ClacoFormBundle\Event\Log\LogCategoryCreateEvent;
use Claroline\ClacoFormBundle\Event\Log\LogCategoryDeleteEvent;
use Claroline\ClacoFormBundle\Event\Log\LogCategoryEditEvent;
use Claroline\ClacoFormBundle\Event\Log\LogClacoFormConfigureEvent;
use Claroline\ClacoFormBundle\Event\Log\LogClacoFormTemplateEditEvent;
use Claroline\ClacoFormBundle\Event\Log\LogFieldCreateEvent;
use Claroline\ClacoFormBundle\Event\Log\LogFieldDeleteEvent;
use Claroline\ClacoFormBundle\Event\Log\LogFieldEditEvent;
use Claroline\ClacoFormBundle\Event\Log\LogKeywordCreateEvent;
use Claroline\ClacoFormBundle\Event\Log\LogKeywordDeleteEvent;
use Claroline\ClacoFormBundle\Event\Log\LogKeywordEditEvent;
use Claroline\CoreBundle\Manager\FacetManager;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * @DI\Service("claroline.manager.claco_form_manager")
 */
class ClacoFormManager
{
    private $eventDispatcher;
    private $facetManager;
    private $om;

    private $categoryRepo;
    private $fieldRepo;
    private $keywordRepo;

    /**
     * @DI\InjectParams({
     *     "eventDispatcher" = @DI\Inject("event_dispatcher"),
     *     "facetManager"    = @DI\Inject("claroline.manager.facet_manager"),
     *     "om"              = @DI\Inject("claroline.persistence.object_manager")
     * })
     */
    public function __construct(EventDispatcherInterface $eventDispatcher, FacetManager $facetManager, ObjectManager $om)
    {
        $this->eventDispatcher = $eventDispatcher;
        $this->facetManager = $facetManager;
        $this->om = $om;
        $this->categoryRepo = $om->getRepository('ClarolineClacoFormBundle:Category');
        $this->fieldRepo = $om->getRepository('ClarolineClacoFormBundle:Field');
        $this->keywordRepo = $om->getRepository('ClarolineClacoFormBundle:Keyword');
    }

    public function initializeClacoForm(ClacoForm $clacoForm)
    {
        $clacoForm->setMaxEntries(0);
        $clacoForm->setCreationEnabled(true);
        $clacoForm->setEditionEnabled(true);
        $clacoForm->setModerated(false);

        $clacoForm->setDefaultHome('menu');
        $clacoForm->setDisplayNbEntries('none');
        $clacoForm->setMenuPosition('down');

        $clacoForm->setRandomEnabled(false);
        $clacoForm->setRandomCategories([]);
        $clacoForm->setRandomStartDate(null);
        $clacoForm->setRandomEndDate(null);

        $clacoForm->setSearchEnabled('all');
        $clacoForm->setSearchColumnEnabled(false);

        $clacoForm->setDisplayMetadata('none');

        $clacoForm->setDisplayCategories(false);
        $clacoForm->setOpenCategories(false);

        $clacoForm->setCommentsEnabled(false);
        $clacoForm->setAnonymousCommentsEnabled(false);
        $clacoForm->setModerateComments('none');
        $clacoForm->setDisplayComments(false);
        $clacoForm->setOpenComments(false);
        $clacoForm->setDisplayCommentAuthor(true);
        $clacoForm->setDisplayCommentDate(true);

        $clacoForm->setVotesEnabled(false);
        $clacoForm->setDisplayVotes(false);
        $clacoForm->setOpenVotes(false);
        $clacoForm->setVotesStartDate(null);
        $clacoForm->setVotesEndDate(null);

        $clacoForm->setKeywordsEnabled(false);
        $clacoForm->setNewKeywordsEnabled(false);
        $clacoForm->setDisplayKeywords(false);
        $clacoForm->setOpenKeywords(false);

        return $clacoForm;
    }

    public function persistClacoForm(ClacoForm $clacoForm)
    {
        $this->om->persist($clacoForm);
        $this->om->flush();
    }

    public function copyClacoForm(ClacoForm $clacoForm)
    {
        $newClacoForm = new ClacoForm();
        $newClacoForm->setName($clacoForm->getName());
        $newClacoForm->setTemplate($clacoForm->getTemplate());
        $this->om->persist($newClacoForm);

        return $newClacoForm;

    }

    public function saveClacoFormConfig(ClacoForm $clacoForm, array $configData)
    {
        $clacoForm->setDetails($configData);
        $randomStartDate = isset($configData['random_start_date']) ? new \DateTime($configData['random_start_date']) : null;
        $randomEndDate = isset($configData['random_end_date']) ? new \DateTime($configData['random_end_date']) : null;
        $votesStartDate = isset($configData['votes_start_date']) ? new \DateTime($configData['votes_start_date']) : null;
        $votesEndDate = isset($configData['votes_end_date']) ? new \DateTime($configData['votes_end_date']) : null;
        $clacoForm->setRandomStartDate($randomStartDate);
        $clacoForm->setRandomEndDate($randomEndDate);
        $clacoForm->setVotesStartDate($votesStartDate);
        $clacoForm->setVotesEndDate($votesEndDate);
        $this->persistClacoForm($clacoForm);
        $details = $clacoForm->getDetails();
        $event = new LogClacoFormConfigureEvent($clacoForm, $details);
        $this->eventDispatcher->dispatch('log', $event);

        return $details;
    }

    public function saveClacoFormTemplate(ClacoForm $clacoForm, $template)
    {
        $clacoFormTemplate = empty($template) ? null : $template;
        $clacoForm->setTemplate($clacoFormTemplate);
        $this->persistClacoForm($clacoForm);
        $event = new LogClacoFormTemplateEditEvent($clacoForm, $clacoFormTemplate);
        $this->eventDispatcher->dispatch('log', $event);

        return $clacoFormTemplate;
    }

    public function persistCategory(Category $category)
    {
        $this->om->persist($category);
        $this->om->flush();
    }

    public function createCategory(
        ClacoForm $clacoForm,
        $name,
        array $managers = [],
        $color = null,
        $notifyAddition = true,
        $notifyEdition = true,
        $notifyRemoval = true
    ) {
        $category = new Category();
        $category->setClacoForm($clacoForm);
        $category->setName($name);
        $category->setColor($color);
        $category->setNotifyAddition($notifyAddition);
        $category->setNotifyEdition($notifyEdition);
        $category->setNotifyRemoval($notifyRemoval);

        foreach ($managers as $manager) {
            $category->addManager($manager);
        }
        $this->persistCategory($category);
        $event = new LogCategoryCreateEvent($category);
        $this->eventDispatcher->dispatch('log', $event);

        return $category;
    }

    public function editCategory(
        Category $category,
        $name,
        array $managers = [],
        $color = null,
        $notifyAddition = true,
        $notifyEdition = true,
        $notifyRemoval = true
    ) {
        $category->setName($name);
        $category->setColor($color);
        $category->setNotifyAddition($notifyAddition);
        $category->setNotifyEdition($notifyEdition);
        $category->setNotifyRemoval($notifyRemoval);
        $category->emptyManagers();

        foreach ($managers as $manager) {
            $category->addManager($manager);
        }
        $this->persistCategory($category);
        $event = new LogCategoryEditEvent($category);
        $this->eventDispatcher->dispatch('log', $event);

        return $category;
    }

    public function deleteCategory(Category $category)
    {
        $clacoForm = $category->getClacoForm();
        $resourceNode = $clacoForm->getResourceNode();
        $managers = $category->getManagers();
        $details = [];
        $details['id'] = $category->getId();
        $details['name'] = $category->getName();
        $details['details'] = $category->getDetails();
        $details['resourceId'] = $clacoForm->getId();
        $details['resourceNodeId'] = $resourceNode->getId();
        $details['resourceName'] = $resourceNode->getName();
        $details['managers'] = [];

        foreach ($managers as $manager) {
            $details['managers'][] = [
                'id' => $manager->getId(),
                'username' => $manager->getUsername(),
                'firstName' => $manager->getFirstName(),
                'lastName' => $manager->getLastName()
            ];
        }
        $this->om->remove($category);
        $this->om->flush();
        $event = new LogCategoryDeleteEvent($details);
        $this->eventDispatcher->dispatch('log', $event);
    }

    public function deleteCategories(array $categories)
    {
        $this->om->startFlushSuite();

        foreach ($categories as $category) {
            $this->deleteCategory($category);
        }
        $this->om->endFlushSuite();
    }

    public function persistField(Field $field)
    {
        $this->om->persist($field);
        $this->om->flush();
    }

    public function createField(ClacoForm $clacoForm, $name, $type, $required = true, $searchable = true, $isMetadata = false)
    {
        $this->om->startFlushSuite();
        $field = new Field();
        $field->setClacoForm($clacoForm);
        $field->setName($name);
        $field->setType($type);
        $field->setRequired($required);
        $field->setSearchable($searchable);
        $field->setIsMetadata($isMetadata);
        $fieldFacet = $this->facetManager->createField($name, $required, $type, true, $clacoForm->getResourceNode());
        $field->setFieldFacet($fieldFacet);
        $this->persistField($field);
        $this->om->endFlushSuite();
        $event = new LogFieldCreateEvent($field);
        $this->eventDispatcher->dispatch('log', $event);

        return $field;
    }

    public function editField(Field $field, $name, $type, $required = true, $searchable = true, $isMetadata = false)
    {
        $field->setName($name);
        $field->setType($type);
        $field->setRequired($required);
        $field->setSearchable($searchable);
        $field->setIsMetadata($isMetadata);
        $this->persistField($field);
        $event = new LogFieldEditEvent($field);
        $this->eventDispatcher->dispatch('log', $event);

        return $field;
    }

    public function deleteField(Field $field)
    {
        $clacoForm = $field->getClacoForm();
        $resourceNode = $clacoForm->getResourceNode();
        $details = [];
        $details['id'] = $field->getId();
        $details['type'] = $field->getType();
        $details['name'] = $field->getName();
        $details['required'] = $field->isRequired();
        $details['searchable'] = $field->isSearchable();
        $details['isMetadata'] = $field->getIsMetadata();
        $details['resourceId'] = $clacoForm->getId();
        $details['resourceNodeId'] = $resourceNode->getId();
        $details['resourceName'] = $resourceNode->getName();
        $this->om->startFlushSuite();
        $fieldFacet = $field->getFieldFacet();

        if (!is_null($fieldFacet)) {
            $this->om->remove($fieldFacet);
        }
        $this->om->remove($field);
        $this->om->endFlushSuite();
        $event = new LogFieldDeleteEvent($details);
        $this->eventDispatcher->dispatch('log', $event);
    }

    public function persistKeyword(Keyword $keyword)
    {
        $this->om->persist($keyword);
        $this->om->flush();
    }

    public function createKeyword(ClacoForm $clacoForm, $name)
    {
        $keyword = new Keyword();
        $keyword->setClacoForm($clacoForm);
        $keyword->setName($name);
        $this->persistKeyword($keyword);
        $event = new LogKeywordCreateEvent($keyword);
        $this->eventDispatcher->dispatch('log', $event);

        return $keyword;
    }

    public function editKeyword(Keyword $keyword, $name)
    {
        $keyword->setName($name);
        $this->persistKeyword($keyword);
        $event = new LogKeywordEditEvent($keyword);
        $this->eventDispatcher->dispatch('log', $event);

        return $keyword;
    }

    public function deleteKeyword(Keyword $keyword)
    {
        $clacoForm = $keyword->getClacoForm();
        $resourceNode = $clacoForm->getResourceNode();
        $details = [];
        $details['id'] = $keyword->getId();
        $details['name'] = $keyword->getName();
        $details['resourceId'] = $clacoForm->getId();
        $details['resourceNodeId'] = $resourceNode->getId();
        $details['resourceName'] = $resourceNode->getName();
        $this->om->remove($keyword);
        $this->om->flush();
        $event = new LogKeywordDeleteEvent($details);
        $this->eventDispatcher->dispatch('log', $event);
    }

    /****************************************
     * Access to CategoryRepository methods *
     ****************************************/

    public function getCategoriesByClacoForm(ClacoForm $clacoForm)
    {
        return $this->categoryRepo->findBy(['clacoForm' => $clacoForm], ['name' => 'ASC']);
    }

    /*************************************
     * Access to FieldRepository methods *
     *************************************/

    public function getFieldByNameExcludingId(ClacoForm $clacoForm, $name, $id)
    {
        return $this->fieldRepo->findFieldByNameExcludingId($clacoForm, $name, $id);
    }

    /***************************************
     * Access to KeywordRepository methods *
     ***************************************/

    public function getKeywordByNameExcludingId(ClacoForm $clacoForm, $name, $id)
    {
        return $this->keywordRepo->findKeywordByNameExcludingId($clacoForm, $name, $id);
    }
}
