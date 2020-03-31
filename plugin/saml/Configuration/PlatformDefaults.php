<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\SamlBundle\Configuration;

use Claroline\CoreBundle\Library\Configuration\ParameterProviderInterface;

class PlatformDefaults implements ParameterProviderInterface
{
    public function getDefaultParameters()
    {
        return [
            'external_authentication' => [
                'saml' => [
                    'active' => false,
                    'entity_id' => 'claroline', // the sp name
                    'credentials' => [
                        [
                            'certificate' => '%kernel.root_dir%/../saml.crt',
                            'key' => '%kernel.root_dir%/../saml.pem',
                            'password' => null,
                        ],
                    ], // the app certificates and secrets
                    'idp' => [], // the list of IDPs metadata files (either URL or local files are allowed)
                ]
            ],
        ];
    }
}
