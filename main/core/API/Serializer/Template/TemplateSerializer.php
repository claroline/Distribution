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

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
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

    /** @var SerializerProvider */
    private $serializer;

    private $templateTypeRepo;

    /**
     * CourseSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param ObjectManager      $om
     * @param SerializerProvider $serializer
     */
    public function __construct(ObjectManager $om, SerializerProvider $serializer)
    {
        $this->serializer = $serializer;

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

        return $template;
    }
}
