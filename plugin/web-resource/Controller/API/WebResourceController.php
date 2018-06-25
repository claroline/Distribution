<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\WebResourceBundle\Controller\API;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\WebResourceBundle\Manager\WebResourceManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


class WebResourceController extends AbstractCrudController
{

    private $resourceManager;
    private $webResourceManager;

    /**
     * @DI\InjectParams({
     *     "resourceManager" = @DI\Inject("claroline.manager.resource_manager"),
     *     "webResourceManager"    = @DI\Inject("claroline.manager.web_resource_manager"),
     * })
     */
    public function __construct(
        ResourceManager $resourceManager,
        WebResourceManager $webResourceManager
    ) {
        $this->resourceManager = $resourceManager;
        $this->webResourceManager = $webResourceManager;
    }
      public function getName()
      {
          return 'web-resource';
      }

    /**
     * @EXT\Route(
     *    "{workspace}/webResource/file/upload",
     *    name="apiv2_webresource_file_upload",
     *    options={ "method_prefix" = false }
     * )
     *
     * @EXT\ParamConverter(
     *     "workspace",
     *     class="ClarolineCoreBundle:Workspace\Workspace",
     *     options={"mapping": {"workspace": "uuid"}}
     * )
     *
     * @param Request   $request
     *
     * @return JsonResponse
     */
    public function uploadFile(Workspace $workspace, Request $request)
    {
        $files = $request->files->all();
        $data = [];

        foreach ($files as $file) {
            $isZip = $this->webResourceManager->isZip($file, $workspace);
            if(!$isZip) {
              return new JsonResponse('not a valid file', 400);
            } else {
              $data = $this->webResourceManager->create($file);
              return new JsonResponse($data, 200);
            }
        }


    }
}
