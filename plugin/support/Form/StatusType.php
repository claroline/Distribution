<?php

namespace FormaLibre\SupportBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class StatusType extends AbstractType
{
    private $isLocked;

    public function __construct($isLocked = false)
    {
        $this->isLocked = $isLocked;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'name',
            'text',
            array(
                'required' => true,
                'label' => 'name',
                'translation_domain' => 'platform',
            )
        );
        $builder->add(
            'code',
            'text',
            array(
                'required' => true,
                'label' => 'code',
                'translation_domain' => 'platform',
                'read_only' => $this->isLocked,
            )
        );
        $builder->add(
            'description',
            'tinymce',
            [
                'required' => true,
                'label' => 'description',
                'translation_domain' => 'platform',
            ]
        );
    }

    public function getName()
    {
        return 'status_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array('translation_domain' => 'support'));
    }
}
