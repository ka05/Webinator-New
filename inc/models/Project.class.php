<?php
/**
 * Created by PhpStorm.
 * User: Clay
 * Date: 5/14/2015
 * Time: 1:38 PM
 */

class Project {

  private $ProjectID,
          $ProjectName,
          $UserID;

  /**
   * @return mixed
   */
  public function getProjectID()
  {
    return $this->ProjectID;
  }

  /**
   * @param mixed $ProjectID
   */
  public function setProjectID($ProjectID)
  {
    $this->ProjectID = $ProjectID;
  }

  /**
   * @return mixed
   */
  public function getProjectName()
  {
    return $this->ProjectName;
  }

  /**
   * @param mixed $ProjectName
   */
  public function setProjectName($ProjectName)
  {
    $this->ProjectName = $ProjectName;
  }

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
}