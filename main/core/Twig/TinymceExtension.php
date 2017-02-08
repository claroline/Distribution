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

use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service
 * @DI\Tag("twig.extension")
 */
class TinymceExtension extends \Twig_Extension
{
    /**
     * Get filters of the service.
     *
     * @return \Twig_Filter_Method
     */
    public function getFilters()
    {
        return [
            'mapTinymceLocale' => new \Twig_Filter_Method($this, 'mapTinymceLocale'),
        ];
    }

    /**
     * Get the elapsed time since $start to right now, with a transChoice() for translation in plural or singular.
     *
     * @param \DateTime $start The initial time
     *
     * @return \String
     *
     *                 @see Symfony\Component\Translation\Translator
     */
    public function mapTinymceLocale($name)
    {
        $locales = [
            'fr' => 'fr_FR',
            'en' => 'en_GB',
        ];

        if (array_key_exists($name, $locales)) {
            return $locales[$name];
        }

        return $name;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'tinymce_extension';
    }
}
