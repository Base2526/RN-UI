<?php
require_once ( dirname(__FILE__) . '/configs.inc');

/*
 * hook_help()
 * /
function me_help($path, $arg){
	switch ($path) {
	  case 'admin/help#me':
		return t('Module me');
	  default:
		break;
	}
}
  
/*
 * Implements hook_permission().
 */
function me_permission() {
	return array(
		'me_permission' => array(
		'title' => t('me permissions'),
		),
		'idna_reset_heart_permission' => array(
		'title' => t('Reset Heart.'),
		)
	);
}
 
/*
  hook_mail
  Refer : http://drupal.stackexchange.com/questions/103892/passing-variables-in-drupal-mail
*/
function me_mail($key, &$message, $params) {
	// global $user;
  
	// Each message is associated with a language, which may or may not be the
	// current user's selected language, depending on the type of e-mail being
	// sent. This $options array is used later in the t() calls for subject
	// and body to ensure the proper translation takes effect.
	$options = array(
	  'langcode' => LANGUAGE_NONE/*$message['language']->language*/,
	);
  
	watchdog(TAG, 'me_mail > key : %key', array('%key'=> $key), WATCHDOG_INFO);
  
	switch ($key) {
	  // Send a simple message from the contact form.
	  case 'contact_message':{
		$message['subject'] = t('E-mail sent from @site-name', array('@site-name' => variable_get('site_name', 'Drupal')), $options);
		// Note that the message body is an array, not a string.
		$message['body'][] = t('Code verify = @key', array('@key' => $params['verify_key']), $options);
		$message['body'][] = t('Password    = @key', array('@key' => $params['verify_key']), $options);
		$message['body'][] = t('--  @site-name team', array('@site-name' => variable_get('site_name', 'Drupal')), $options);
		// Because this is just user-entered text, we do not need to translate it.
		// Since user-entered text may have unintentional HTML entities in it like
		// '<' or '>', we need to make sure these entities are properly escaped,
		// as the body will later be transformed from HTML to text, meaning
		// that a normal use of '<' will result in truncation of the message.
		$message['body'][] = check_plain($params['message']);
  
		watchdog(TAG, 'idna_mail > contact_message : %message', array('%message'=> serialize($message)), WATCHDOG_INFO);
	  }
		break;
  
	  case 'user_forgot_password':{
		$message['subject'] = t('Replacement login information for @name at @site-name', array('@name' => $params['name'], '@site-name' => variable_get('site_name', 'Drupal')), $options);
		// Note that the message body is an array, not a string.
		$message['body'][] = t('New Password    = @key', array('@key' => $params['verify_key']), $options);
		$message['body'][] = t('--  @site-name team', array('@site-name' => variable_get('site_name', 'Drupal')), $options);
		// Because this is just user-entered text, we do not need to translate it.
		// Since user-entered text may have unintentional HTML entities in it like
		// '<' or '>', we need to make sure these entities are properly escaped,
		// as the body will later be transformed from HTML to text, meaning
		// that a normal use of '<' will result in truncation of the message.
		$message['body'][] = check_plain($params['message']);
  
  
  
		watchdog(TAG, 'me_mail > user_forgot_password : %message', array('%message'=> serialize($message)), WATCHDOG_INFO);
  
	  }
	  break;
	}
}
  
/*
  สร้าง Class ของแต่ละ Account
*/
function create_class(){
	$result = array();
  
	if (!check_header()) {
	  $result['result'] = FALSE;
	  $result['message']= "check_header()";
	  return $result;
	}
  
	// if (empty($_REQUEST['uid']) || empty($_REQUEST['fction'])|| empty($_REQUEST['name']) ) {
	  $result['result'] = FALSE;
	  $result['message']  = "function : create_class, parameter";
	  $result['_REQUEST'] = $_REQUEST;
	  return $result;
	// }
  
	global $firebase;
  
	$uid    = $_REQUEST['uid'];
	$fction = $_REQUEST['fction'];
	$item_id= $_REQUEST['item_id'];
	$name   = $_REQUEST['name'];
	// $image  = $_REQUEST['image'];
  
	switch ($fction) {
	  case 'add':{
		  $profile = profile2_by_uid_load($uid, 'main');
  
		  $values = array();
		  $values['field_name'] = 'field_field_my_class'; 
  
		  /*
		  $image_url = array();
		  if($image != ""){
  
			// http://stackoverflow.com/questions/8241242/drupal-7-upload-image-programatically
			$binary = base64_decode($image);
  
			//Create the directory if it does not already exist, otherwise check the permissions
			$directory = 'public://';
			file_prepare_directory($directory, FILE_CREATE_DIRECTORY);
  
			$currentDate = date("Ymd");
			$file_name  = $currentDate .'_'. rand(0, 999) . rand(0, 999) . rand(0, 999) . ".png";
			
			//Saves a file to the specified destination and creates a database entry.
			$image_url= (array)klovers_file_save_data($uid, $binary, $directory. '/' . $file_name, FILE_EXISTS_RENAME);
		  */
  
		  $image_url = array();
		  if(!empty($_FILES["idna"])){
			// http://stackoverflow.com/questions/8241242/drupal-7-upload-image-programatically
			$binary =  file_get_contents($_FILES["idna"]["tmp_name"]);//base64_decode($image);
  
			//Create the directory if it does not already exist, otherwise check the permissions
			$directory = 'public://';
			file_prepare_directory($directory, FILE_CREATE_DIRECTORY);
  
			$currentDate = date("Ymd");
			$file_name  = $currentDate .'_'. rand(0, 999) . rand(0, 999) . rand(0, 999) . ".png";
			
			//Saves a file to the specified destination and creates a database entry.
			$image_url = (array)klovers_file_save_data($uid, $binary, $directory. '/' . $file_name, FILE_EXISTS_RENAME);
  
			// save รูป profile
			// $profile->field_profile_image[LANGUAGE_NONE][0] = (array)$file;
  
			// #1 field_name_group
			$values['field_class_name'][LANGUAGE_NONE][0]['value'] = $name;
  
			// #2 field_class_image_profile
			$values['field_class_image_profile'][LANGUAGE_NONE][0] = $image_url;
  
			$values['field_is_default'][LANGUAGE_NONE][0]['value'] = "0";
			
		
			// Create the field collection entry and associate it with the profile
			$field_entity = entity_create('field_collection_item', $values);
			$field_entity->setHostEntity('profile2', $profile);
			$field_entity->save();
		   
			// เป็น node id ของ group
			$item_id = $field_entity->item_id;
  
			// $url = substr(file_create_url(image_style_url('medium', $image_url['uri'])), strlen($GLOBALS['base_url']));
			$value = array(      
				"name"     => $name,
				"is_defualt"=>"0",
				// "image_url"=> substr(file_create_url(image_style_url('medium', $image_url['uri'])), strlen($GLOBALS['base_url']))
				"image_url"=> file_create_url(image_style_url('medium', $image_url['uri']))
			);
  
			$firebase->set(FIREBASE_DEFAULT_PATH . FIREBASE_LOGIN_PATH . $uid . '/' . PATH_CLASSS . '/' . $item_id . '/' , $value);
  
			$result['result'] = TRUE;
			$result['item_id']= $item_id;
			$result['value']  = $value;
			$result['fction'] = $fction;
  
			return  $result;
  
		  }else{
			$result['result'] = FALSE;
			return  $result;
		  }
		}
		break;
  
	  case 'edit':{
		  // field_field_my_class
  
		  $item_load = field_collection_item_load($item_id);
		  if ($item_load) {
			$wrapper = entity_metadata_wrapper('field_collection_item', $item_load);
  
			if(strcmp($item_load->field_class_name[LANGUAGE_NONE][0]['value'], $name) !== 0){
			  $wrapper->field_class_name->set($name);
			}   
  
			$value = array();
  
			$value["name"]    = $name;
  
			/*
			if($image != ""){
			  // http://stackoverflow.com/questions/8241242/drupal-7-upload-image-programatically
			  $binary = base64_decode($image);
  
			  //Create the directory if it does not already exist, otherwise check the permissions
			  $directory = 'public://';
			  file_prepare_directory($directory, FILE_CREATE_DIRECTORY);
  
			  $currentDate = date("Ymd");
			  $name  = $currentDate .'_'. rand(0, 999) . rand(0, 999) . rand(0, 999) . ".png";
			  
			  //Saves a file to the specified destination and creates a database entry.
			  $image_url= (array)klovers_file_save_data($uid, $binary, $directory. '/' . $name, FILE_EXISTS_RENAME);
			  */
  
			$image_url = array();
			if(!empty($_FILES["idna"])){
			  // http://stackoverflow.com/questions/8241242/drupal-7-upload-image-programatically
			  $binary =  file_get_contents($_FILES["idna"]["tmp_name"]);//base64_decode($image);
  
			  //Create the directory if it does not already exist, otherwise check the permissions
			  $directory = 'public://';
			  file_prepare_directory($directory, FILE_CREATE_DIRECTORY);
  
			  $currentDate = date("Ymd");
			  $file_name  = $currentDate .'_'. rand(0, 999) . rand(0, 999) . rand(0, 999) . ".png";
			  
			  //Saves a file to the specified destination and creates a database entry.
			  $image_url = (array)klovers_file_save_data($uid, $binary, $directory. '/' . $file_name, FILE_EXISTS_RENAME);
  
			  // save รูป profile
			  // $profile->field_profile_image[LANGUAGE_NONE][0] = (array)$file;
  
			  $wrapper->field_class_image_profile->set($image_url);
			  // $value['image_url'] =  substr(file_create_url(image_style_url('medium', $image_url['uri'])), strlen($GLOBALS['base_url']));
  
			  $value['image_url'] =  file_create_url(image_style_url('medium', $image_url['uri']));
  
			}
  
			$wrapper->save();
			  
			$firebase->update(FIREBASE_DEFAULT_PATH . FIREBASE_LOGIN_PATH . $uid . '/' . PATH_CLASSS . '/' . $item_id .'/' , $value);
  
			$result['result'] = TRUE;
			$result['item_id']= $item_id;
			$result['value']  = $value;
			$result['fction'] = $fction;
			return  $result;
		  }
		}
		break;
	  
	  default:
		# code...
		break;
	}  
}
  
