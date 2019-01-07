<?php
use Google\Cloud\Firestore\FirestoreClient;

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

function test_function(){
    // $db = new FirestoreClient();
    // Authenticate using a keyfile path
    // $cloud = new ServiceBuilder([
    //     'keyFilePath' => '/var/www/html/RNUI-ff2d34405d3d.json'
    // ]);
    // dpm($cloud);

    // $firestore = new FirestoreClient();
    // dpm($firestore);

    $projectId = FIRESTORE_PROJECT_ID;
    $keyFilePath = FIRESTORE_AUTHENTICATION;//dirname(__FILE__) . '/RNUI-ff2d34405d3d.json';
    $db = new FirestoreClient([
        'projectId' => $projectId,
        'keyFilePath' => $keyFilePath
    ]);

    $docRef = $db->collection('people')->document('lovelace2');
    $output = $docRef->set([
        'first2' => 'Ada',
        'last2' => 'Lovelace',
        'born2' => 1815
    ]);
    // dpm($output);
    // dpm(dirname(__FILE__) . '/RNUI-ff2d34405d3d.json');
    return "test_function";
}
?>