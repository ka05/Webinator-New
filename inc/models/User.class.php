<?php
/**
 * Created by PhpStorm.
 * User: Clay
 * Date: 5/14/2015
 * Time: 1:34 PM
 */

class Account {
  private $UserID,
          $UserAdminStatus,
          $UserFullName,
          $UserEmail,
          $UserPass,
          $Username;

  /**
   * @return mixed
   */
  public function getUserID()
  {
    return $this->UserID;
  }

  /**
   * @param mixed $UserID
   */
  public function setUserID($UserID)
  {
    $this->UserID = $UserID;
  }

  /**
   * @return mixed
   */
  public function getUserAdminStatus()
  {
    return $this->UserAdminStatus;
  }

  /**
   * @param mixed $UserAdminStatus
   */
  public function setUserAdminStatus($UserAdminStatus)
  {
    $this->UserAdminStatus = $UserAdminStatus;
  }

  /**
   * @return mixed
   */
  public function getUserFullName()
  {
    return $this->UserFullName;
  }

  /**
   * @param mixed $UserFullName
   */
  public function setUserFullName($UserFullName)
  {
    $this->UserFullName = $UserFullName;
  }

  /**
   * @return mixed
   */
  public function getUserEmail()
  {
    return $this->UserEmail;
  }

  /**
   * @param mixed $UserEmail
   */
  public function setUserEmail($UserEmail)
  {
    $this->UserEmail = $UserEmail;
  }

  /**
   * @return mixed
   */
  public function getUserPass()
  {
    return $this->UserPass;
  }

  /**
   * @param mixed $UserPass
   */
  public function setUserPass($UserPass)
  {
    $this->UserPass = $UserPass;
  }

  /**
   * @return mixed
   */
  public function getUsername()
  {
    return $this->Username;
  }

  /**
   * @param mixed $Username
   */
  public function setUsername($Username)
  {
    $this->Username = $Username;
  }

}