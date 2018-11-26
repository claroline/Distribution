<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager\Template;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\Entity\Template\Template;
use Claroline\CoreBundle\Entity\Template\TemplateType;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.template_manager")
 */
class TemplateManager
{
    /** @var ParametersSerializer */
    private $parametersSerializer;

    private $templateTypeRepo;
    private $templateRepo;

    /**
     * @DI\InjectParams({
     *     "om"                   = @DI\Inject("claroline.persistence.object_manager"),
     *     "parametersSerializer" = @DI\Inject("claroline.serializer.parameters")
     * })
     *
     * @param ObjectManager        $om
     * @param ParametersSerializer $parametersSerializer
     */
    public function __construct(ObjectManager $om, ParametersSerializer $parametersSerializer)
    {
        $this->parametersSerializer = $parametersSerializer;

        $this->templateTypeRepo = $om->getRepository(TemplateType::class);
        $this->templateRepo = $om->getRepository(Template::class);
    }

    /**
     * @param string      $templateType
     * @param array       $placeholders
     * @param string      $mode
     * @param string|null $locale
     *
     * @return string|null
     */
    public function getTemplate($templateType, $placeholders = [], $mode = 'content', $locale = null)
    {
        $result = null;
        $templateType = $this->templateTypeRepo->findOneBy(['name' => $templateType]);

        // Checks if a template is associated to the template type
        if ($templateType && $templateType->getTemplate()) {
            $template = null;

            // Fetches template for the given type and locale
            if ($locale) {
                $template = $this->templateRepo->findOneBy([
                    'type' => $templateType,
                    'name' => $templateType->getTemplate(),
                    'lang' => $locale,
                ]);
            }
            // If no template is found for the given locale or locale is null, uses default locale
            if (!$locale || !$template) {
                $parameters = $this->parametersSerializer->serialize([Options::SERIALIZE_MINIMAL]);
                $defaultLocale = isset($parameters['locale']['default']) ? $parameters['locales']['default'] : null;

                if ($defaultLocale && $defaultLocale !== $locale) {
                    $template = $this->templateRepo->findOneBy([
                        'type' => $templateType,
                        'name' => $templateType->getTemplate(),
                        'lang' => $defaultLocale,
                    ]);
                }
            }
            // If a template is found
            if ($template) {
                switch ($mode) {
                    case 'content':
                        $result = $this->replacePlaceholders($template->getContent(), $placeholders);
                        break;
                    case 'subject':
                        $result = $this->replacePlaceholders($template->getSubject(), $placeholders);
                        break;
                }
            }
        }

        return $result;
    }

    /**
     * @param string $text
     * @param array  $placeholders
     *
     * @return string
     */
    public function replacePlaceholders($text, $placeholders = [])
    {
        $keys = [];
        $values = [];

        foreach ($placeholders as $key => $value) {
            $keys[] = '%'.$key.'%';
            $values[] = $value;
        }

        return str_replace($keys, $values, $text);
    }
}
