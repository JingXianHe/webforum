<?php

function nextendimportsmartslider2($key) {
    $keys = explode('.', $key);
    array_shift($keys);
    require_once(NEXTEND_SMART_SLIDER2. 'library/' . implode(DIRECTORY_SEPARATOR, $keys) . '.php');
}