/*
 ถุกเรียกใช้ firebase เท่านั้น
*/
function update_user_chat_group(){
	$result = array();
  
	if (!check_header()) {
	  $result['result'] = FALSE;
	  $result['message']= "check_header()";
	  return $result;
	}
  
	/*
	if (empty($_REQUEST['uid']) || empty($_REQUEST['group_id']) || empty($_REQUEST['data'])) {
	  $result['result'] = FALSE;
	  $result['message']  = "function : update_user_chat_group, parameter";
	  return $result;
	}
	*/
  
	$param = json_decode(file_get_contents('php://input'), true);
	if (empty($param['uid']) || empty($param['chat_group_id']) || empty($param['data'])) {
	  $result['result'] = FALSE;
	  $result['message'] = "function update_user_chat_group : parameter";
	  return $result;
	}
  
	global $firebase;
	$uid      = $param['uid'];
	$chat_group_id = $param['chat_group_id'];
	$data     = $param['data'];
  
	
	// การ Update Profile types > field_chat_group > field_mg_status
	$chat_group_item = field_collection_item_load($data['item_id']);
	$chat_group_wrapper = entity_metadata_wrapper('field_collection_item', $chat_group_item);
	$chat_group_wrapper->field_mg_status->set($data['status']);
	$chat_group_wrapper->save();
  
	// Update node {chat_group} > field_members_group > field_mg_status
  
  // field_members_group
	$i = array();
	$path = '';
	$chat_group_node = node_load($chat_group_id);
	foreach ($chat_group_node->field_members_group[LANGUAGE_NONE] as $chat_group_k => $chat_group_v) {
	  $i[] = $chat_group_v['value'];
	  $chat_group_item_load = field_collection_item_load($chat_group_v['value']);
	  if (strcasecmp($chat_group_item_load->field_members_group_friend_id[LANGUAGE_NONE][0]['value'], $uid) == 0) {
		$chat_group_item_load_wrapper = entity_metadata_wrapper('field_collection_item', $chat_group_item_load);
		$chat_group_item_load_wrapper->field_mg_status->set($data['status']);
		$chat_group_item_load_wrapper->save();
  
		// Update firebase idna > chat_groups > {node_id} > members > {item_id} > status = $data['status']
		$firebase->update(FIREBASE_DEFAULT_PATH . FIREBASE_CHAT_GROUPS . '/' . $chat_group_id .'/members/'. $chat_group_v['value'] .'/', array('status'=>$data['status']));
  
		$path  = FIREBASE_DEFAULT_PATH . FIREBASE_CHAT_GROUPS . '/' . $chat_group_id .'/members/'. $chat_group_v['value'] .'/';
  
		break;
	  }
	}
  
	$result['path'] =$path;
	$result['i']    =$i;
  
	$result['result'] = TRUE;
	$result['$param'] = $param;
	return  $result;
}
  
