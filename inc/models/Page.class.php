<?php
/**
 * Created by PhpStorm.
 * User: Clay
 * Date: 5/14/2015
 * Time: 1:37 PM
 */

class Page {

  private $PageID,
          $PageName,
          $ProjectID,
          $PageContent,
          $PageJS;

  /**
   * @return mixed
   */
  public function getPageID()
  {
    return $this->PageID;
  }

  /**
   * @param mixed $PageID
   */
  public function setPageID($PageID)
  {
    $this->PageID = $PageID;
  }

  /**
   * @return mixed
   */
  public function getPageName()
  {
    return $this->PageName;
  }

  /**
   * @param mixed $PageName
   */
  public function setPageName($PageName)
  {
    $this->PageName = $PageName;
  }

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
  public function getPageContent()
  {
    return $this->PageContent;
  }

  /**
   * @param mixed $PageContent
   */
  public function setPageContent($PageContent)
  {
    $this->PageContent = $PageContent;
  }

  /**
   * @return mixed
   */
  public function getPageJS()
  {
    return $this->PageJS;
  }

  /**
   * @param mixed $PageJS
   */
  public function setPageJS($PageJS)
  {
    $this->PageJS = $PageJS;
  }

}