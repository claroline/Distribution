<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 4/12/17
 */

namespace Claroline\ExternalSynchronizationBundle\Listener;

use Claroline\CoreBundle\Menu\ConfigureMenuEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Class ExternalUserGroupSynchronizationListener.
 *
 * @DI\Service()
 */
class ExternalSynchronizationListener
{
    private $translator;

    /**
     * ExternalUserGroupSynchronizationListener constructor.
     *
     * @param TranslatorInterface $translator
     * @DI\InjectParams({
     *     "translator"     = @DI\Inject("translator")
     * })
     */
    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    /**
     * @DI\Observe("claroline_external_parameters_menu_configure")
     *
     * @param \Claroline\CoreBundle\Menu\ConfigureMenuEvent $event
     *
     * @return \Knp\Menu\ItemInterface $menu
     */
    public function onExternalAuthenticationMenuConfigure(ConfigureMenuEvent $event)
    {
        $name = $this->translator->trans('external_user_group_parameters', [], 'claro_external_user_group');
        $menu = $event->getMenu();
        $menu->addChild(
            $name,
            [
                'route' => 'claro_admin_external_user_group_config_index',
            ]
        )->setExtra('name', $name);

        return $menu;
    }
}
