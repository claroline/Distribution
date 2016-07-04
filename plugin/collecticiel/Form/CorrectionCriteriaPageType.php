<?php

namespace Innova\CollecticielBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CorrectionCriteriaPageType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $criteria = $options['criteria'];
        $totalChoice = $options['totalChoice'];

        $choices = [];
        for ($i = 0; $i < $totalChoice; ++$i) {
            $choices[$i] = $i;
        }

        foreach ($criteria as $criterion) {
            $params = [
                'choices' => $choices,
                'expanded' => true,
                'multiple' => false,
// En commentaire car cette zone n'est plus obligatoire. InnovaERV, avril 2015.
                'required' => true,
                'label' => $criterion->getInstruction(),
                'label_attr' => ['style' => 'font-weight: normal;'],
            ];

            if ($options['edit'] === false) {
                $params['disabled'] = 'disabled';
            }

            $builder
                ->add('goBack', 'hidden', ['mapped' => false])
                ->add($criterion->getId(), 'choice', $params);
        }
    }

    public function getName()
    {
        return 'innova_collecticiel_correct_criteria_page_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'totalChoice' => 5,
            'criteria' => [],
            'edit' => true,
            'translation_domain' => 'innova_collecticiel',
        ]);
    }
}
