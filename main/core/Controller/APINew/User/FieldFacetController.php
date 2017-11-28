<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew\User;

use Claroline\CoreBundle\Annotations\ApiMeta;
use Claroline\CoreBundle\Controller\APINew\AbstractCrudController;
use Claroline\CoreBundle\Controller\APINew\Model\HasOrganizationsTrait;
use Claroline\CoreBundle\Controller\APINew\Model\HasRolesTrait;
use Claroline\CoreBundle\Controller\APINew\Model\HasUsersTrait;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Claroline\CoreBundle\API\Options;

/**
 * @ApiMeta(class="Claroline\CoreBundle\Entity\Facet\FieldFacet")
 * @Route("fieldfacet")
 */
class FieldFacetController extends AbstractCrudController
{
    public function getName()
    {
        return 'fieldfacet';
    }

    public function getOptions()
    {
        $list = [Options::PROFILE_SERIALIZE];

        return [
            'list' => $list
        ];
    }
}
