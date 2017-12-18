<?php

namespace Claroline\CoreBundle\API\Serializer\User;

use Claroline\CoreBundle\API\Serializer\Facet\FacetSerializer;
use Claroline\CoreBundle\Entity\Facet\Facet;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Repository\FacetRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.serializer.profile")
 */
class ProfileSerializer
{
    /** @var TokenStorageInterface */
    private $tokenStorage;

    /** @var FacetRepository */
    private $repository;

    /** @var FacetSerializer */
    private $facetSerializer;

    /**
     * ProfileSerializer constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage"    = @DI\Inject("security.token_storage"),
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "facetSerializer" = @DI\Inject("claroline.serializer.facet")
     * })
     *
     * @param TokenStorageInterface $tokenStorage
     * @param ObjectManager         $om
     * @param FacetSerializer       $facetSerializer
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        ObjectManager $om,
        FacetSerializer $facetSerializer)
    {
        $this->tokenStorage = $tokenStorage;
        $this->repository = $om->getRepository('ClarolineCoreBundle:Facet\Facet');
        $this->facetSerializer = $facetSerializer;
    }

    /**
     * Serializes the profile configuration.
     *
     * @return array
     */
    public function serialize()
    {
        $facets = $this->repository
            ->findVisibleFacets($this->tokenStorage->getToken());

        $serializedFacets = array_map(function (Facet $facet) {
            return $this->facetSerializer->serialize($facet);
        }, $facets);

        if (!$this->hasMainFacet($serializedFacets)) {
            array_unshift($facets, $this->serializeMainFacet());
        }

        return $serializedFacets;
    }

    private function hasMainFacet(array $facets)
    {
        foreach ($facets as $facet) {

        }

        return true;
    }

    private function serializeMainFacet()
    {
        return [

        ];
    }

    private function serializeDefaultPanel()
    {
        return [
            'id' => 'default',
            'title' => '',
            'position' => 0,
        ];
    }

    /**
     * Deserializes data into a Role entity.
     *
     * @param \stdClass $data
     * @param Role      $role
     * @param array     $options
     *
     * @return Role
     */
    public function deserialize($data, Role $role = null, array $options = [])
    {
        return $role;
    }
}
