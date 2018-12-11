<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\RssBundle\Controller;

use Claroline\AppBundle\Annotations\ApiMeta;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @ApiMeta(class="Claroline\RssBundle\Entity\Resource\RssFeed")
 * @EXT\Route("/rss_feed")
 */
class RssFeedController extends AbstractCrudController
{
    public function getName()
    {
        return 'rss_feed';
    }
}
