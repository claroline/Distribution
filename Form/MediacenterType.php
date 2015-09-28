<?php
/**
 * This file is part of the Claroline Connect package
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 2/20/15
 */

namespace Inwicast\ClarolinePluginBundle\Form;


use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * Class MediacenterType
 * @package Inwicast\ClarolinePluginBundle\Form
 *
 * @DI\FormType;
 */
class MediacenterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('url', 'url', array('required' => true))
            ->add('driver', 'text', array('required' => true))
            ->add('host', 'text', array('required' => true))
            ->add('port', 'text', array('required' => true))
            ->add('dbname', 'text', array('required' => true))
            ->add('user', 'text', array('required' => true))
            ->add('password', 'password', array('required' => true));
    }

    /**
     * Returns the name of this type.
     *
     * @return string The name of this type
     */
    public function getName()
    {
        return 'inwicast_plugin_type_mediacenter';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            array(
                'translation_domain' => 'widget',
                'data_class'         => 'Inwicast\ClarolinePluginBundle\Entity\Mediacenter',
                'csrf_protection'    => true
            )
        );
    }
}