<?php

namespace UJM\ExoBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

class QuestionSerializerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->has('ujm_exo.serializer.question_collector')) {
            return;
        }

        // Get the serializer collector
        $definition = $container->findDefinition('ujm_exo.serializer.question_collector');

        // Get all defined question serializers
        $taggedServices = $container->findTaggedServiceIds('ujm_exo.question.serializer');

        $serviceIds = array_keys($taggedServices);
        foreach ($serviceIds as $id) {
            $definition->addMethodCall('addHandler', [new Reference($id)]);
        }
    }
}
