<?php

namespace Icap\PortfolioBundle\Form\Type\Widgets;

use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * @DI\FormType
 */
class FormationsFormationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', 'integer', [
                'required' => false,
                'mapped' => false,
            ])
            ->add('name', 'text', [
                'required' => false,
                'mapped' => false,
            ])
            ->add('resource', 'entity', [
                'class' => 'ClarolineCoreBundle:Resource\ResourceNode',
                'property' => 'name',
                'required' => false,
            ])
            ->add('uri', 'text', [
                'required' => false,
                'mapped' => false,
            ])
            ->add('uriLabel', 'text', [
                'required' => false,
                'mapped' => false,
            ]);
    }

    public function getName()
    {
        return 'icap_portfolio_widget_form_formations_formation';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => 'Icap\PortfolioBundle\Entity\Widget\FormationsWidgetResource',
                'translation_domain' => 'icap_portfolio',
                'csrf_protection' => false,
            ]
        );
    }
}
