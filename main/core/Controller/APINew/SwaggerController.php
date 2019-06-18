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
     *     "routerFinder" = @DI\Inject("claroline.api.routing.finder"),
     *     "documentator" = @DI\Inject("claroline.api.routing.documentator"),
     * })
     */
    public function __construct($routerFinder, $documentator)
    {
        $this->routerFinder = $routerFinder;
        $this->documentator = $documentator;
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

        /*
                foreach ($classes as $class) {
                    $data[$class] = $this->documentator->documentClass($class);
                }
        */

        $data = (object) array_merge((array) $data, $this->documentator->documentClass($classes[4]));

        //$data[] = $this->documentator->documentClass($classes[4]);
        $swagger['paths'] = $data;
        //$swagger['paths'] = $this->getExample()['paths'];

        return new JsonResponse($swagger);
    }

    public function getExample()
    {
        return array(
  'swagger' => '2.0',
  'info' => array(
    'version' => 'v2',
    'title' => 'SwaggerDemo API',
    'description' => 'Customers API to demo Swagger',
    'termsOfService' => 'None',
    'contact' => array(
      'name' => 'Hinault Romaric',
      'url' => 'http://rdonfack.developpez.com/',
      'email' => 'hinault@monsite.com',
    ),
    'license' => array(
      'name' => 'Apache 2.0',
      'url' => 'http://www.apache.org',
    ),
  ),
  'basePath' => '/',
  'paths' => array(
    '/api/Customers/{id}' => array(
      'get' => array(
        'tags' => array(
          0 => 'Customers',
        ),
        'summary' => 'Retourne un client spécifique à partir de son id',
        'description' => 'Je manque d\'imagination',
        'operationId' => 'ApiCustomersByIdGet',
        'consumes' => array(
        ),
        'produces' => array(
          0 => 'application/json',
        ),
        'parameters' => array(
          0 => array(
            'name' => 'id',
            'in' => 'path',
            'description' => 'id du client à retourner',
            'required' => true,
            'type' => 'integer',
            'format' => 'int32',
          ),
        ),
        'responses' => array(
          200 => array(
            'description' => 'client sélectionné',
            'schema' => array(
              '$ref' => '#/definitions/Customer',
            ),
          ),
        ),
      ),
    ),
  ),
  'definitions' => array(
    'Customer' => array(
      'type' => 'object',
      'properties' => array(
        'id' => array(
          'format' => 'int32',
          'type' => 'integer',
        ),
        'firstName' => array(
          'type' => 'string',
        ),
        'lastName' => array(
          'type' => 'string',
        ),
        'eMail' => array(
          'type' => 'string',
        ),
      ),
    ),
  ),
);
    }
}
