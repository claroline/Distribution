<?php

namespace FormaLibre\OfficeConnectBundle\Library;

use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("formalibre.office_connect.library.authorization_helper_for_graph")
 */
 // A class that provides authortization token for apps that need to access Azure Active Directory Graph Service.
class AuthorizationHelperForGraph
{
    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "settings" = @DI\Inject("formalibre.office_connect.library.settings"),
     * })
     */
    public function __construct(Settings $settings)
    {
        $this->settings = $settings;
    }

    // Get Authorization URL
    public function getAuthorizatonURL()
    {
        $authUrl = 'https://login.windows.net/common/oauth2/authorize'.'?'.
                   'response_type=code'.'&'.
                   'client_id='.$this->settings->getClientId().'&'.
                   'resource='.$this->settings->getResourceUri().'&'.
                   'redirect_uri='.$this->settings->getRedirectUri();

        return $authUrl;
    }

    // Use the code retrieved from authorization URL to get the authentication token that will be used to talk to Graph
    public function getAuthenticationHeaderFor3LeggedFlow($code)
    {
        // Construct the body for the STS request
        $authenticationRequestBody = 'grant_type=authorization_code'.'&'.
                                     'client_id='.urlencode($this->settings->getClientId()).'&'.
                                     'redirect_uri='.$this->settings->getRedirectUri().'&'.
                                     'client_secret='.urlencode($this->settings->getPassword()).'&'.
                                     'code='.$code;

        //Using curl to post the information to STS and get back the authentication response
        $ch = curl_init();
        // set url
        $stsUrl = 'https://login.windows.net/common/oauth2/token';
        //curl_setopt($ch, CURLOPT_PROXY, '127.0.0.1:8888');
        curl_setopt($ch, CURLOPT_URL, $stsUrl);
        // Get the response back as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // Mark as Post request
        curl_setopt($ch, CURLOPT_POST, 1);
        // Set the parameters for the request
        curl_setopt($ch, CURLOPT_POSTFIELDS,  $authenticationRequestBody);
        //curl_setopt($ch, CURLOPT_PROXY, '127.0.0.1:8888');

        // By default, HTTPS does not work with curl.
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        // read the output from the post request
        $output = curl_exec($ch);
        // close curl resource to free up system resources
        curl_close($ch);

        //Decode the json response from STS
        $tokenOutput = json_decode($output);
        $tokenType = $tokenOutput->{'token_type'};
        $accessToken = $tokenOutput->{'access_token'};
        $tokenScope = $tokenOutput->{'scope'};

        echo "\t Token Type: ".$tokenType."\n AccessToken: ".$accessToken;
        // Add the token information to the session header so that we can use it to access Graph
        $_SESSION['token_type'] = $tokenType;
        $_SESSION['access_token'] = $accessToken;
        $_SESSION['tokenOutput'] = $tokenOutput;

       // it is possible to decode (base64) the accessToken and search claims, such as the user's upn
       // value.
       // However, this is not recommended because in the future, the access token maybe
       // encrypted.

       // $tokenOutput = base64_decode($accessToken);
       // $subString = strstr($tokenOutput,'"upn":');
       // $subString = strstr($subString, ',',TRUE);
       // $upn = rtrim(ltrim($subString,'"upn":"'), '"');
       // $_SESSION['upn']=$upn;
    }
}
