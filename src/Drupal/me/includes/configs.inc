<?php
require_once ( dirname(__FILE__) . '/utility.inc');
require_once ( dirname(__FILE__) . '/test.inc');
// require_once ( dirname(__FILE__) . '/functions.inc');

// qrcode
require_once ( dirname(__FILE__) . '/../libraries/qrcode/qrlib.php');

// -------- ApnsPHP
require_once ( dirname(__FILE__) . '/../libraries/ApnsPHP/Autoload.php');

// -------- Firebase Firestore
use Google\Cloud\Firestore\FirestoreClient;

/*
* hook_init()
*/
function me_init(){
	// global $user;
	// dpm($user);
	
  
	// dpm(_test_firebase());
  
	// $contents = file_get_contents('ls -l');
	// echo "<pre>";
	// echo exec('python /home/somkid/fb-id.py  2>&1', $output);
	// echo $output;
	// echo "</pre>";
	// echo "vv";
  
	// $process = new Process('pwd');
	// dpm($process->start());
	// --------- shell_exec ----------
	/*
	$output =  shell_exec("python /home/somkid/fb-id.py 'CoCohSmile' 2>&1");
	dpm($output);
  
	// เราจะได้ ค่า $output = ['xxxx'] โดยเราจะใช้คำสั่ง preg_match_all เพือดึง 'xxxx' ออกมา
	preg_match_all('/".*?"|\'.*?\'/', $output, $matches);
	print_r($matches[0][0]);
	*/
	// --------- shell_exec ----------
	
  
	// $pid = pcntl_fork();
	// echo "<pre>";
	// var_dump(user_password(6));
	// echo "</pre>";
  
	// $iPod = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
	// $iPhone = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
	// $iPad = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
	// $Android= stripos($_SERVER['HTTP_USER_AGENT'],"Android");
  
	// // //check if user is using ipod, iphone or ipad...
	// if( $iPod || $iPhone || $iPad ){
	//   echo "$iPod || $iPhone || $iPad";
	// }else if($Android){
	//   echo "$Android";
	// }
  
	// echo $pid = pcntl_fork();
  
	// $pid = pcntl_fork(); // fork
	// if ($pid > 0) { // child
  
	//     $sid = posix_setsid();
	//     if ($sid > 0) {
	//         $daemon->run();
	//     }
	// }
  
	// $pid = pcntl_fork();
  
	// $firebase = new \Firebase\FirebaseLib(FIREBASE_DEFAULT_URL);
	
	// $to = config_pages_get('configure_idna', 'field_config_tag');
	// dpm($to);
	
	// $values = array("profiles"=>array(
	//                       "name"            => '$account->name',
	//                       "mail"            => '$account->mail',
	//                       "udid"            => 'auto-udid',
	//                       "platform"        => 'auto-platform',
	//                       "bundleidentifier"=> 'auto-bundleidentifier',
	//                       "version"         => 'auto-version',
	//                       "create"          => time(),
	//                       "update"          => time()
	//                     ));
		  
	// dpm($firebase->set(FIREBASE_DEFAULT_PATH . FIREBASE_LOGIN_PATH . 444 . '/', $values));
	// $vocabulary = taxonomy_vocabulary_machine_name_load('tags_friend_status');
	// $terms = entity_load('taxonomy_term', FALSE, array('vid' => $vocabulary->vid));
  
	// dpm($terms);
	
	// define("IS_DEBUG", 1);
	
	global $debug;
	$debug = 1;
  
	if ($debug) {
	  define("CONFIG_PAGES_TYPE", "configure_idna_development");
  
	  define("TAG", config_pages_get(CONFIG_PAGES_TYPE, 'field_config_tag_dev'));
	  define("DEFUALT_IOS_URL_STORE_IDNA", config_pages_get(CONFIG_PAGES_TYPE, 'field_defualt_ios_url_store_dev'));
	  define("DEFUALT_ANDROID_URL_STORE_IDNA", config_pages_get(CONFIG_PAGES_TYPE, 'field_android_url_store_idna_dev'));
	  define("FIREBASE_URL", config_pages_get(CONFIG_PAGES_TYPE, 'field_firebase_default_url_dev'));
  
	  define("CLOUD_MESSAGEING_KEY", config_pages_get(CONFIG_PAGES_TYPE, 'field_cloud_messaging_key_dev'));
  
	  // field_apn_certificate_dev
	  define("APN_CERTIFICATE", $_SERVER['DOCUMENT_ROOT'] . substr(file_create_url(config_pages_get(CONFIG_PAGES_TYPE, 'field_apn_certificate_dev')['uri']), strlen($GLOBALS['base_url'])));
	
		// Firestore Dev
		define("FIRESTORE_PROJECT_ID", config_pages_get(CONFIG_PAGES_TYPE, 'field_firestore_project_id_dev'));
		define("FIRESTORE_AUTHENTICATION", $_SERVER['DOCUMENT_ROOT'] . substr(file_create_url(config_pages_get(CONFIG_PAGES_TYPE, 'field_firestore_auth_dev')['uri']), strlen($GLOBALS['base_url'])));
	
	}else{
	  define("CONFIG_PAGES_TYPE", "configure_idna");
  
	  define("TAG", config_pages_get(CONFIG_PAGES_TYPE, 'field_config_tag'));
	  define("DEFUALT_IOS_URL_STORE_IDNA", config_pages_get(CONFIG_PAGES_TYPE, 'field_defualt_ios_url_store_idna'));
	  define("DEFUALT_ANDROID_URL_STORE_IDNA", config_pages_get(CONFIG_PAGES_TYPE, 'field_android_url_store_idna'));
	  define("FIREBASE_URL", config_pages_get(CONFIG_PAGES_TYPE, 'field_firebase_default_url'));
  
	  define("CLOUD_MESSAGEING_KEY", config_pages_get(CONFIG_PAGES_TYPE, 'field_cloud_messaging_key'));
  
	  define("APN_CERTIFICATE", $_SERVER['DOCUMENT_ROOT'] . substr(file_create_url(config_pages_get(CONFIG_PAGES_TYPE, 'field_apn_certificate')['uri']), strlen($GLOBALS['base_url'])));
	
	
		// Firestore Dev
		define("FIRESTORE_PROJECT_ID", config_pages_get(CONFIG_PAGES_TYPE, 'field_firestore_project_id'));
		define("FIRESTORE_AUTHENTICATION", $_SERVER['DOCUMENT_ROOT'] . substr(file_create_url(config_pages_get(CONFIG_PAGES_TYPE, 'field_firestore_auth')['uri']), strlen($GLOBALS['base_url'])));
	} 
  
	define("DEFUALT_PASSWORD", "HEARTIDNA");
	define("LENGTH_CHAT_ID", "20");
	define("QRCODE_SECRET_KEY", "aaa04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3");
	define("QRCODE_SECRET_IV", "bbb04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3");
	define("PATH_FOLDER_QRCODE", "sites/default/files/qrcode");
  
	define("FIREBASE_DEFAULT_PATH", '/idna/');
	define("FIREBASE_LOGIN_PATH", 'user/');
	define("FIREBASE_MY_APPLIPATIONS_PATH", 'my_applications/');
	define("FIREBASE_MY_APPLIPATIONS_POSTS_PATH", 'posts/');
  
	define("FIREBASE_CENTER_CHAT", 'center_chat/'); 
  
	// comments
	define("FIREBASE_MY_APPLIPATIONS_POSTS_COMMENTS_PATH", 'comments/');
  
	define("FIREBASE_CENTER", 'center/'); 
	define("FIREBASE_CENTER_SLIDE", 'center-slide/'); 
	define("FIREBASE_VOIP", 'voip/'); 
  
  
	// Chat groups
	define("FIREBASE_CHAT_GROUPS", 'chat_groups/'); 
  
  
	define("PATH_GROUPS", "groups");
	define("PATH_CLASSS", "classs");
	define("PATH_FOLLOWING", "following");
  
  
	// Bundle Identifier  
	// define("BI_IOS_BASIC", "heart.basic");
	
	define("BI_IOS_CHAT", "heart.chat");
	// define("BI_ANDROID_BASIC", "heart.basic");
  
  
	// define("BI_IOS_IDNA", "heart.idna");
	// define("BI_ANDROID_IDNA", "heart.idna");
  
	define("BUNDLE_IDENTIFIER", "heart.idna");
  
	// define("DEFUALT_LENGTH_CHAT_ID", 20); 
  
	// เป็น password ทีใช้ เข้าระบบ string uid ของ user ทีใช้สำหรับสร้าง  QRCode
	// define("QRCODE_SECRET_KEY", "aaa04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3");
	// define("QRCODE_SECRET_IV", "bbb04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3");
  
	define("FRIEND_STATUS_FRIEND", "10");
	define("FRIEND_STATUS_FRIEND_CANCEL", "13");
	define("FRIEND_STATUS_FRIEND_REQUEST", "11");  
	define("FRIEND_STATUS_WAIT_FOR_A_FRIEND", "12");  
	
	
	// Firestore
	define("FIRESTORE_USERS", "users");
	define("FIRESTORE_PROFILES", "profiles");
	define("FIRESTORE_DEVICE_ACCESS", "device_access");

	define("FIRESTORE_MY_APPLIPATIONS", 'my_applications');
	define("FIRESTORE_CLASSS", "classs");
	define("FIRESTORE_FRIENDS", "friends");
  
	if ($debug) {
	  /*
	  mr.simajarn@gmail.com
  
	  FRIENDLY NAME
	  iDNA Development - Video
  
	  SID
	  SK620d550fb90459e6da0fe460e955d800
  
	  KEY TYPE
	  Standard
  
	  SECRET
	  seRvEwi0MvQ991iSCtq8KmxcmYr2SHk6
	  */
  
	  define("TWILIO_ACCOUNT_SID", "ACe35b4dd61ff6875ce26ee0e3ea9dd4dc");
	  define("TWILIO_API_KEY", "SK620d550fb90459e6da0fe460e955d800");
	  define("TWILIO_API_KEY_SECRET", "seRvEwi0MvQ991iSCtq8KmxcmYr2SHk6");
	  define("TWILIO_PUSH_CREDENTIAL_SID", "");
	  define("TWILIO_APP_SID", "AP5a5464cc136a4ac7877886a4f1d3df0c");
	}else{
	  /*
	  android.somkid@gmail.com
	  */
	  define("TWILIO_ACCOUNT_SID", "AC94429faf5d0c017fdde2eb9347c699e6");
	  define("TWILIO_API_KEY", "SK5b11e67487ccf92915a1ede27b640dfa");
	  define("TWILIO_API_KEY_SECRET", "QuGFTh7pvRKUV9VeFwC6FmIoGjXiFwcC");
	  define("TWILIO_PUSH_CREDENTIAL_SID", "CR6279daf7d3f608853b78f863fd7dc995");
	  define("TWILIO_APP_SID", "AP30c22ca482e1db49ceac6cd2ff19c37c");
	}
  
	// define("APN_CERTIFICATE", config_pages_get(CONFIG_PAGES_TYPE, 'field_apn_certificate'));
	// dpm(config_pages_get(CONFIG_PAGES_TYPE, 'field_apn_certificate'));
	// $url_apn_certificate = file_create_url(config_pages_get(CONFIG_PAGES_TYPE, 'field_apn_certificate')['uri']);
	// dpm($url_apn_certificate);
  
	
	global $firebase;
  
	/*
	เป็นการ load library firebase ในครั้งเท่านั้น
	*** การใช้งาน
	  เราต้อง ประกาศ global $firebase ถึงเราจะสามารถนําไปใช้งานได้
	*/
	$firebase = new \Firebase\FirebaseLib(FIREBASE_URL);
	
	// $firebase = new \Firebase\FirebaseLib('https://rn-ui-a37a1.firebaseio.com');
  
  //   watchdog(TAG, 'FIREBASE_URL >  : %message', array('%message'=> serialize($firebase) ), WATCHDOG_INFO);
   
  //   $test = [
  //     'foo' => 'bar',
  //     'i_love' => 'lamp',
  //     'id' => 42
  // ];
  // $dateTime = new DateTime();
  // $i1 = $firebase->set($DEFAULT_PATH . '/' . $dateTime->format('c'), $test);
	// dpm($firebase->get());
	/*
	module_load_include('module', 'opentok', 'opentok');
  
	$opentok_api_key = variable_get('opentok_api_key', NULL);
	$sessionId = opentok_create_session("1")->__toString();
  
	echo "opentok_api_key : " . $opentok_api_key . '</br>';
	echo "sessionId : " . $sessionId . '</br>';
	echo "opentok_get_token : " . opentok_get_token($sessionId);
	*/
  
	// test_image_style_url();
  
	/*
	// ffmpeg_video_thumbnail_extract_frame
	try{
	  // $ffmpeg = php_ffmpeg();
	  // $video = $ffmpeg->open('public:///20180416_693282359.mp4');
  
	  // dpm($video);
  
	  #1
	  $file = file_load('1108603');
	  // $uri = $file->uri;
  
	  //dpm($file->uri);
  
	  dpm(ffmpeg_thumbnail_extract_frame($file));
	  
  
	  #2
	  $ffmpeg = php_ffmpeg();//->create();
	  // dpm($ffmpeg->create());
	  // $video = $ffmpeg->open($file->uri);
  
	  $video = $ffmpeg->open('sites/default/files/video_001.mp4');
	  // $video_stream = $video->getStreams()->videos()->first();
  
	  $at = FFMpeg\Coordinate\TimeCode::fromSeconds(1);
  
	  // dpm($video_stream);
	  // dpm($at);
  
	  $v = $video
		->frame($at)
		->save('sites/default/files/z.png');
  
	  dpm($v);
	  
  
	  // dpm(get_class_methods($ffmpeg));
	}
	catch (Exception $e) {
	  // throw new RuntimeException(t('Error while extracting frame from @file, check php_ffmpeg log.', array('@file' => $file['uri'])), 0, $e);
	  dpm( $e->getMessage() );
	}
	*/
  
	// $video = $ffmpeg->open('/sites/default/files/20180415_977316720.mp4');
	// dpm($video);
  
	// module_load_include('module', 'ffmpeg_video_thumbnail', 'ffmpeg_video_thumbnail');
  
	// $path = ffmpeg_video_thumbnail_extract_frame('/sites/default/files/20180415_977316720.mp4', 1);
	// dpm($path);

	
  
	dpm(___test());


	// $db = firestore_db();
	// $docRef = $db->collection('people')->document('lovelace3');
	// $output = $docRef->set([
	// 		'first2' => 'Ada',
	// 		'last2' => 'Lovelace',
	// 		'born2' => 1815
	// ]);

	// dpm($output);
} 