/*
   ถุกเรียกใช้จาก firebase เท่านั้น
   แก้ไข, เพิ่มเติม field friend ของ user
*/
function user_for_friend_editupdate(){
	$result = array();
  
	if (!check_header()) {
	  $result['result'] = FALSE;
	  $result['message']= "check_header()";
	  return $result;
	}
  
	/*
	if (empty($_REQUEST['uid']) || empty($_REQUEST['friend_id']) || empty($_REQUEST['data'])) {
	  $result['result'] = FALSE;
	  $result['message']  = "function : user_for_friend_editupdate, parameter";
	  return $result;
	}
  
	global $firebase;
  
	$uid        = $_REQUEST['uid'];
	$friend_id  = $_REQUEST['friend_id'];
	$data     = $_REQUEST['data'];
	*/
  
	// $param = json_decode(file_get_contents('php://input'), true);
	// if (empty($param['uid']) || empty($param['friend_id']) || empty($param['data'])) {
	//   $result['result'] = FALSE;
	//   $result['message'] = "function update_friend_of_user : parameter";
	//   return $result;
	// }
	// $result['result'] = TRUE;
	// $result['param'] = $param;
	// $result['_REQUEST'] = $_REQUEST;

	// $newValue = $_REQUEST['newValue'];
	// $data = $_REQUEST['context']['params']; // userId, friendId
	// // context
	// return $result;

	$param = $_REQUEST['context']['params'];

	if (empty($param['userId']) || empty($param['friendId'])) {
	  $result['result'] 	= FALSE;
		$result['message'] 	= "function update_friend_of_user : parameter";
		$result['param'] 		= $param;
	  return $result;
	}
  
	$uid        = $param['userId'];
	$friend_id  = $param['friendId'];
	$data       = $_REQUEST['newValue'];
  
	/*
	// ลบ group ออกตาม group id
	$data_item_load = field_collection_item_load($_REQUEST['group_id']);
  
	$wrapper = entity_metadata_wrapper('field_collection_item', $data_item_load);    
	entity_delete_multiple('field_collection_item', array($wrapper->getIdentifier()));
	*/
  
	if (!array_key_exists("item_id", $data)) {
	  # code...
	  $result['result'] = FALSE;
	  return $result;
	}
  
	$item_id = $data['item_id'];
  
	$data_item = field_collection_item_load($item_id);
	if ($data_item) {
		$wrapper = entity_metadata_wrapper('field_collection_item', $data_item);
  
		if (array_key_exists('block', $data)) {
		  if (strcmp($wrapper->field_profile_friends_is_block->value(), $data['block']) != 0) {
			$wrapper->field_profile_friends_is_block->set($data['block']);
			$wrapper->save();
		  }
		}else{
		  $wrapper->field_profile_friends_is_block->set("0");
		  $wrapper->save();
		}
  
		if (array_key_exists('hide', $data)) {
		  if (strcmp($wrapper->field_profile_friends_is_hide->value(), $data['hide']) != 0) {
			$wrapper->field_profile_friends_is_hide->set($data['hide']);
			$wrapper->save();
		  }
		}else{
		  $wrapper->field_profile_friends_is_hide->set("0");
		  $wrapper->save();
		}
  
		if (array_key_exists('change_friends_name', $data)) {
		  if (strcmp($wrapper->field_change_friend_name->value(), $data['change_friends_name']) != 0) {
			$wrapper->field_change_friend_name->set($data['change_friends_name']);
			$wrapper->save();
		  }
		}else{
		  $wrapper->field_change_friend_name->set("");
		  $wrapper->save();
		}
  
  
		if (array_key_exists('classs', $data)) {
		  if (strcmp($wrapper->field_profile_friend_classs->value(), $data['classs']) != 0) {
			$wrapper->field_profile_friend_classs->set($data['classs']);
			$wrapper->save();
		  }
		}else{
		  $wrapper->field_profile_friend_classs->set("");
		  $wrapper->save();
		}
  
		if (array_key_exists('status', $data)) {
  
		  // watchdog(TAG, '<< ||| >> : %account', array('%account'=> $wrapper->field_friend_status->value()->tid), WATCHDOG_INFO);
  
		 if (strcmp($wrapper->field_friend_status->value()->tid, $data['status']) != 0) {
			$wrapper->field_friend_status->set($data['status']);
			$wrapper->save();
  
  
			/*
			เราต้องมาวิเคราะห์ status ด้วย
  
			มาถึงขั้นตอนนี้เรา ต้องการ update 2 จุด คือ update database ของเพือน และ firebase ของเพือน
				 
			switch ($data['status']) {
			  case FRIEND_STATUS_FRIEND:{
  
					// load profile ของเพือนขึ้นมา
					$profile_friend = profile2_by_uid_load($friend_id, 'main');
  
					foreach ($profile_friend->field_profile_friends[LANGUAGE_NONE] as $key => $value) {
					  // Build array of field collection values.
  
					  $val = field_collection_item_load($value['value']);
  
					  // จะดึงที่ field_friend_uid = $uid แก้ใข friend status
					  if($val->field_friend_uid[LANGUAGE_NONE][0]['value'] == $_POST['uid_friend']){
						$wrapper = entity_metadata_wrapper('field_collection_item', $val);
						$wrapper->field_friend_status->set($data['status']);
						$wrapper->save();
  
						$values = array(
							"status" => FRIEND_STATUS_FRIEND,
							"update" => time()
						  );
						$firebase->update(FIREBASE_DEFAULT_PATH . FIREBASE_LOGIN_PATH . $friend_id . '/friends/', $values);
					  }
					}
				}
				break;
			  
			  default:
				# code...
				break;
			}
			*/
  
			
		  }
		}
  
		if (array_key_exists('favorite', $data)) {
		  if (strcmp($wrapper->field_profile_friends_favorite->value(), $data['favorite']) != 0) {
			$wrapper->field_profile_friends_favorite->set($data['favorite']);
			$wrapper->save();
		  }
		}
	}
  
	$result['result'] = TRUE;
	return  $result;
}
  
/*
   ถุกเรียกใช้จาก firebase เท่านั้น
   ลบเพือน
*/
function user_for_friend_delete(){
	$result = array();
  
	if (!check_header()) {
	  $result['result'] = FALSE;
	  $result['message']= "check_header()";
	  return $result;
	}
  
	// watchdog(TAG, 'user_for_friend_delete header: %header', array('%header'=> serialize($_REQUEST)), WATCHDOG_INFO);
  
  
	if (empty($_REQUEST['uid']) || empty($_REQUEST['friend_id'])) {
	  $result['result'] = FALSE;
	  $result['message']  = "function : user_for_friend_delete, parameter";
	  return $result;
	}
  
	global $firebase;
	$uid        = $_REQUEST['uid'];
	$friend_id  = $_REQUEST['friend_id'];
  
	// # 1 -- เป็นการลบเพือนของเราที่ friend_id ตรงกัน
	$profile = profile2_by_uid_load($uid, 'main');
	foreach ($profile->field_profile_friends[LANGUAGE_NONE] as $key => $value) {
	  // ดึงเพือนมาทั้งหมด
	  $data_item_load = field_collection_item_load($value['value']);
	  if (strcmp($data_item_load->field_friend_uid[LANGUAGE_NONE][0]['value'], $friend_id) == 0) {
		$wrapper = entity_metadata_wrapper('field_collection_item', $data_item_load);    
		entity_delete_multiple('field_collection_item', array($wrapper->getIdentifier()));
		break;
	  }
	}
	// # 1 -- เป็นการลบเพือนของเราที่ friend_id ตรงกัน
  
	// # 2 -- เป็นการลบเพือนของเพือนที่ uid ตรงกัน
	$profile = profile2_by_uid_load($friend_id, 'main');
	foreach ($profile->field_profile_friends[LANGUAGE_NONE] as $key => $value) {
	  // ดึงเพือนมาทั้งหมด
	  $data_item_load = field_collection_item_load($value['value']);
	  if (strcmp($data_item_load->field_friend_uid[LANGUAGE_NONE][0]['value'], $uid) == 0) {
		$wrapper = entity_metadata_wrapper('field_collection_item', $data_item_load);    
		entity_delete_multiple('field_collection_item', array($wrapper->getIdentifier()));
		break;
	  }
	}
  
	// # 2 -- เป็นการลบเพือนของเพือนที่ uid ตรงกัน
  
	$result['result']   = TRUE;
	return $result;
}
  
