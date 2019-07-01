<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SchemaProvider;
use Claroline\CoreBundle\API\Serializer\Platform\ClientSerializer;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @Route("/swagger")
 */
class SwaggerController
{
    /**
     * ParametersController constructor.
     *
     * @DI\InjectParams({
     *     "routerFinder"   = @DI\Inject("claroline.api.routing.finder"),
     *     "documentator"   = @DI\Inject("claroline.api.routing.documentator"),
     *     "schemaProvider" = @DI\Inject("claroline.api.schema"),
     *     "configuration"  = @DI\Inject("claroline.serializer.platform_client")
     * })
     */
    public function __construct($routerFinder, $documentator, SchemaProvider $schemaProvider, ClientSerializer $configuration)
    {
        $this->routerFinder = $routerFinder;
        $this->documentator = $documentator;
        $this->schemaProvider = $schemaProvider;
        $this->configuration = $configuration;
    }

    /**
     * @Route("", name="apiv2_swagger_get")
     * @Method("GET")
     */
    public function getApiAction()
    {
        $config = $this->configuration->serialize();

        $swagger = [
          'swagger' => '2.0',
          'info' => [
              'version' => 'v2',
              'title' => 'Claroline API',
              'description' => 'Claroline API',
              'termsOfService' => 'None',
              'contact' => [
                  'name' => 'Claroline',
                  'url' => 'www.claroline.net',
                  'email' => 'claroline@ovh.com',
              ],
              'license' => [
                  'name' => 'GPL-3.0-or-later',
                  'url' => 'https://www.gnu.org/licenses/gpl-3.0.fr.html',
              ],
          ],
          'basePath' => $config['swagger']['base'],
        ];

        $classes = $this->routerFinder->getHandledClasses();

        $data = new \StdClass();

        foreach ($classes as $class) {
            $data = (object) array_merge((array) $data, $this->documentator->documentClass($class));
        }

        $definitions = [];

        foreach ($classes as $class) {
            $def = json_decode(json_encode($this->schemaProvider->getSchema($class, [Options::IGNORE_COLLECTIONS])), true);
            //we need to mode, return and submit

            if (is_array($def)) {
                $definitions[$class]['post'] = $def;
            }
        }

        $swagger['paths'] = $data;
        $swagger['definitions'] = $definitions;

        return new JsonResponse($swagger);
    }
}
