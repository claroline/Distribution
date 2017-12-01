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
use Claroline\CoreBundle\API\Options;
use Claroline\CoreBundle\Controller\APINew\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * @ApiMeta(class="Claroline\CoreBundle\Entity\Facet\Facet")
 * @Route("facet")
 */
class FacetController extends AbstractCrudController
{
    public function getName()
    {
        return 'facet';
    }

    public function getOptions()
    {
        $list = [Options::PROFILE_SERIALIZE];
        $create = [Options::DEEP_SERIALIZE];
        $update = [Options::DEEP_SERIALIZE];

        return [
            'list' => $list,
            'create' => $create,
            'update' => $update,
        ];
    }
}
