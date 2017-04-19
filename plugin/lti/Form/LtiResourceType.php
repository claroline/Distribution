<?php

namespace UJM\LtiBundle\Form;

use Doctrine\ORM\EntityRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class LtiResourceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('LtiApp', 'entity', [
            'class' => 'UJMLtiBundle:LtiApp',
            'query_builder' => function (EntityRepository $er) {
                return $er->createQueryBuilder('l')
                    ->orderBy('l.title', 'ASC');
            },
            'choice_label' => 'title',
        ]);
        $builder->add(
            'name',
            'text',
            [
                'label' => 'name',
                'attr' => ['autofocus' => true],
            ]
        );
    }

    public function getName()
    {
        return 'platform_parameters_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(['translation_domain' => 'lti']);
    }
}
