<?php

namespace Icap\BadgeBundle\Form\Type;

use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * @DI\Service("icap_badge.form.user_badge")
 */
class UserBadgeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('is_shared', 'checkbox');
    }

    public function getName()
    {
        return 'user_badge_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => 'Icap\BadgeBundle\Entity\UserBadge',
                'translation_domain' => 'icap_badge',
                'csrf_protection' => false,
            ]
        );
    }
}
