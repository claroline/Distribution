<?php

namespace UJM\ExoBundle\Library\Options;

/**
 * Defines Serializers options.
 */
final class Transfer
{
    /**
     * Only serializes minimal data of the Entity.
     *
     * @var string
     */
    const MINIMAL = 'minimal';

    /**
     * Adds administrations info in the serialized data
     *
     * @var string
     */
    const INCLUDE_ADMIN_META = 'includeAdminMeta';

    /**
     * Adds solutions info in the serialized data
     *
     * @var string
     */
    const INCLUDE_SOLUTIONS = 'includeSolutions';
}