/*
	ถุกเรียกใช้ firebase เท่านั้น. delete_member_group_chat
*/
function _delete_chat_group(){
	$result = array();
  
	if (!check_header()) {
	  $result['result'] = FALSE;
	  $result['message']= "check_header()";
	  return $result;
	}
  
	/*
	if (empty($_REQUEST['uid']) || empty($_REQUEST['group_id'])) { // 
	  $result['result'] = FALSE;
	  $result['message']  = "function : delete_chat_group, parameter";
	  return $result;
	}
  
	$uid = $_REQUEST['uid'];
	$group_id = $_REQUEST['group_id'];
  
	// ลบ group ออกตาม group id
	$data_item_load = field_collection_item_load($group_id);
  
	$wrapper = entity_metadata_wrapper('field_collection_item', $data_item_load);    
	entity_delete_multiple('field_collection_item', array($wrapper->getIdentifier()));
	*/
  
	$param = json_decode(file_get_contents('php://input'), true);
	if (empty($param['chat_group_id']) || empty($param['data']) ) {
	  $result['result'] = FALSE;
	  $result['message'] = "function delete_chat_group : parameter";
	  return $result;
	}
  
	global $firebase;
	$chat_group_id= $param['chat_group_id'];
	$data         = $param['data'];
  
  
	node_delete($chat_group_id);
	watchdog(TAG, 'node_delete > delete_chat_group chat_group_id : %chat_group_id', array('%chat_group_id'=>$chat_group_id), WATCHDOG_INFO);  
  
	$data_members = $data['members'];
	foreach ($data_members as $data_members_key => $data_members_value) {
	  $firebase->delete(FIREBASE_DEFAULT_PATH . FIREBASE_LOGIN_PATH . $data_members_value['friend_id'] . '/'. PATH_GROUPS .'/' . $chat_group_id);
	}
  
	$query    = new EntityFieldQuery();
	$entities = $query->entityCondition('entity_type', 'field_collection_item')
				  ->entityCondition('bundle', 'field_chat_group')
				  ->fieldCondition('field_group_id', 'value', $chat_group_id, '=')
				  ->execute();
  
	if (!empty($entities['field_collection_item'])) {
	  // $item_id = array_keys($entities['field_collection_item'])[0];
	  // $data_item = field_collection_item_load($item_id);
  
	  // $wrapper = entity_metadata_wrapper('field_collection_item', $data_item);
	  // $wrapper->field_twilio_room_sid->set($RoomSid);
	  // $wrapper->field_twilio_room_status->set($_REQUEST['StatusCallbackEvent']);
	  // $wrapper->save();
  
	  $items =  array_keys($entities['field_collection_item']);
	  foreach ($items as $key => $value) {
			entity_delete_multiple('field_collection_item', array($value));
	  }
	}
  
	// ลบ ข้อมูล Conversation
	$conversations_query  = new EntityFieldQuery();
	$conversations_result = $conversations_query->entityCondition('entity_type', 'node')
							->entityCondition('bundle', 'conversation')
							->propertyCondition('title', $data['chat_id'], '=')
							// ->propertyCondition('status', 1)
							->execute();
  
	$conversations = array();
	if (!empty($conversations_result['node'])) {
	  $conversations_nids = array_keys($conversations_result['node']);
  
	  foreach ($conversations_nids as $conversations_key => $conversations_nid) { 
		node_delete($conversations_nid);  
  
		watchdog(TAG, 'node_delete > delete_chat_group conversations_nid : %conversations_nid', array('%conversations_nid'=>$conversations_nid), WATCHDOG_INFO);   
	  }
	}
	// ลบ ข้อมูล Conversation
  
  
	// chat_groups
	$firebase->delete('conversation/' . $data['chat_id']);
  
  
	$result['result'] = TRUE;
	$result['param']  = $param;
	$result['path']   = 'conversation/' . $data['chat_id'];
	return  $result;
}
  
/* 
   ถุกเรียกใช้ firebase เท่านั้น. delete_member_group_chat
*/
function delete_member_group_chat(){
	$result = array();
  
	if (!check_header()) {
	  $result['result'] = FALSE;
	  $result['message']= "check_header()";
	  return $result;
	}
  
	if (empty($_REQUEST['uid']) || empty($_REQUEST['group_id']) || empty($_REQUEST['member_id'])) { // 
	  $result['result'] = FALSE;
	  $result['message']  = "function : delete_member_group_chat, parameter";
	  return $result;
	}
  
	$uid = $_REQUEST['uid'];
	$group_id = $_REQUEST['group_id'];
	$member_id = $_REQUEST['member_id'];
  
	// ลบ group ออกตาม group id
	$data_item_load = field_collection_item_load($member_id);
  
	$wrapper = entity_metadata_wrapper('field_collection_item', $data_item_load);    
	entity_delete_multiple('field_collection_item', array($wrapper->getIdentifier()));
  
	$result['result'] = TRUE;
	
	return  $result;
}
  
function delete_classs(){
	$result = array();
  
	if (!check_header()) {
	  $result['result'] = FALSE;
	  $result['message']= "check_header()";
	  return $result;
	}
  
	$param = json_decode(file_get_contents('php://input'), true);
	if (empty($param['uid']) || empty($param['item_id'])) {
	  $result['result'] = FALSE;
	  $result['message'] = "function delete_center_chat : parameter";
	  return $result;
	}
  
	global $firebase;
	$uid        = $param['uid'];
	$item_id    = $param['item_id'];
  
	$profile = profile2_by_uid_load($uid, 'main');
	foreach ($profile->field_profile_friends[LANGUAGE_NONE] as $profile_key => $profile_value) {
	  $profile_item_load = field_collection_item_load($profile_value['value']);
  
	  if (strcasecmp($profile_item_load->field_profile_friend_classs[LANGUAGE_NONE][0]['value'], $item_id) == 0) {
			$profile_wrapper = entity_metadata_wrapper('field_collection_item', $profile_item_load);
			$profile_wrapper->field_profile_friend_classs->set('');
			$profile_wrapper->save();
		
		
			$firebase->delete(FIREBASE_DEFAULT_PATH . FIREBASE_LOGIN_PATH . $uid . '/friends/' . $profile_item_load->field_friend_uid[LANGUAGE_NONE][0]['value'] .'/classs');
	  }
	}
  
  
	// ลบ group ออกตาม group id
	$item_load = field_collection_item_load($item_id);
	if ($item_load) {
	  # code...
	  $wrapper = entity_metadata_wrapper('field_collection_item', $item_load);    
	  entity_delete_multiple('field_collection_item', array($wrapper->getIdentifier()));
	}
  
	$result['result'] = TRUE;
	return  $result;
}
  
