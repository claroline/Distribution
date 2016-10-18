<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Twig;

use Claroline\CoreBundle\Manager\PluginManager;
use JMS\DiExtraBundle\Annotation\Inject;
use JMS\DiExtraBundle\Annotation\InjectParams;
use JMS\DiExtraBundle\Annotation\Service;
use JMS\DiExtraBundle\Annotation\Tag;

/**
 * @Service
 * @Tag("twig.extension")
 */
class PluginExtension extends \Twig_Extension
{
    protected $pluginManager;

    /**
     * @InjectParams({
     *     "pluginManager" = @Inject("claroline.manager.plugin_manager")
     * })
     */
    public function __construct(PluginManager $pluginManager)
    {
        $this->pluginManager = $pluginManager;
    }

    public function getFunctions()
    {
        return [
            'get_current_distribution_commit' => new \Twig_Function_Method($this, 'getCurrentDistributionCommit'),
        ];
    }

    public function getName()
    {
        return 'plugin_extension';
    }

    public function getCurrentDistributionCommit()
    {
        return $this->pluginManager->getCurrentDistributionCommit();
    }

    public function getCurrentUrl()
    {
        return '';
    }
}
