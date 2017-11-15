<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\API;

final class Options
{
    /*******************************/
    /* SERIALIZER PROVIDER OPTIONS */
    /*******************************/

    /*
     * Using this option, the serializer provider won't fetch any data from the database
     * even if an id or an uuid exists
     */
    const NO_FETCH = 'no_fetch';

    /*******************************/
    /* SPECIFIC SERIALIZER OPTIONS */
    /*******************************/

    /*
     * Do we want to recursively serialize ?
     * currently used by: organization
     */
    const IS_RECURSIVE = 'is_recursive';

    /****************/
    /* CRUD OPTIONS */
    /****************/

    const SOFT_DELETE = 'soft_delete';
    const THROW_VALIDATION_EXCEPTION = 'throw_validation_exception';
    const NO_VALIDATE = 'no_validate'; //if validation is too long for huge csv
    const NO_PERMISSION_CHECK = 'no_permission_check';
    const USER_SELF_LOG = 'user_self_log';

    //maybe move this somewhere else: like UserOptions for Crud ?
    const SEND_EMAIL = 'send_email';
    const ADD_NOTIFICATIONS = 'add_notifications';
}