function update_picture_chat_group(){ 
	$result = array();
	if (!check_header()) {
	  $result['result'] = FALSE;
	  $result['message']= "check_header()";
	  return $result;
	}
  
	if (empty($_REQUEST['uid']) || empty($_REQUEST['group_id']) || empty($_FILES["idna"]["tmp_name"])) {
	  $result['result']   = FALSE;
	  $result['message']  = "function : update_picture_chat_group, parameter";
	  $result['_REQUEST'] = $_REQUEST;
	  $result['_FILES']   = $_FILES;
	  return $result;
	}
	global $firebase;
  
	$uid      = $_REQUEST['uid'];
	$group_id = $_REQUEST['group_id'];
  
	$time_start = microtime(true);
  
	// http://stackoverflow.com/questions/8241242/drupal-7-upload-image-programatically
	$binary =  file_get_contents($_FILES["idna"]["tmp_name"]);//base64_decode($image);
  
	//Create the directory if it does not already exist, otherwise check the permissions
	$directory = 'public://';
	file_prepare_directory($directory, FILE_CREATE_DIRECTORY);
  
	$currentDate = date("Ymd");
	$file_name  = $currentDate .'_'. rand(0, 999) . rand(0, 999) . rand(0, 999) . ".png";
	  
	  //Saves a file to the specified destination and creates a database entry.
	$image_url = (array)klovers_file_save_data($uid, $binary, $directory. '/' . $file_name, FILE_EXISTS_RENAME);
  
  
	$node         = node_load($group_id);  
	$node_wrapper = entity_metadata_wrapper('node', $node);
	$node_wrapper->field_image_chat_group->set($image_url);
	$node_wrapper->save();
  
	// $uri = substr(file_create_url(image_style_url('medium', $image_url['uri'])), strlen($GLOBALS['base_url']));
	$uri = file_create_url(image_style_url('medium', $image_url['uri']));
	
  
	$firebase->update(FIREBASE_DEFAULT_PATH . FIREBASE_CHAT_GROUPS . '/' . $group_id, array("image_url"=> $uri));
  
  
	$time_end = microtime(true);
	$execution_times = number_format(($time_end - $time_start), 2);
  
	$result['result']     = TRUE;  
	$result['image_url']  = $uri;
	$result['execution_times'] = $execution_times;
  
	return $result;
}
  
function group_invite_new_members(){
	$result = array();
  
	if (!check_header()) {
	  $result['result'] = FALSE;
	  $result['message']= "check_header()";
	  return $result;
	}
  
	if (empty($_REQUEST['uid']) || empty($_REQUEST['group_id']) || empty($_REQUEST['members'])) {
	  $result['result'] = FALSE;
	  $result['message']  = "function : group_invite_new_members, parameter";
	  return $result;
	}
  
	global $firebase;
	$param_uid      = $_REQUEST['uid'];
	$param_group_id = $_REQUEST['group_id'];
	$param_members  = (array)json_decode($_REQUEST['members']);
  
	$time_start     = microtime(true);
  
	$members_group_node = node_load($param_group_id);
	// $node_wrapper = entity_metadata_wrapper('node', $node);
	// $node_wrapper->field_key_token_notification->set($token);
  
  
	// $node_wrapper->save();
  
	// 
	$f_members = array();
  
	$members   = array_keys($param_members);
	foreach ($members as $members_key => $members_friend_id){
	  $flag = FALSE;
	  if (!empty($members_group_node->field_members_group[LANGUAGE_NONE])) {
		foreach ($members_group_node->field_members_group[LANGUAGE_NONE] as $members_group_k => $members_group_v) {
		  $members_group_item_load = field_collection_item_load($members_group_v['value']);
		  if (strcasecmp($members_group_item_load->field_members_group_friend_id[LANGUAGE_NONE][0]['value'], $members_friend_id) == 0) {
			$flag = TRUE;
			break;
		  }
		}
	  }
  
	  if (!$flag) {
		
		$m_profile = getNameImageURLFriend($members_friend_id);
		// $m_profile['status'] = '35';
		// $f_members[$member_field_entity->item_id] = $m_profile;
  
		$member_v = array();
		$member_v['field_name'] = 'field_members_group';
		$member_v['field_members_group_friend_id'][LANGUAGE_NONE][0]['value']  = $members_friend_id;
		$member_v['field_members_group_friend_name'][LANGUAGE_NONE][0]['value']= $m_profile['friend_name'];
		$member_v['field_path_uri'][LANGUAGE_NONE][0]['value']                 = $m_profile['friend_image_url'];
		$member_v['field_mg_status'][LANGUAGE_NONE][0]['tid']                  = '35';
  
		$member_field_entity = entity_create('field_collection_item', $member_v);
		$member_field_entity->setHostEntity('node', $members_group_node);
		$member_field_entity->save();
  
  
  
  
  
	// โหลดเพือนขึ้นมาเพือบันทึก field_chat_group
		$members_friend_profile = profile2_by_uid_load($members_friend_id, 'main');
  
		$members_friend_v = array();
		$members_friend_v['field_name'] = 'field_chat_group';
		$members_friend_v['field_group_id'][LANGUAGE_NONE][0]['value']  = $param_group_id;
		$members_friend_v['field_mg_status'][LANGUAGE_NONE][0]['tid']   = '35';
  
		// Create the field collection entry and associate it with the profile
		$members_friend_field_entity = entity_create('field_collection_item', $members_friend_v);
		$members_friend_field_entity->setHostEntity('profile2', $members_friend_profile);
		$members_friend_field_entity->save();
  
  
		$f_v = array( "item_id"  => $member_field_entity->item_id,
					  "status"   => '35'
				);
  
		// เป็นการ insert /idna/user/{friend_id}}/groups/{group_id}
		$firebase->update(FIREBASE_DEFAULT_PATH . FIREBASE_LOGIN_PATH . $members_friend_id . '/' . PATH_GROUPS . '/' . $param_group_id . '/' , $f_v);
  
		// เป็นการ update members /idna/chat_groups/{node_id}/
		$m_profile['status'] = '35';
		$f_members[$member_field_entity->item_id] = $m_profile;
  
		$firebase->update(FIREBASE_DEFAULT_PATH . FIREBASE_CHAT_GROUPS . '/' . $param_group_id .'/members/' . $member_field_entity->item_id .'/', $m_profile);
  
  
  
		/// send notification
  
		$user_profile   = profile2_by_uid_load($members_group_node->uid, 'main');
		$friend_profile = profile2_by_uid_load($members_friend_id, 'main');
  
		foreach ($friend_profile->field_device_access[LANGUAGE_NONE] as $k => $v) {
		  $item_load_device_access = field_collection_item_load($v['value']);
  
		  // $result['token_notification'] = $item_load_device_access->field_key_token_notification[LANGUAGE_NONE][0]['value'];
  
		  if($item_load_device_access->field_key_token_notification[LANGUAGE_NONE][0]['value'] != ""){
			// $item_load_device_access->field_key_token_notification[LANGUAGE_NONE][0]['value'];
  
			if (empty($friend_profile->field_profile_badge[LANGUAGE_NONE][0]['value'])) {
			  # code...
			  $badge = '1';
			}else{
			  $badge = $friend_profile->field_profile_badge[LANGUAGE_NONE][0]['value'] + 1;
			}
  
			// update บันทึก badge
			// $wrapper = entity_metadata_wrapper('field_collection_item', $item_load_device_access);
			// $wrapper->field_profile_badge->set($badge);   
			// $wrapper->save();
  
			$friend_profile->field_profile_badge[LANGUAGE_NONE][0]['value'] = $badge;
			profile2_save($friend_profile);
  
  
			$friend_name = $user_profile->field_profile_display_name[LANGUAGE_NONE][0]['value'];
  
			$message = $friend_name .' send request group ' . $members_group_node->title. '.';
  
			$sval = array('type'=>'request_group',
						  'friend_id'=>$members_group_node->uid,
						  'friend_name'=>$friend_name);
  
			send_push_notification($item_load_device_access->field_key_token_notification[LANGUAGE_NONE][0]['value'], '', $message, $sval, $badge);
  
		  }
		}
		/// send notification
	  }
	}
  
	$time_end       = microtime(true);
	$execution_time = number_format(($time_end - $time_start), 2);
  
	$result['result']          = TRUE;
	$result['new_members']     = $f_members;
	$result['execution_time']  = $execution_time;
	return  $result;
}
  
