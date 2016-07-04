<?php

namespace Innova\CollecticielBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CommentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        // Saisie du commentaire
        $builder->add('commentText', 'tinymce', [
            'label' => 'Comments add',
            'label_attr' => [
                'style' => 'display: none;',
            ], ]);

        // Ajout de la déclaration du bouton "Envoyer"
        $builder->add('save', 'submit', [
        'label' => 'Comment validation',
        'attr' => ['class' => 'btn btn-primary pull-left'],
        ]);
    }

    public function getName()
    {
        return 'innova_collecticiel_comment_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'translation_domain' => 'innova_collecticiel',
        ]);
    }
}
