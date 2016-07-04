<?php

namespace FormaLibre\ReservationBundle\Form;

use Doctrine\ORM\EntityManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service("formalibre.form.resource")
 */
class ResourceType extends AbstractType
{
    private $em;
    private $translator;

    /**
     * @DI\InjectParams({
     *      "em"         = @DI\Inject("doctrine.orm.entity_manager"),
     *      "translator" = @DI\Inject("translator")
     * })
     */
    public function __construct(EntityManager $em, TranslatorInterface $translator)
    {
        $this->em = $em;
        $this->translator = $translator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', 'text', [
                'label' => 'form.name',
            ]
        );

        $builder->add('description', 'textarea', [
            'label' => 'form.description',
        ]);

        $builder->add('localisation', 'text', [
            'label' => 'form.localisation',
        ]);

        $builder->add('maxTimeReservation', 'time', [
            'input' => 'string',
            'widget' => 'single_text',
            'label' => 'form.maxTime',
        ]);

        $builder->add('quantity', 'integer', [
            'label' => 'form.quantity',
            'empty_data' => 1,
            'attr' => [
                'min' => 1,
            ],
        ]);

        $builder->add('color', 'text', [
            'label' => 'form.color',
            'required' => false,
            'empty_data' => '#3a87ad',
        ]);
    }

    public function getName()
    {
        return 'resource_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            [
                'class' => 'FormaLibre\ReservationBundle\Entity\Resource',
                'translation_domain' => 'reservation',
            ]
        );
    }
}