/*
	สร้าง QRCode &  profile ที่ firebase ให้แต่ละ user โดยแต่ละ application (heart, dna)
  
	$account : user account
	$bundleidentifier : heart.idna or heart.dna
	$url     : url app store[heart, dna](ios), play store[heart, dna](android)
*/
function generatorQRCode($account, $platform, $bundleidentifier){
	try {
	  $file = array();
		  
	  // Gen QRCode
	  //set it to writable location, a place for temp generated PNG files
	  $PNG_TEMP_DIR = PATH_FOLDER_QRCODE;//config_pages_get(CONFIG_PAGES_TYPE, 'field_path_folder_qrcode'); 
  
	  //Create the directory if it does not already exist, otherwise check the permissions
	  file_prepare_directory($PNG_TEMP_DIR, FILE_CREATE_DIRECTORY);
  
	  $text     = dec_enc('encrypt', $account->uid);
	  $errorCorrectionLevel = "M";
	  $matrixPointSize = 8;
  
	  // Create Profile2
	  // Where 'main' is your profile2 type machine name.
	  $profile = profile2_create(array('type' => 'main', 'uid' => $account->uid));
  
	  // add field name
	  $profile->field_profile_name[LANGUAGE_NONE][0]['value'] = $account->name;
  
	  // Display name
	  $profile->field_profile_display_name[LANGUAGE_NONE][0]['value'] = $account->name;
  
	  // จำนวน heart
	  // $profile->field_profile_heart[LANGUAGE_NONE][0]['value'] = DEFUALT_NUMBER_HEART;
  
	  // status message
	  $profile->field_profile_status_message[LANGUAGE_NONE][0]['value'] = '';
  
	  /*
	  เราจะแยกออกกัน ระหว่าง heart, dna เพราะว่าต้อง scan qrcode มันต้องวิ่งไปเปด store ถูกเพราะว่าเราแยก app กัน
	  */
	  switch ($bundleidentifier) {
		// iDNA
		case BUNDLE_IDENTIFIER:
		{
		  // ios
		  $filename = $PNG_TEMP_DIR.'/'.md5($text.'|'.$errorCorrectionLevel.'|'.$matrixPointSize).'.png';
		  QRcode::png(URL_SERVER() . "/qe?&bi=" . dec_enc('encrypt', BUNDLE_IDENTIFIER)  . "&bii=" . $text, $filename, $errorCorrectionLevel, $matrixPointSize, 2);  
  
		  $currentDate = date("Ymd");
		  $name  = $currentDate .'_'. rand(0, 999) . rand(0, 999) . rand(0, 999) . ".png";
		  $image = file_get_contents($filename); 
		  //Saves a file to the specified destination and creates a database entry.
		  $file = klovers_file_save_data($account->uid, $image, 'public://qrcode/' . $name, FILE_EXISTS_RENAME);
		  
		  // Delete file ที่  QRCode  สร้างขึ้นมาเพราะว่าเราเก็บเข้าระบบแล้ว
		  unlink($filename);
		  // Gen QRCode
  
		  $profile->field_profile_my_qrcode[LANGUAGE_NONE][0] = (array)$file;
  
  
		  /*
		  // android 
		  $filename = $PNG_TEMP_DIR.'/'.md5($text.'|'.$errorCorrectionLevel.'|'.$matrixPointSize).'.png';
		  QRcode::png(URL_SERVER() . "/qe?&bi=" . dec_enc('encrypt',BI_ANDROID_IDNA) . "&bii=" . $text, $filename, $errorCorrectionLevel, $matrixPointSize, 2);  
  
		  $currentDate = date("Ymd");
		  $name  = $currentDate .'_'. rand(0, 999) . rand(0, 999) . rand(0, 999) . ".png";
		  $image = file_get_contents($filename); 
		  //Saves a file to the specified destination and creates a database entry.
		  $file = klovers_file_save_data($account->uid, $image, 'public://qrcode/' . $name, FILE_EXISTS_RENAME);
		  
		  // Delete file ที่  QRCode  สร้างขึ้นมาเพราะว่าเราเก็บเข้าระบบแล้ว
		  unlink($filename);
		  // Gen QRCode
		  */
  
		  // $profile->field_profile_my_qrcode_dna_andr[LANGUAGE_NONE][0] = (array)$file;
		  
		  break;
		}
		
		default:
		  # code...
		  break;
	  }
  
	  $value['field_name'] = 'field_profile_multi_email'; // field collection name
	  $value['field_email_text'][LANGUAGE_NONE][0]['value'] = $account->mail;
  
	  // Create the field collection entry and associate it with the profile
	  $field_entity = entity_create('field_collection_item', $value);
	  $field_entity->setHostEntity('profile2', $profile);
	  $field_entity->save();
  
	  // Save the profile2 to the user account.
	  profile2_save($profile); 
	} catch (Exception $e) {
	  watchdog("idna", 'Erorr = %message', array('%message' => $e->getMessage()), WATCHDOG_ERROR);
	}
}

