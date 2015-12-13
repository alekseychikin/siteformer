<?php

  ParserE::registerScheme(function ($element, $e)
  {
    if (get_class($element) === 'TagComment') {
      return true;
    }
    return false;
  });
