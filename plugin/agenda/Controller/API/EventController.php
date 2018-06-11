<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AgendaBundle\Controller\API;

use Claroline\AppBundle\Annotations\ApiMeta;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * @ApiMeta(class="Claroline\AgendaBundle\Entity\Event")
 * @Route("/event")
 */
class EventController extends AbstractCrudController
{
    public function getName()
    {
        return 'event';
    }

    /**
     * tweaked for fullcalendar.
     *
     *
     * @param Request $request
     * @param string  $class
     *
     * @return JsonResponse
     */
    public function listAction(Request $request, $class)
    {
        $query = $request->query->all();
        $hiddenFilters = isset($query['hiddenFilters']) ? $query['hiddenFilters'] : [];
        $query['hiddenFilters'] = array_merge($hiddenFilters, $this->getDefaultHiddenFilters());

        $data = $this->finder->search(
            $class,
            $query,
            $this->options['list']
        );

        return new JsonResponse($data['data']);
    }

    /**
     * @EXT\Route(
     *     "/download",
     *     name="apiv2_download_agenda"
     * )
     * @EXT\Method("GET")
     *
     * @param Workspace $workspace
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function exportAction(Request $request)
    {
        $id = $request->query->get('workspace');
        $file = $this->container->get('claroline.manager.agenda_manager')->export($id);

        $response = new StreamedResponse();

        $response->setCallBack(
          function () use ($file) {
              readfile($file);
          }
        );

        $workspace = $this->om->getRepository('ClarolineCoreBundle:Workspace\Workspace')->find($id);
        $name = $workspace ? $workspace->getName() : 'desktop';
        $response->headers->set('Content-Transfer-Encoding', 'octet-stream');
        $response->headers->set('Content-Type', 'application/force-download');
        $response->headers->set('Content-Disposition', 'attachment; filename='.$name.'.ics');
        $response->headers->set('Content-Type', ' text/calendar');
        $response->headers->set('Connection', 'close');

        return $response;
    }
}
