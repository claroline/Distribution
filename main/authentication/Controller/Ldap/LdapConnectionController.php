<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 3/29/17
 */

namespace Claroline\AuthenticationBundle\Controller\Ldap;

use  Claroline\AuthenticationBundle\Manager\Ldap\LdapManager;
use JMS\DiExtraBundle\Annotation\Inject;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;

class LdapConnectionController extends Controller
{
    /**
     * @Inject("claroline.manager.ldap_manager")
     *
     * @var LdapManager
     */
    private $ldapManager;

    /**
     * @var PlatformConfigurationHandler
     * @Inject("claroline.config.platform_config_handler")
     */
    private $platformConfigHandler;

    /**
     * @Route("/login/{name}", name="claro_ldap_login")
     * @Template("ClarolineAuthenticationBundle\ldap:connect:login.html.twig")
     *
     * @param Request $request
     * @param $name
     *
     * @return array
     */
    public function loginAction(Request $request, $name)
    {
        $request->getSession()->remove('LDAP_USER_ID');
        $error = null;
        if ($request->isMethod(Request::METHOD_POST)) {
            try {
                return $this->ldapManager->authenticate($request, $name);
            } catch (BadCredentialsException $e) {
                $error = true;
            } catch (UsernameNotFoundException $e) {
                $request->getSession()->set('LDAP_USER_ID', $e->getUsername());

                return $this->redirectToRoute('claro_ldap_check_connection', ['name' => $name]);
            }
        }

        return ['error' => $error, 'name' => $name];
    }

    /**
     * @Route("/login/check_connection/{name}", name="claro_ldap_check_connection")
     * @Template("ClarolineAuthenticationBundle\ldap:connect:check_connection.html.twig")
     *
     * @param Request $request
     * @param $name
     *
     * @return array
     */
    public function checkConnectionAction(Request $request, $name)
    {
        $ldapUser = $request->getSession()->get('LDAP_USER_ID');

        if (empty($ldapUser)) {
            $this->redirectToRoute('claro_ldap_login');
        }

        $selfRegistration = $this->platformConfigHandler->getParameter('allow_self_registration');
        $user = $this->get('claroline.manager.user_manager')->getUserByUsername($ldapUser);

        return [
            'selfRegistration' => $selfRegistration,
            'claroUser' => $user,
            'serverName' => $name,
        ];
    }

    /**
     * @Route("/register/{name}", name="claro_ldap_register")
     * @Template("ClarolineAuthenticationBundle\ldap:connect:register.html.twig")
     *
     * @param Request $request
     *
     * @return array
     */
    public function registerAction(Request $request, $name)
    {
        $ldapUser = $request->getSession()->get('LDAP_USER_ID');
        $selfRegistration = $this->platformConfigHandler->getParameter('allow_self_registration');
        if (empty($ldapUser) || !$selfRegistration) {
            $this->redirectToRoute('claro_ldap_login');
        }

        if ($request->isMethod(Request::METHOD_POST)) {
            return $this->ldapManager->createNewAccount($request, $ldapUser, $name);
        }

        $user = $this->ldapManager->findUserAsClaroUser($name, $ldapUser);
        $form = $this->ldapManager->getRegistrationForm($user);

        return ['form' => $form->createView(), 'serverName' => $name];
    }

    /**
     * @Route("/link/login/{name}", name="claro_ldap_login_link")
     * @Template("ClarolineAuthenticationBundle\ldap:connect:link_account.html.twig")
     *
     * @param Request $request
     *
     * @return array
     */
    public function loginLinkAction(Request $request, $name)
    {
        $ldapUser = $request->getSession()->get('LDAP_USER_ID');
        if (empty($ldapUser)) {
            $this->redirectToRoute('claro_ldap_login');
        }

        if ($request->isMethod(Request::METHOD_POST)) {
            return $this->ldapManager->linkAccount($request, $ldapUser, $name);
        }

        return ['serverName' => $name];
    }

    /**
     * @Route("/link_account_mail/{name}", name="claro_ldap_link_account_mail")
     * @Method("GET")
     * @Template("ClarolineAuthenticationBundle\ldap:connect:link_account.html.twig")
     *
     * @param Request $request
     *
     * @return array
     */
    public function linkAccountByMailAction(Request $request, $name)
    {
        $ldapUser = $request->getSession()->get('LDAP_USER_ID');
        if (empty($ldapUser)) {
            $this->redirectToRoute('claro_ldap_login');
        }

        return $this->ldapManager->linkAccount($request, $ldapUser, $name, $ldapUser);
    }
}
