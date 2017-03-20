<?php

namespace FormaLibre\SupportBundle\Form;

use FormaLibre\SupportBundle\Entity\Comment;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class CommentEditType extends AbstractType
{
    private $type;

    public function __construct($type = Comment::PUBLIC_COMMENT)
    {
        $this->type = $type;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'content',
            'tinymce',
            array(
                'required' => true,
                'label' => 'content',
                'translation_domain' => 'platform',
            )
        );
    }

    public function getName()
    {
        return $this->type === Comment::PUBLIC_COMMENT ? 'comment_edit_form' : 'private_comment_edit_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array('translation_domain' => 'support'));
    }
}
