<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AuthenticationBundle\Library;

use Claroline\AuthenticationBundle\Model\Oauth\OauthConfiguration;
use Claroline\CoreBundle\Library\Configuration\LegacyParametersMappingInterface;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.configuration.mapping.legacy")
 */
class LegacyParametersMapping implements LegacyParametersMappingInterface
{
    public function getMapping()
    {
        $parameters = [];

        foreach (OauthConfiguration::resourceOwners() as $resourceOwner) {
            $resourceOwnerStr = str_replace(' ', '_', strtolower($resourceOwner));
            $parameters[$resourceOwnerStr.'_client_id'] = 'external_authentication.'.$resourceOwnerStr.'.client_id';
            $parameters[$resourceOwnerStr.'_client_secret'] = 'external_authentication.'.$resourceOwnerStr.'.client_secret';
            $parameters[$resourceOwnerStr.'_client_active'] = 'external_authentication.'.$resourceOwnerStr.'.client_active';
        }

        return $parameters;
    }
}
