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
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.claco_form_manager")
 */
class ClacoFormManager
{
    private $om;
    private $categoryRepo;

    /**
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
        $this->categoryRepo = $om->getRepository('ClarolineClacoFormBundle:Category');
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

    public function createCategory(
        ClacoForm $clacoForm,
        $name,
        $managers = [],
        $color = null,
        $notifyCreation = true,
        $notifyEdition = true,
        $notifyRemoval = true
    ) {
        $category = new Category();
        $category->setClacoForm($clacoForm);
        $category->setName($name);
        $category->setColor($color);
        $category->setNotifyAddition((bool)$notifyCreation);
        $category->setNotifyEdition((bool)$notifyEdition);
        $category->setNotifyRemoval((bool)$notifyRemoval);

        foreach ($managers as $manager) {
            $category->addManager($manager);
        }
        $this->om->persist($category);
        $this->om->flush();
    }

    public function persistCategory(Category $category)
    {
        $this->om->persist($category);
        $this->om->flush();
    }

    public function deleteCategory(Category $category)
    {
        $this->om->remove($category);
        $this->om->flush();
    }

    public function deleteCategories(array $categories)
    {
        $this->om->startFlushSuite();

        foreach ($categories as $category) {
            $this->deleteCategory($category);
        }
        $this->om->endFlushSuite();
    }


    /****************************************
     * Access to CategoryRepository methods *
     ****************************************/

    public function getCategoriesByClacoForm(ClacoForm $clacoForm)
    {
        return $this->categoryRepo->findBy(['clacoForm' => $clacoForm], ['name' => 'ASC']);
    }
}