// ;
function generatorQRCodeForGroupChat($uid, $group_id){
	$file = array();

	// Gen QRCode
	//set it to writable location, a place for temp generated PNG files
	$PNG_TEMP_DIR = PATH_FOLDER_QRCODE;//config_pages_get(CONFIG_PAGES_TYPE, 'field_path_folder_qrcode'); 

	//Create the directory if it does not already exist, otherwise check the permissions
	file_prepare_directory($PNG_TEMP_DIR, FILE_CREATE_DIRECTORY);

	$text     = dec_enc('encrypt', $group_id);
	$errorCorrectionLevel = "M";
	$matrixPointSize = 8;

	// ios
	$filename = $PNG_TEMP_DIR.'/'.md5($text.'|'.$errorCorrectionLevel.'|'.$matrixPointSize).'.png';
	QRcode::png(URL_SERVER() . "/qe?&bi=" . dec_enc('encrypt', BUNDLE_IDENTIFIER)  . "&bii=" . $text, $filename, $errorCorrectionLevel, $matrixPointSize, 2);  

	$currentDate = date("Ymd");
	$name  = $currentDate .'_'. rand(0, 999) . rand(0, 999) . rand(0, 999) . ".png";
	$image = file_get_contents($filename); 
	//Saves a file to the specified destination and creates a database entry.
	$file = klovers_file_save_data($uid, $image, 'public://' . $name, FILE_EXISTS_RENAME);
	
	// Delete file ที่  QRCode  สร้างขึ้นมาเพราะว่าเราเก็บเข้าระบบแล้ว
	unlink($filename);
	// Gen QRCode


	// watchdog(TAG, 'generatorQRCodeForGroupChat : %group_id - %file', array('%group_id'=>$group_id, '%file'=>serialize($file)), WATCHDOG_INFO);

	$a_file = (array)$file;

	// บันทึกลง group
	$node_group   = node_load($group_id);  
	$node_group_wrapper = entity_metadata_wrapper('node', $node_group);
	$node_group_wrapper->field_profile_my_qrcode->set($a_file);
	$node_group_wrapper->save();

	$f_item = array("qrcode_url"  => file_create_url(image_style_url('medium', $a_file['uri'])));

	firestore_db()->collection(FIRESTORE_GROUPS)->document($group_id)->set($f_item, ['merge' => true]);
}
/*
   เป็นการ redirect url store
*/ 
function qe(){
	$detect = mobile_detect_get_object();
	switch (dec_enc('decrypt', $_REQUEST['bi'])) {
		case BUNDLE_IDENTIFIER:{  // 
		  if($detect->is('iPod') || $detect->is('iPhone') || $detect->is('iPad')){
				header('Location: ' . DEFUALT_IOS_URL_STORE_IDNA); // <-apple store link here
		  }else if($detect->is('Android')){ 
				header('Location: ' . DEFUALT_ANDROID_URL_STORE_IDNA); // <-play store link here
		  }
		  break;
		}
		
		default:{
		  header('Location: ' . $GLOBALS['base_url']); 
		}
		  break;
	}
}
  
// การกำหนด my id
function setDefualtMyID($profile, $my_id){
	$value = array();
	$value['field_name'] = 'field_profile_my_id'; // field collection name
  
	$value['field_profile_my_id_value'][LANGUAGE_NONE][0]['value'] = $my_id;
	$value['field_profile_my_id_is_edit'][LANGUAGE_NONE][0]['value'] = "1";
  
	// Create the field collection entry and associate it with the profile
	$field_entity = entity_create('field_collection_item', $value);
	$field_entity->setHostEntity('profile2', $profile);
	$field_entity->save();
  
	return $field_entity->item_id;
}
  
// sound_call_waiting
function setDefualtSoundCallWaiting($profile){
	$value = array();
	$value['field_name'] = 'field_sound_call_waiting';
	$value['field_sound_call_waiting_item_id'][LANGUAGE_NONE][0]['value'] = '396';
	$value['field_sound_call_waiting_title'][LANGUAGE_NONE][0]['value']    = "Default Sound Call waiting";
	$value['field_sound_call_waiting_uri'][LANGUAGE_NONE][0]['value']     = "/sites/default/files/sound_call_waiting/sexiest_romantic_mp3.mp3";
  
	$field_entity = entity_create('field_collection_item', $value);
	$field_entity->setHostEntity('profile2', $profile);
	$field_entity->save();
  
	return $field_entity->item_id;
}
  
function setDefualtBadges($profile){
	$values = array();
	$values['field_name'] = 'field_profile_badges';
	$values['field_profile_badge_contact'][LANGUAGE_NONE][0]['value'] = "0";
	$values['field_profile_badge_recent'][LANGUAGE_NONE][0]['value']  = "0";
	$values['field_profile_badge_center'][LANGUAGE_NONE][0]['value']  = "0";
	$values['field_profile_badge_setting'][LANGUAGE_NONE][0]['value'] = "0";
  
	$field_entity = entity_create('field_collection_item', $values);
	$field_entity->setHostEntity('profile2', $profile);
	$field_entity->save();
  
	return $field_entity->item_id;
}
  
/* 
   การสร้าง defualt classs ให้แต่ละ user โดยจะดึงมาจาก node content_type == 'defualt_classs', status == 1
*/
function setDefualtClasss($profile){
	global $firebase;
  
	$content_type = "defualt_classs";
  
	$query  = new EntityFieldQuery();
	$result = $query->entityCondition('entity_type', 'node')
	  ->entityCondition('bundle', $content_type)
	  ->propertyCondition('status', 1)
	  ->execute();
  
	if (!empty($result['node'])) {
	  $nids = array_keys($result['node']);
	  foreach ($nids as $key => $nid) {
			$node = node_load($nid);
		
			$image_arr = (array)file_load($node->field_class_image_profile[LANGUAGE_NONE][0]['fid']);
		
		
			$values = array();
			$values['field_name'] = 'field_field_my_class'; // field_field_my_class
			$values['field_class_name'][LANGUAGE_NONE][0]['value'] = $node->title;
			$values['field_class_image_profile'][LANGUAGE_NONE][0] = $image_arr;
			$values['field_is_default'][LANGUAGE_NONE][0]['value'] = "1";
		
		
			// Create the field collection entry and associate it with the profile
			$field_entity = entity_create('field_collection_item', $values);
			$field_entity->setHostEntity('profile2', $profile);
			$field_entity->save();
			
			// เป็น node id ของ group
			$item_id = $field_entity->item_id;
		
			// 
			$value_classs = array(      
				"nid"      => $nid,
				"name"     => $node->title,
				"is_default" => "1",
				// "image_url"=> substr(file_create_url(image_style_url('medium', $image_arr['uri'])), strlen($GLOBALS['base_url']))
		
				"image_url"=> file_create_url(image_style_url('medium', $image_arr['uri']))
			);
		
			// $firebase->set(FIREBASE_DEFAULT_PATH . FIREBASE_LOGIN_PATH . $profile->uid . '/' . PATH_CLASSS . '/' . $item_id . '/' , $value_classs);
		
			firestore_db()->collection(FIRESTORE_USERS)->document($profile->uid)->collection(FIRESTORE_CLASSS)->document($item_id)->set($value_classs);


			// watchdog(TAG, '2. DefualtClasss header : %profile', array('%profile'=>serialize($profile)), WATCHDOG_INFO);
	  }
	}
}
    