/*
 * เป็น connection firestore db
 *  */
function firestore_db(){
	global $debug;
	// echo "debug : " . $debug ;

	$projectId = FIRESTORE_PROJECT_ID;
	$keyFilePath = FIRESTORE_AUTHENTICATION;
	$db = new FirestoreClient([
			'projectId' => $projectId,
			'keyFilePath' => $keyFilePath
	]);

	return $db;
}

function ___test(){
	// dpm(config_pages_get('configure_idna_development', 'field_cloud_messaging_key_dev'));
	
	// dpm(FIRESTORE_PROJECT_ID);
	// dpm(FIRESTORE_AUTHENTICATION);
	// return dirname(__FILE__).'/../';

	// exists()

	// firestore_db()->collection('products')->get().then(res =>{
	//  console.log(res.size)
	// })

	// firestore_db().collection("people").get().then(function(querySnapshot) {      
	// 	console.log(querySnapshot.size); 
	// });

	// $collection = firestore_db()->collection('people');
	// dpm($collection->get());

	
	
	// $people = firestore_db()->collection('people')->document('lovelace3');

	/*
	// echo $people->exists();
	// dpm($people->exists());

	$snapshot = $people->snapshot();

	// dpm(get_object_vars($snapshot));
	// dpm($snapshot->exists());
	if ($snapshot->exists()) {
		dpm($snapshot->data());
	}else{
		dpm($snapshot->id());
	}

	*/

	
	// if ($snapshot->exists()) {
	// 	printf('Document data:' . PHP_EOL);
	// 	print_r($snapshot->data());
	// } else {
	// 	printf('Document %s does not exist!' . PHP_EOL, $snapshot->id());
	// }


	// $profile = profile2_by_uid_load(548955, 'main');
	// dpm($profile);

	return "__test_";
}

?>