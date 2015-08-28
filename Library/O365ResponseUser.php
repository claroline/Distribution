<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Description of O365ResponseUser
 *
 * @author nbr
 */
namespace FormaLibre\OfficeConnectBundle\Library;

class O365ResponseUser
{
    private $responseObj;

    public function __construct($jsonUser){
        $this->responseObj = $jsonUser;
    }

    public function getUsername(){
         return $this->responseObj->{'mail'};
    }

    public function getResponse() {
        return $this->responseObj;
    }

    public function getEmail() {
         return $this->responseObj->{'mail'};
    }

    public function getNickname() {
         return $this->responseObj->{'mailNickname'};
    }

    public function getRealName() {
         return $this->responseObj->{'displayName'};
    }
}
