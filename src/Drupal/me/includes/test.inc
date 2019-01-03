<?php
function _test_firebase(){
    $DEFAULT_URL = 'https://rn-ui-a37a1.firebaseio.com';
    $DEFAULT_TOKEN = 'AIzaSyDvYSOBwJBAuOEBB1NBRq70W9QCy2QDxmo';
    $DEFAULT_PATH = '/firebase/example';
    
    $firebase = new \Firebase\FirebaseLib('https://rn-ui-a37a1.firebaseio.com');

    

    // --- storing an array ---
    $test = [
        'foo' => 'bar',
        'i_love' => 'lamp',
        'id' => 42
    ];
    $dateTime = new DateTime();
    $i1 = $firebase->set($DEFAULT_PATH . '/' . $dateTime->format('c'), $test);

    // --- storing a string ---
    $i2 = $firebase->set($DEFAULT_PATH . '/name/contact001', 'John Doe');

    // --- reading the stored string ---
    $name = $firebase->get($DEFAULT_PATH . '/name/contact001');

    return [$i1, $i2, $name];
}
?>