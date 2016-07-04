<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\TeamBundle\Form;

use Claroline\TeamBundle\Entity\WorkspaceTeamParameters;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Validator\Constraints\NotBlank;

class MultipleTeamsType extends AbstractType
{
    protected $params;

    public function __construct(WorkspaceTeamParameters $params)
    {
        $this->params = $params;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'name',
            'text',
            [
                'required' => true,
                'constraints' => new NotBlank(),
            ]
        );
        $builder->add(
            'description',
            'tinymce',
            ['required' => false]
        );
        $builder->add(
            'nbTeams',
            'integer',
            [
                'attr' => ['min' => 1],
                'required' => true,
                'constraints' => new NotBlank(),
                'data' => 1,
            ]
        );
        $builder->add(
            'defaultResource',
            'resourcePicker',
            [
                'required' => false,
                'mapped' => false,
                'label' => 'default_resource',
                'attr' => [
                    'data-restrict-for-owner' => 1,
                ],
            ]
        );
        $builder->add(
            'maxUsers',
            'integer',
            [
                'attr' => ['min' => 0],
                'required' => false,
            ]
        );
        $builder->add(
            'isPublic',
            'choice',
            [
                'choices' => [
                    true => 'public',
                    false => 'private',
                ],
                'required' => true,
                'data' => $this->params->getIsPublic(),
                'attr' => ['class' => 'advanced-param'],
            ]
        );
        $builder->add(
            'selfRegistration',
            'checkbox',
            [
                'required' => true,
                'data' => $this->params->getSelfRegistration(),
                'attr' => ['class' => 'advanced-param'],
            ]
        );
        $builder->add(
            'selfUnregistration',
            'checkbox',
            [
                'required' => true,
                'data' => $this->params->getSelfUnregistration(),
                'attr' => ['class' => 'advanced-param'],
            ]
        );
        $builder->add(
            'resourceTypes',
            'entity',
            [
                'required' => false,
                'mapped' => false,
                'expanded' => true,
                'multiple' => true,
                'translation_domain' => 'resource',
                'label' => 'user_creatable_resources',
                'class' => 'ClarolineCoreBundle:Resource\ResourceType',
                'property' => 'name',
                'attr' => ['class' => 'advanced-param'],
            ]
        );
    }

    public function getName()
    {
        return 'team_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(['translation_domain' => 'team']);
    }
}
