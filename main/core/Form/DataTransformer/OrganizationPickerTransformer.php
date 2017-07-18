<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Form\DataTransformer;

use Claroline\CoreBundle\Manager\Organization\OrganizationManager;
use JMS\DiExtraBundle\Annotation\Inject;
use JMS\DiExtraBundle\Annotation\InjectParams;
use JMS\DiExtraBundle\Annotation\Service;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

/**
 * @Service("claroline.transformer.organization_picker")
 */
class OrganizationPickerTransformer implements DataTransformerInterface
{
    private $organizationManager;

    /**
     * @InjectParams({
     *     "persistence"         = @Inject("claroline.persistence.object_manager"),
     *     "organizationManager" = @Inject("claroline.manager.organization.organization_manager")
     * })
     */
    public function __construct(OrganizationManager $organizationManager)
    {
        $this->organizationManager = $organizationManager;
    }

    public function transform($organization)
    {
        if ($organization instanceof Organization) {
            return $organization->getId();
        }

        return '';
    }

    public function reverseTransform($id)
    {
        if (!$id) {
            return;
        }

        $organization = $this->organizationManager->getById($id);

        if (null === $organization) {
            throw new TransformationFailedException();
        }

        return $organization;
    }
}
