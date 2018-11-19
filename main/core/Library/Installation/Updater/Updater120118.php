<?php

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\AuthenticationBundle\Model\Oauth\OauthConfiguration;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Yaml\Yaml;

class Updater120118 extends Updater
{
    protected $logger;

    private $conn;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;
        $this->conn = $container->get('doctrine.dbal.default_connection');
        $this->container = $container;
    }

    public function postUpdate()
    {
        $this->updateListConfig();
        $this->saveConfigAsJson();
    }

    private function updateListConfig()
    {
        $this->log('Remove sorting of filters from list config (format has changed).');

        $this->conn
            ->prepare('UPDATE claro_directory SET sortBy = null, availableSort = "[]", filters = "[]", availableFilters = "[]"')
            ->execute();

        $this->conn
            ->prepare('UPDATE claro_widget_list SET sortBy = null, availableSort = "[]", filters = "[]", availableFilters = "[]"')
            ->execute();
    }

    public function saveConfigAsJson()
    {
        $data = $this->serialize();
        $data = json_encode($data, JSON_PRETTY_PRINT);
        $path = $this->container->getParameter('claroline.param.platform_options');
        $this->log('Saving config as json file');
        file_put_contents($path, $data);
    }

    public function serialize(array $options = [])
    {
        $parameters = Yaml::parse(file_get_contents($this->container->getParameter('claroline.param.platform_options_file'))) ?: [];

        $platformInitDate = new \DateTime();
        $platformInitDate->setTimeStamp($parameters['platform_init_date']);

        $platformLimitDate = new \DateTime();
        $platformLimitDate->setTimeStamp($parameters['platform_limit_date']);

        $serialized = [
                'display' => [
                    'footer' => $this->getParameter($parameters, 'footer'),
                    'logo' => $this->getParameter($parameters, 'logo'),
                    'theme' => $this->getParameter($parameters, 'theme'),
                    'home_menu' => $this->getParameter($parameters, 'home_menu'),
                    'footer_login' => $this->getParameter($parameters, 'footer_login'),
                    'footer_workspaces' => $this->getParameter($parameters, 'footer_workspaces'),
                    'header_locale' => $this->getParameter($parameters, 'header_locale'),
                    'resource_icon_set' => $this->getParameter($parameters, 'resource_icon_set'),
                    'logo_redirect_home' => $this->getParameter($parameters, 'logo_redirect_home'),
                    'name' => $this->getParameter($parameters, 'name'),
                    'secondary_name' => $this->getParameter($parameters, 'secondary_name'),
                    'name_active' => $this->getParameter($parameters, 'name_active'),
                ],
                'mailer' => [
                    'transport' => $this->getParameter($parameters, 'mailer_transport'),
                    'host' => $this->getParameter($parameters, 'mailer_host'),
                    'port' => $this->getParameter($parameters, 'mailer_port'),
                    'encryption' => $this->getParameter($parameters, 'mailer_encryption'),
                    'username' => $this->getParameter($parameters, 'mailer_username'),
                    'password' => $this->getParameter($parameters, 'mailer_password'),
                    'auth_mode' => $this->getParameter($parameters, 'mailer_auth_mode'),
                    'api_key' => $this->getParameter($parameters, 'mailer_api_key'),
                    'tag' => $this->getParameter($parameters, 'mailer_tag'),
                    'from' => $this->getParameter($parameters, 'mailer_from'),
                ],
                'ssl' => [
                    'enabled' => $this->getParameter($parameters, 'ssl_enabled'),
                    'version' => $this->getParameter($parameters, 'ssl_version_value'),
                ],
                'server' => [
                    'tmp_dir' => $this->getParameter($parameters, 'tmp_dir'),
                ],
                'session' => [
                    'storage_type' => $this->getParameter($parameters, 'session_storage_type'),
                    'db_table' => $this->getParameter($parameters, 'session_db_table'),
                    'db_id_col' => $this->getParameter($parameters, 'session_db_id_col'),
                    'db_data_col' => $this->getParameter($parameters, 'session_db_data_col'),
                    'db_time_col' => $this->getParameter($parameters, 'session_db_time_col'),
                    'db_dsn' => $this->getParameter($parameters, 'session_db_dsn'),
                    'db_user' => $this->getParameter($parameters, 'session_db_user'),
                    'db_password' => $this->getParameter($parameters, 'session_db_password'),
                ],
                'auto_enable_notifications' => $this->getParameter($parameters, 'auto_enable_notifications'),
                'locales' => [
                    'available' => $this->getParameter($parameters, 'locales'),
                    'default' => $this->getParameter($parameters, 'locale_language'),
                ],
                'security' => [
                    'form_captcha' => $this->getParameter($parameters, 'form_captcha'),
                    'form_honeypot' => $this->getParameter($parameters, 'form_honeypot'),
                    'platform_limit_date' => DateNormalizer::normalize($platformLimitDate),
                    'platform_init_date' => DateNormalizer::normalize($platformInitDate),
                    'cookie_lifetime' => $this->getParameter($parameters, 'cookie_lifetime'),
                    'account_duration' => $this->getParameter($parameters, 'account_duration'),
                    'default_root_anon_id' => $this->getParameter($parameters, 'default_root_anon_id'),
                    'anonymous_public_profile' => $this->getParameter($parameters, 'anonymous_public_profile'),
                    'disabled_admin_tools' => ['technical_settings'],
                ],
                'tos' => [
                    'enabled' => $this->getParameter($parameters, 'terms_of_service'),
                ],
                'registration' => [
                    'username_regex' => $this->getParameter($parameters, 'username_regex'),
                    'self' => $this->getParameter($parameters, 'allow_self_registration'),
                    'default_role' => $this->getParameter($parameters, 'default_role'),
                    'register_button_at_login' => $this->getParameter($parameters, 'register_button_at_login'),
                    'auto_logging' => $this->getParameter($parameters, 'auto_logging_after_registration'),
                    'validation' => $this->getParameter($parameters, 'registration_mail_validation'),
                    'force_organization_creation' => $this->getParameter($parameters, 'force_organization_creation'),
                    'allow_workspace' => $this->getParameter($parameters, 'allow_workspace_at_registration'),
                ],
                'authentication' => [
                    'redirect_after_login_option' => $this->getParameter($parameters, 'redirect_after_login_option'),
                    'redirect_after_login_url' => $this->getParameter($parameters, 'redirect_after_login_url'),
                    'login_target_route' => $this->getParameter($parameters, 'login_target_route'),
                    //used by cas
                    'direct_third_party' => $this->getParameter($parameters, 'direct_third_party_authentication'),
                ],
                'workspace' => [
                    'max_storage_size' => $this->getParameter($parameters, 'max_storage_size'),
                    'max_upload_resources' => $this->getParameter($parameters, 'max_upload_resources'),
                    'max_workspace_users' => $this->getParameter($parameters, 'max_workspace_users'),
                    'default_tag' => $this->getParameter($parameters, 'default_workspace_tag'),
                    'users_csv_by_full_name' => $this->getParameter($parameters, 'workspace_users_csv_import_by_full_name'),
                    'send_mail_at_registration' => $this->getParameter($parameters, 'send_mail_at_workspace_registration'),
                    'enable_rich_text_file_import' => $this->getParameter($parameters, 'enable_rich_text_file_import'),
                    'list' => $this->getParameter($parameters, 'workspace.list'),
                ],
                'internet' => [
                    'domain_name' => $this->getParameter($parameters, 'domain_name'),
                    'platform_url' => $this->getParameter($parameters, 'platform_url'),
                    'google_meta_tag' => $this->getParameter($parameters, 'google_meta_tag'),
                ],
                'help' => [
                    'url' => $this->getParameter($parameters, 'help_url'),
                    'show' => $this->getParameter($parameters, 'show_help_button'),
                    'support_email' => $this->getParameter($parameters, 'support_email'),
                ],
                'geolocation' => [
                    'google' => [
                        'geocoding_client_id' => $this->getParameter($parameters, 'google_geocoding_client_id'),
                        'geocoding_signature' => $this->getParameter($parameters, 'google_geocoding_signature'),
                        'geocoding_key' => $this->getParameter($parameters, 'google_geocoding_key'),
                    ],
                ],
                'pdf' => [
                    'active' => $this->getParameter($parameters, 'is_pdf_export_active'),
                ],
                'statistics' => [
                    'url' => $this->getParameter($parameters, 'datas_sending_url'),
                    'confirmed' => $this->getParameter($parameters, 'confirm_send_datas'),
                    'token' => $this->getParameter($parameters, 'token'),
                ],
                //database_restoration section is not configurable nor documented
                'database_restoration' => [
                    'auto_validate_email' => $this->getParameter($parameters, 'auto_validate_email'),
                    'auto_enable_email_redirect' => $this->getParameter($parameters, 'auto_enable_email_redirect'),
                ],
                'logs' => [
                    'enabled' => $this->getParameter($parameters, 'platform_log_enabled'),
                ],
                'text' => [
                    'enable_opengraph' => $this->getParameter($parameters, 'enable_opengraph'),
                ],
                'portfolio' => [
                    'url' => $this->getParameter($parameters, 'portfolio_url'),
                ],
                'resource' => [
                    'soft_delete' => $this->getParameter($parameters, 'resource_soft_delete'),
                ],
                'country' => $this->getParameter($parameters, 'country'),
                'profile' => [
                    'roles_confidential' => $this->getParameter($parameters, 'profile_roles_confidential'),
                    'roles_locked' => $this->getParameter($parameters, 'profile_roles_locked'),
                    'roles_edition' => $this->getParameter($parameters, 'profile_roles_edition'),
                ],
                'maintenance' => [
                    'enable' => false,
                    'message' => 'change me',
                ],
            ];

        //serialize oauth data
        foreach (OauthConfiguration::resourceOwners() as $resourceOwner) {
            $resourceOwnerStr = str_replace(' ', '_', strtolower($resourceOwner));
            $serialized['external_authentication'][$resourceOwnerStr]['client_id'] = $this->getParameter($parameters, $resourceOwnerStr.'_client_id');
            $serialized['external_authentication'][$resourceOwnerStr]['client_secret'] = $this->getParameter($parameters, $resourceOwnerStr.'_client_secret');
            $serialized['external_authentication'][$resourceOwnerStr]['client_active'] = $this->getParameter($parameters, $resourceOwnerStr.'_client_active');
        }

        return $serialized;
    }

    private function getParameter($parameters, $name)
    {
        if (isset($parameters[$name])) {
            return $parameters[$name];
        }

        return $this->container->get('claroline.config.platform_config_handler')->getParameter($name);
    }
}
