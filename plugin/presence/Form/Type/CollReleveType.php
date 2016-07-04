<?php

namespace FormaLibre\PresenceBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class CollReleveType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('releves', 'collection', ['type' => new PresenceType(),
                                                         'allow_add' => true,
                                                         'allow_delete' => true, ])
                    ->add('Valider', 'submit', [
                        'label' => 'Valider les présences',
                    ]);
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'FormaLibre\PresenceBundle\Entity\Releves',
            ]);
    }

    public function getName()
    {
        return 'CollReleve';
    }
}
