import React from 'react'

import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {CheckGroup}                from '#/main/core/layout/form/components/group/check-group.jsx'
import {FormGroup}                 from '#/main/core/layout/form/components/group/form-group.jsx'
import {HtmlGroup}                 from '#/main/core/layout/form/components/group/html-group.jsx'
import {SelectGroup}                    from '#/main/core/layout/form/components/group/select-group.jsx'
import {t}                         from '#/main/core/translation'
import {
  REGISTRATION_MAIL_VALIDATION_NONE,
  REGISTRATION_MAIL_VALIDATION_FULL,
  REGISTRATION_MAIL_VALIDATION_PARTIAL
}                                  from '#/main/core/administration/user/parameters/constants'

const RegistrationSection = props =>
  <FormSection
    id="registration-parameters"
    icon="fa fa-fw fa-key"
    title={t('registration')}
    {...props}
  >
    <CheckGroup
      checkId="self-registration"
      label={t('self_registration')}
      checked={props.allowSelfRegistration}
      onChange={checked => props.updateParameter('allowSelfRegistration', checked)}
    />
    <CheckGroup
      checkId="show-register-button-in-login-page"
      label={t('show_register_button_in_login_page')}
      checked={props.registerButtonAtLogin}
      onChange={checked => props.updateParameter('registerButtonAtLogin', checked)}
    />
    <SelectGroup
      controlId={'default-role'}
      label={t('default_role')}
      options={[]}
      selectedValue={props.defaultRole}
      disabled={false}
      multiple={false}
      noEmpty={true}
      onChange={value => props.updateParameter('defaultRole', checked)}
    >
    </SelectGroup>
    <SelectGroup
      controlId={'default-language'}
      label={t('default_language')}
      options={[]}
      selectedValue={props.localeLanguage}
      disabled={false}
      multiple={false}
      noEmpty={true}
      onChange={value => props.updateParameter('localeLanguage', checked)}
    >
    </SelectGroup>
    <SelectGroup
      controlId={'registration-validation'}
      label={t('registration_mail_validation')}
      options={[
        {value: REGISTRATION_MAIL_VALIDATION_NONE,label: t('none')},
        {value: REGISTRATION_MAIL_VALIDATION_FULL,label: t('force_mail_validation')},
        {value: REGISTRATION_MAIL_VALIDATION_PARTIAL,label: t('send_mail_info')}
      ]}
      selectedValue={props.registrationMailValidation}
      disabled={false}
      multiple={false}
      noEmpty={true}
      onChange={value => props.updateParameter('registrationMailValidation', checked)}
    >
    </SelectGroup>
  </FormSection>

const SecuritySection = props  =>
  <FormSection
    id="security-parameters"
    icon="fa fa-fw fa-key"
    title={t('security')}
    {...props}
  >
    <CheckGroup
      checkId="display-captcha"
      label={t('display_captcha')}
      checked={props.formCaptcha}
      onChange={checked => props.updateParameter('formCaptcha', checked)}
    />
    <CheckGroup
      checkId="use-honeypot"
      label={t('use_honeypot')}
      checked={props.formHoneypot}
      onChange={checked => props.updateParameter('formHoneypot', checked)}
    />
    <CheckGroup
      checkId="show-profile-for-anonymous"
      label={t('show_profile_for_anonymous')}
      checked={props.anonymousPublicProfile}
      onChange={checked => props.updateParameter('anonymousPublicProfile', checked)}
    />
    <FormGroup
      controlId="cookie-lifetime"
      label={t('cookie_lifetime')}
      validating={props.validating}
    >
      <input
        id="cookie-lifetime"
        type="number"
        className="form-control"
        value={props.cookieLifetime}
        onChange={e => props.updateParameter('cookieLifetime', e.target.value)}
      />
    </FormGroup>
  </FormSection>

const TermOfServicesSection = props =>
  <FormSection
    id="tos"
    icon="fa fa-fw fa-key"
    title={t('term_of_services')}
  >
    <p>don't forget to handle translations here (see ContentType in form and the term of service handling)</p>
    <HtmlGroup
      controlId="terms-of-service"
      label={t('terms_of_service')}
      content={props.termsOfService}
      onChange={termsOfService => props.updateParameter('termsOfService', termsOfService)}
    />
    <CheckGroup
      checkId="enable-tos"
      label={t('term_of_service_activation_message')}
      checked={props.enableTermOfService}
      onChange={checked => props.updateParameter('enableTermOfService', checked)}
    />
  </FormSection>

const AuthenticationSection = props =>
  <FormSection
    id="external-authentication"
    icon="fa fa-fw fa-key"
    title={t('external_authentication')}
  >

  </FormSection>

const Parameters = props =>
  <div>
    <h3>Parameters</h3>
      <FormSections>
        <RegistrationSection
          parameters={props.parameters}
          updateParameter={() => {}}
          validating={false}
          errors={[]}
        />

        <SecuritySection
          parameters={props.parameters}
          updateParameter={() => {}}
          validating={false}
          errors={[]}
        />

        <TermOfServicesSection
          parameters={props.parameters}
          updateParameter={() => {}}
          validating={false}
          errors={[]}
        />

        <AuthenticationSection
          parameters={props.parameters}
          updateParameter={() => {}}
          validating={false}
          errors={[]}
        />
    </FormSections>
  </div>

export {
  Parameters
}
