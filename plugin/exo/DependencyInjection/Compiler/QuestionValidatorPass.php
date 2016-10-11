<?php

namespace UJM\ExoBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

class QuestionValidatorPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->has('ujm_exo.validator.question_collector')) {
            return;
        }

        // Get the validator collector
        $definition = $container->findDefinition('ujm_exo.validator.question_collector');

        // Get all defined question validators
        $taggedServices = $container->findTaggedServiceIds('ujm_exo.question.validator');

        $serviceIds = array_keys($taggedServices);
        foreach ($serviceIds as $id) {
            $definition->addMethodCall('addHandler', [new Reference($id)]);
        }
    }
}
