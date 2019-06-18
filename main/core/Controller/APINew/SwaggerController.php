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

use Claroline\AppBundle\API\SchemaProvider;
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
     * })
     */
    public function __construct($routerFinder, $documentator, SchemaProvider $schemaProvider)
    {
        $this->routerFinder = $routerFinder;
        $this->documentator = $documentator;
        $this->schemaProvider = $schemaProvider;
    }

    /**
     * @Route("", name="apiv2_swagger_get")
     * @Method("GET")
     */
    public function getApiAction()
    {
        $swagger = [
          'swagger' => '2.0',
          'info' => [
              'version' => 'v2',
              'title' => 'SwaggerDemo API',
              'description' => 'Customers API to demo Swagger',
              'termsOfService' => 'None',
              'contact' => [
                  'name' => 'Jean Guillaume',
                  'url' => 'Jean Guillaume 42',
                  'email' => 'Guillaume @monsite.com',
              ],
              'license' => [
                  'name' => 'Apache 2.0',
                  'url' => 'http://www.apache.org',
              ],
          ],
          'basePath' => '/',
        ];

        $classes = $this->routerFinder->getHandledClasses();

        $data = new \StdClass();

        foreach ($classes as $class) {
            $data = (object) array_merge((array) $data, $this->documentator->documentClass($class));
        }

        $definitions = [];

        foreach ($classes as $class) {
            $def = json_decode(json_encode($this->schemaProvider->getSchema($class)), true);
            if (is_array($def)) {
                $definitions[$class] = $def;
            }
        }

        $swagger['paths'] = $data;
        $swagger['definitions'] = $definitions;

        return new JsonResponse($swagger);
    }
}
