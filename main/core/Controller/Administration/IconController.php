<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 1/17/17
 */

namespace Claroline\CoreBundle\Controller\Administration;

use Claroline\CoreBundle\Entity\Icon\IconSetTypeEnum;
use Claroline\CoreBundle\Form\Administration\IconSetType;
use Claroline\CoreBundle\Manager\IconSetManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @DI\Tag("security.secure_service")
 * @SEC\PreAuthorize("canOpenAdminTool('platform_parameters')")
 */
class IconController extends Controller
{
    /**
     * @var IconSetManager
     */
    private $iconSetManager;

    /**
     * ResourceIconController constructor.
     *
     * @DI\InjectParams({
     *     "iconSetManager" = @DI\Inject("claroline.manager.icon_set_manager")
     * })
     *
     * @param IconSetManager $iconSetManager
     */
    public function __construct(IconSetManager $iconSetManager)
    {
        $this->iconSetManager = $iconSetManager;
    }

    /**
     * @EXT\Route("/set/resource/list", name="claro_admin_resource_icon_set_list")
     * @EXT\Template
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function resourceIconSetListAction()
    {
        $iconSets = $this->iconSetManager->listIconSetsByType(IconSetTypeEnum::RESOURCE_ICON_SET);
        $isReadOnly = !$this->iconSetManager->isIconSetsDirWritable();

        return [
            'isReadOnly' => $isReadOnly,
            'iconSets' => $iconSets,
        ];
    }

    /**
     * @EXT\Route("/set/resource/new", name="claro_admin_resource_icon_set_new")
     * @EXT\Template
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function resourceIconSetNewAction()
    {
        $form = $this->createForm(new IconSetType());
        $iconNamesForTypes = $this->iconSetManager->getResourceIconSetIconNamesForMimeTypes();
        $shortcutIcon = $this->iconSetManager->getResourceIconSetStampIcon();
        $iconNamesForTypes->prependShortcutIcon($shortcutIcon);

        return [
            'form' => $form->createView(),
            'iconNamesForTypes' => $iconNamesForTypes,
        ];
    }

    /**
     * @EXT\Route("/set/resource/edit/{id}",
     *     options={"expose"=true},
     *     requirements={"id" = "\d+"},
     *     name="claro_admin_resource_icon_set_edit"
     * )
     * @EXT\Template
     *
     * @param $id
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function resourceIconSetEditAction($id)
    {
        $iconSet = $this->iconSetManager->getIconSetById($id);
        $form = $this->createForm(new IconSetType(), $iconSet);
        $iconNamesForTypes = $this->iconSetManager->getIconSetIconsByType($iconSet);
        $shortcutIcon = $this->iconSetManager->getResourceIconSetStampIcon();
        $iconNamesForTypes->prependShortcutIcon($shortcutIcon, empty($iconSet->getResourceStampIcon()));

        return [
            'form' => $form->createView(),
            'iconSet' => $iconSet,
            'iconNamesForTypes' => $iconNamesForTypes,
        ];
    }

    /**
     * @EXT\Route("/set/resource/create", defaults={"id" = null}, name="claro_admin_resource_icon_set_create")
     * @EXT\Route("/set/resource/update/{id}", requirements={"id" = "\d+"}, name="claro_admin_resource_icon_set_update")
     * @EXT\Method({"POST"})
     * @EXT\Template(vars={"id"})
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function resourceIconSetCreateUpdateAction($id, Request $request)
    {
        $isNew = $id === null;
        $iconSet = $this->iconSetManager->getIconSetById($id);
        $iconNamesForTypes = $this->iconSetManager->getIconSetIconsByType($iconSet);
        $form = $this->createForm(new IconSetType(), $iconSet);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $iconSet = $form->getData();
            $iconSet->setType(IconSetTypeEnum::RESOURCE_ICON_SET);
            if ($isNew) {
                $this->iconSetManager->createNewResourceIconSet($iconSet, $iconNamesForTypes);
                $this->addFlash('success', 'icon_set_created_successfully');
            } else {
                $this->iconSetManager->updateResourceIconSet($iconSet, $iconNamesForTypes);
                $this->addFlash('success', 'icon_set_updated_successfully');
            }

            return $this->redirectToRoute('claro_admin_resource_icon_set_list');
        }

        if ($isNew) {
            return $this->render('ClarolineCoreBundle:Administration/Icon/resourceIconSetNew.html.twig', [
                'form' => $form->createView(),
                'iconNamesForTypes' => $iconNamesForTypes['default'],
            ]);
        } else {
            return $this->render('ClarolineCoreBundle:Administration/Icon/resourceIconSetEdit.html.twig', [
                'form' => $form->createView(),
                'iconNamesForTypes' => $iconNamesForTypes,
                'iconSet' => $iconSet,
            ]);
        }
    }

    /**
     * @EXT\Route("/set/delete/{id}",
     *     options={"expose"=true},
     *     requirements={"id" = "\d+"},
     *     name="claro_admin_icon_set_delete"
     * )
     * @EXT\Method({"GET", "DELETE"})
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function iconSetDeleteAction($id)
    {
        $iconSet = $this->iconSetManager->getIconSetById($id);
        if ($iconSet !== null) {
            $this->iconSetManager->deleteIconSet($iconSet);
        }

        return new JsonResponse(['deleted' => true]);
    }
}
