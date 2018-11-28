<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\API\Serializer\Template;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\Entity\Template\Template;
use Claroline\CoreBundle\Entity\Template\TemplateType;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.template")
 * @DI\Tag("claroline.serializer")
 */
class TemplateSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;

    /** @var ParametersSerializer */
    private $parametersSerializer;

    /** @var SerializerProvider */
    private $serializer;

    private $templateRepo;
    private $templateTypeRepo;

    /**
     * TemplateSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"                   = @DI\Inject("claroline.persistence.object_manager"),
     *     "parametersSerializer" = @DI\Inject("claroline.serializer.parameters"),
     *     "serializer"           = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param ObjectManager        $om
     * @param ParametersSerializer $parametersSerializer
     * @param SerializerProvider   $serializer
     */
    public function __construct(
        ObjectManager $om,
        ParametersSerializer $parametersSerializer,
        SerializerProvider $serializer
    ) {
        $this->om = $om;
        $this->parametersSerializer = $parametersSerializer;
        $this->serializer = $serializer;

        $this->templateRepo = $om->getRepository(Template::class);
        $this->templateTypeRepo = $om->getRepository(TemplateType::class);
    }

    /**
     * @param Template $template
     * @param array    $options
     *
     * @return array
     */
    public function serialize(Template $template, array $options = [])
    {
        $serialized = [
            'id' => $template->getUuid(),
            'name' => $template->getName(),
            'type' => $this->serializer->serialize($template->getType()),
            'subject' => $template->getSubject(),
            'content' => $template->getContent(),
            'lang' => $template->getLang(),
            'localized' => $this->serializeLocalized($template),
        ];

        return $serialized;
    }

    /**
     * @param array    $data
     * @param Template $template
     *
     * @return Template
     */
    public function deserialize($data, Template $template)
    {
        $this->sipe('id', 'setUuid', $data, $template);
        $this->sipe('name', 'setName', $data, $template);
        $this->sipe('subject', 'setSubject', $data, $template);
        $this->sipe('content', 'setContent', $data, $template);
        $this->sipe('lang', 'setLang', $data, $template);

        $templateType = isset($data['type']['id']) ?
            $this->templateTypeRepo->findOneBy(['uuid' => $data['type']['id']]) :
            null;

        if ($templateType) {
            $template->setType($templateType);
        }
        if (isset($data['localized'])) {
            foreach ($data['localized'] as $locale => $localizedData) {
                if (isset($localizedData['content'])) {
                    $localizedTemplate = isset($localizedData['id']) ?
                        $this->templateRepo->findOneBy(['uuid' => $localizedData['id']]) :
                        null;

                    if (!$localizedTemplate) {
                        $localizedTemplate = new Template();
                    }
                    $localizedTemplate->setLang($locale);
                    $localizedTemplate->setName($template->getName());
                    $localizedTemplate->setType($template->getType());
                    $localizedTemplate->setContent($localizedData['content']);

                    if (isset($localizedData['subject'])) {
                        $localizedTemplate->setSubject($localizedData['subject']);
                    }
                    $this->om->persist($localizedTemplate);
                }
            }
        }

        return $template;
    }

    /**
     * @param Template $template
     *
     * @return array
     */
    private function serializeLocalized(Template $template)
    {
        $localized = [];
        $parameters = $this->parametersSerializer->serialize([Options::SERIALIZE_MINIMAL]);
        $locales = isset($parameters['locales']['available']) ? $parameters['locales']['available'] : [];
        $templateLang = $template->getLang();

        foreach ($locales as $locale) {
            if ($locale !== $templateLang) {
                $localizedTemplate = $this->templateRepo->findOneBy([
                    'name' => $template->getName(),
                    'type' => $template->getType(),
                    'lang' => $locale,
                ]);
                $localized[$locale] = $localizedTemplate ? [
                    'id' => $localizedTemplate->getUuid(),
                    'subject' => $localizedTemplate->getSubject(),
                    'content' => $localizedTemplate->getContent(),
                    'lang' => $localizedTemplate->getLang(),
                ] : new \stdClass();
            }
        }

        return $localized;
    }
}
