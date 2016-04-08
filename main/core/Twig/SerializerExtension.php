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

use JMS\DiExtraBundle\Annotation\Inject;
use JMS\DiExtraBundle\Annotation\InjectParams;
use JMS\DiExtraBundle\Annotation\Service;
use JMS\DiExtraBundle\Annotation\Tag;
use JMS\Serializer\SerializationContext;

/**
 * @Service
 * @Tag("twig.extension")
 */
class SerializerExtension extends \Twig_Extension
{
    protected $container;

    /**
     * @InjectParams({
     *     "container" = @Inject("service_container")
     * })
     */
    public function __construct($container)
    {
        $this->container = $container;
    }

    public function getFilters()
    {
        return array(
            'serialize' => new \Twig_Filter_Method($this, 'serialize'),
        );
    }

    public function getName()
    {
        return 'serializer_extension';
    }

    public function serialize($data, $group)
    {
        return $this->doSerialize($data, $group);
    }

    public function doSerialize($data, $group)
    {
        $context = new SerializationContext();
        $context->setGroups($group);

        return $this->container->get('serializer')->serialize($data, 'json', $context);
    }
} 