function getDefualtPictureProfileMyApplication(){
	$info = field_info_field('field_my_app_picture');
	if (!empty($info) && $info['settings']['default_image'] > 0) {
		$default_img_fid  = $info['settings']['default_image'];
		return file_load($default_img_fid);
  
		// return substr(file_create_url(image_style_url('medium', $default_img_file->uri)), strlen($GLOBALS['base_url']));
	}
  
	return;
}
  
  
function getDefualtProfilePicture(){
	$info = field_info_field('field_profile_image');
	if (!empty($info) && $info['settings']['default_image'] > 0) {
		$default_img_fid  = $info['settings']['default_image'];
		$default_img_file = file_load($default_img_fid);
  
		// return substr(file_create_url(image_style_url('medium', $default_img_file->uri)), strlen($GLOBALS['base_url']));
		return file_create_url(image_style_url('medium', $default_img_file->uri));
	}
  
	return;
}
  
// card_background
function getDefualtBackgroundCardPicture(){
	$info = field_info_field('field_picture_bg');
	if (!empty($info) && $info['settings']['default_image'] > 0) {
		$default_img_fid  = $info['settings']['default_image'];
		$default_img_file = file_load($default_img_fid);
  
		// return substr(file_create_url(image_style_url('medium', $default_img_file->uri)), strlen($GLOBALS['base_url']));
  
		return file_create_url(image_style_url('medium', $default_img_file->uri));
	}  
	return;
}
  
/*
	$tid เราจะ fix ลงไป
	34 : รูป family class
	33 : รูป friend class
	32 : รูปแอพพลิเคชั่น
	30 : รูปโปรไฟล์
	31 : รูปพื้นหลังของนามบัตร
*/
function get_defualt_picture($tid){
	watchdog(TAG, 'get_defualt_picture ', array(), WATCHDOG_INFO);
	$tree = taxonomy_get_tree(taxonomy_vocabulary_machine_name_load('defualt_picture')->vid);
	foreach ($tree as $term) {
	  if ($term->tid == $tid) {
		$term = taxonomy_term_load($term->tid);
		return file_load($term->field_image[LANGUAGE_NONE][0]['fid']);
	  }
	}
	return;
}
  
function get_creator($entity, $uid){
	if (!IsNullOrEmptyString($uid)) {
	  $profile = profile2_by_uid_load($uid, 'main');
  
	  $name    = $profile->field_profile_name[LANGUAGE_NONE][0]['value'];
  
	  $image_url = "";
	  if(isset($profile->field_profile_image[LANGUAGE_NONE])){
		// $image_url = substr(file_create_url(image_style_url('medium', $profile->field_profile_image[LANGUAGE_NONE][0]['uri'])), strlen($GLOBALS['base_url']));
		$image_url = file_create_url(image_style_url('medium', $profile->field_profile_image[LANGUAGE_NONE][0]['uri']));
	  }
  
	  $time = (string)time();
  
	  $val = array();
	  $val['field_name'] = 'field_creator';
	  $val['field_creator_uid'][LANGUAGE_NONE][0]['value']         = $uid;
	  $val['field_creator_name'][LANGUAGE_NONE][0]['value']        = $name;
	  $val['field_creator_image_uri'][LANGUAGE_NONE][0]['value']   = $image_url;
	  $val['field_creator_time_create'][LANGUAGE_NONE][0]['value'] = $time;
	  $val['field_creator_time_update'][LANGUAGE_NONE][0]['value'] = $time;
	  $multi_image_field_entity = entity_create('field_collection_item', $val);
	  $multi_image_field_entity->setHostEntity('field_creator', $entity);
	  $multi_image_field_entity->save();
  
	  return array("user_id"=>$uid, "name"=>$name, "image_url"=>$image_url, "create"=>$time, "update"=>$time);
	}
	return;
}

/**
 * Delete {system} records for long-lost modules.
 * 
 * https://www.drupal.org/node/2487215
 * How to fix "The following module is missing from the file system..." warning messages
 */
function me_update_7100() {
	$modules = array(
	  'helloworld',
	  'date'
	);
	db_delete('system')
	  ->condition('name', $modules, 'IN')
	  ->condition('type', 'module')
	  ->execute();
}

/*
* Insert user register firestore
*/
function ___insert_profiles($profile, $data){
	/*
	$userRef = firestore_db()->collection(FIRESTORE_USERS)->document($profile->uid);
	$snapshot = $userRef->snapshot();
	if (!$snapshot->exists()) {
		$userRef->set($data);

		setDefualtClasss($profile);
		create_defualt_application($profile->uid);
	}
	*/

	firestore_db()->collection(FIRESTORE_PROFILES)->document($profile->uid)->set($data);
	setDefualtClasss($profile);
	create_defualt_application($profile->uid);
}

/*
* ___user_login($uid, $nid, $data);
*/
function ___user_login($uid, $nid, $data){
	// $firebase->update(FIREBASE_DEFAULT_PATH . FIREBASE_LOGIN_PATH . $account->uid . '/profiles/device_access/' . $value['value'] . "/", $val);
	// $userRef = firestore_db()->collection(FIRESTORE_USERS)->document($uid);
	// $snapshot = $userRef->snapshot();
	// if ($snapshot->exists()) {
	// 	$userRef->set(array("profiles" => array("device_access"=>array($nid=>$data))), array('merge' => true));
	// }

	firestore_db()->collection(FIRESTORE_USERS)->document($uid)->collection(FIRESTORE_DEVICE_ACCESS)->document($nid)->set($data);
}

function firestore_delete_collection($collectionReference, $batchSize)
{
    $documents = $collectionReference->limit($batchSize)->documents();
    while (!$documents->isEmpty()) {
        foreach ($documents as $document) {
            printf('Deleting document %s' . PHP_EOL, $document->id());
            $document->reference()->delete();
        }
        $documents = $collectionReference->limit($batchSize)->documents();
    }
}
?>