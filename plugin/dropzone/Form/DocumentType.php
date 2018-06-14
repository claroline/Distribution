<?php

namespace Icap\DropzoneBundle\Form;

use Claroline\CoreBundle\Form\Field\TinymceType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DocumentType extends AbstractType
{
    private $name = 'icap_dropzone_document_file_form';

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        if ($options['documentType'] === TextType::class) {
            $this->setName('icap_dropzone_document_file_form_text');
            $builder->add('document', TinymceType::class, array(
                'required' => true,
            ));
        } elseif ($options['documentType'] === 'file') {
            $this->setName('icap_dropzone_document_file_form_file');
            $builder->add('document', FileType::class, array('required' => true, 'label' => 'file document'));
        } elseif ($options['documentType'] === 'resource') {
            $this->setName('icap_dropzone_document_file_form_resource');
            $builder->add(
                'document',
                HiddenType::class,
                array(
                    'required' => true,
                    'label' => '',
                    'label_attr' => array('style' => 'display: none;'),
                )
            );
        } else {
            $this->setName('icap_dropzone_document_file_form_url');
            $builder->add('document', UrlType::class, array('required' => true, 'label' => 'url document'));
        }
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'documentType' => UrlType::class,
            'translation_domain' => 'icap_dropzone',
        ));
    }
}
