var functions = require('firebase-functions');

// Import Admin SDK
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

/*
เป็นส่วน call api Drupal
*/
var request = require('request');

// Get a database reference to our posts
var db = admin.database();

/*
Header 
Refer : https://stackoverflow.com/questions/17121846/node-js-how-to-send-headers-with-form-data-using-request-module
*/
var bundle_identifier = 'heart.idna';
var platform          = 'firebase';

var headers = { 
    'bundle_identifier': bundle_identifier,
    'platform' : platform 
};


var API_URL_IDNA 	= 'http://128.199.210.45';
var END_POINT_IDNA 	= '/api';
var PATH_ROOT_IDNA  = 'idna';
var PATH_USER_IDNA  = 'user'; 
var PATH_CENTER_IDNA  = 'center'; 

var PATH_UPDATE_PROFILE 			= '/update_profile';
var PATH_UPDATE_GROUP_CHAT    		= '/update_group_chat';

var PATH_USER_FOR_FRIEND_EDITUPDATE = '/user_for_friend_editupdate';

var PATH_CREATE_MY_APPLICATIOM_FOLLOW = '/create_my_application_follow';
var PATH_UPDATE_MY_APPLICATIOM_FOLLOW = '/update_my_application_follow';

var PATH_CREATE_MY_APPLICATIOM_POST_LIKE = '/create_my_application_post_like';
var PATH_UPDATE_MY_APPLICATIOM_POST_LIKE = '/update_my_application_post_like';


var PATH_DELETE_GROUP_CHAT   		= '/delete_group_chat';
var PATH_DELETE_MEMBER_GROUP_CHAT   = '/delete_member_group_chat';

var PATH_DELETE_POST_MY_APPLICATION  = '/delete_post';

// Refer : https://stackoverflow.com/questions/43486278/how-do-i-structure-cloud-functions-for-firebase-to-deploy-multiple-functions-fro
exports.iDNA = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/{type}/').onWrite(event => {
    
    /*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;
	
	switch(event.params.type) {
		case 'profiles':{
			// console.log('#1 : iDNA profiles');
			
			/*
			กรณีแก้ใขข้อมูลจาก firebase โดยตรงจึงเป้นต้องวิ่งไป update ข้อมูลที่ drupal ด้วย
			*/

			if (crnt.val() && !prev.val()) {
				// กรณี profile user มีการ add
			}else{
				// กรณี profile user มีการ edit | Update
				request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_PROFILE, form: {uid:event.params.uid, data:event.data.current.val()}, headers: headers}, function(err,httpResponse,body){ 
						/* ... */
						// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
						var objectValue = JSON.parse(body);
						if (!objectValue.result) {
							// console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
						}
				});
			}
		}
		break;

		case 'friends':{
			console.log('#2 : iDNA friends');
			
			/*
			กรณีแก้ใขข้อมูลจาก firebase โดยตรงจึงเป้นต้องวิ่งไป update ข้อมูลที่ drupal ด้วย
			*/
			
		}
		break;

		// case 'groups':{

		// 	if (crnt.val() && !prev.val()) {
		// 		// กรณี profile user มีการ add
		// 		console.log('#3 : iDNA groups');
		// 	}else{
		// 		// กรณี profile user มีการ edit | Update
		// 		console.log(event.data.current.val());
		// 		console.log('#3 : iDNA groups > กรณี profile user มีการ edit | Update');
		// 	}
		// }
		// break;

	}
});

/*
 สำหรับ Tigger กรณี friend for user มีการเปลียนแปลง เช่น is_block, close notification, ตั้งชื่อเพือน
*/
exports.iDNA_User_for_Friend_EditUpdate = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/friends/{friend_id}/').onWrite(event => {
    
    /*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;

    if (crnt.val() && !prev.val()) {
		// กรณี Add

		// console.log('#1 : iDNA_User_Friend > Add');
	}else{
		// กรณี Edit | Update

		// console.log('#1 : iDNA_User_Friend > edit & updated');
		
		request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_USER_FOR_FRIEND_EDITUPDATE, form: {uid:event.params.uid, friend_id:event.params.friend_id, data:event.data.current.val()}, headers: headers}, function(err,httpResponse,body){ 
				/* ... */
				// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
				// var objectValue = JSON.parse(body);
				// if (!objectValue.result) {
				// 	console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
				// }

				// console.log(body);
		});
	}
});


/*
  function : กรณี group มีการ edit, update ข้อมูล รวมถึงการ เพิ่ม-ลบ member
*/
exports.iDNA_Group = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/groups/{group_id}/').onWrite(event => {
    
    /*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {

		// console.log(">>>> iDNA_Group");
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;
	
	if (crnt.val() && !prev.val()) {
		// กรณี profile user มีการ add
		// console.log('#3 : iDNA groups');
	}else{
		// กรณี profile user มีการ edit | Update
		// console.log(event.data.current.val());
		// console.log('#3 : iDNA groups > กรณี profile user มีการ edit | Update');

		request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_GROUP_CHAT, form: {uid:event.params.uid, group_id:event.params.group_id, data:event.data.current.val()}, headers: headers}, function(err,httpResponse,body){ 
				/* ... */
				// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
				// var objectValue = JSON.parse(body);
				// if (!objectValue.result) {
				// 	console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
				// }

				// console.log(body)
		});
	}
});


/*
 function : ลบ Group Chat
*/
exports.iDNA_Group_Chat_Delete = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/groups/{group_id}/').onDelete(event => {
	/*
	กรณีมีการ Delete Group Member
	*/
	request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_GROUP_CHAT, form: {uid:event.params.uid, group_id:event.params.group_id}, headers: headers}, function(err,httpResponse,body){ 
			/* ... */
			// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
			// var objectValue = JSON.parse(body);
			// if (!objectValue.result) {
			// 	console.log('#1 : iDNA Group Delete, Erorr : ' + err);
			// }

			// console.log(body)
	});
});

/*
 กรณี ลบ member ของ Group
*/
exports.iDNA_Group_Chat_Member_Delete = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/groups/{group_id}/members/{member_id}/').onDelete(event => {
	/*
	กรณีมีการ Delete Group Member
	*/
	request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_MEMBER_GROUP_CHAT, form: {uid:event.params.uid, group_id:event.params.group_id, member_id:event.params.member_id}, headers: headers}, function(err,httpResponse,body){ 
			/* ... */
			// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
			// var objectValue = JSON.parse(body);
			// if (!objectValue.result) {
			// 	console.log('#1 : iDNA Group Delete, Erorr : ' + err);
			// }

			// console.log(body)
	});
	
});

/*
 กรณี ลบ Post ของ My Application
*/
exports.iDNA_MyApplication_Post_Delete = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/my_applications/{app_id}/posts/{post_id}/').onDelete(event => {
	/*
	กรณีมีการ Delete Post ของ My Application
	*/

	// console.log('กรณีมีการ Delete Post ของ My Application');
	
	request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_POST_MY_APPLICATION, form: {uid:event.params.uid, app_id:event.params.app_id, post_id:event.params.post_id}, headers: headers}, function(err,httpResponse,body){ 
			
			// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
			// var objectValue = JSON.parse(body);
			// if (!objectValue.result) {
			// 	console.log('#1 : iDNA Group Delete, Erorr : ' + err);
			// }

			// console.log(body)
	});
});

/*
	เป็นการ กด follows โดยมีหลักการดังนี้
	เนื่องจากเราต้องการ ความเร็วในการ following & unfollow เราจึงต้องวิ่งเข้า firebase โดยตรง ดังนั้นครังของการกด following จะไม่มี id field collection ที่ database
	ดังนั้นเราต้อง เช็ดก่อนว่า มี item_id หรือเปล่าจาก tigger ถ้าไม่มีแสดงว่าเราต้องวิ่งไป สร้างแล้ว return item_id เพือมา  update โดยครั้งต้องไปเราแค้ update field status following & unfollow เท่านั้น
*/
exports.iDNA_MyApplication_Follow_Unfollow = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_CENTER_IDNA + '/{category_id}/{app_id}/follows/{uid}').onWrite(event => {
    
    /*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;
	
	if (crnt.val() && !prev.val()) {
		var val = event.data.current.val();

		// console.log(val.owner_id);

		// call api เพือไป create follow
		request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_CREATE_MY_APPLICATIOM_FOLLOW, form: {owner_id:val.owner_id, friend_id:event.params.uid, app_id:event.params.app_id}, headers: headers}, function(err,httpResponse,body){ 
			
			var $objectValue = JSON.parse(body);
			
			if ($objectValue.result) {
				
				//  update item_id ที่ firebase เพราะว่าถ้าเราใช้ครั้งต่อไป เช่น unfollow เราจะสามารถวิ่งไป update database ได้ถูกต้อง
				var ref = db.ref(PATH_ROOT_IDNA);
				ref.child(PATH_CENTER_IDNA).child(event.params.category_id).child(event.params.app_id).child('follows').child(event.params.uid).update({'item_id':$objectValue.item_id });
			
			}	
		});
	}else{
		request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_MY_APPLICATIOM_FOLLOW, form: {friend_id:event.params.uid, data:event.data.current.val()}, headers: headers}, function(err,httpResponse,body){ 
			// console.log(body);
		});
	}
});

/*
	เป็นการ กด Like โดยมีหลักการดังนี้
	เนื่องจากเราต้องการ ความเร็วในการ like & unlike เราจึงต้องวิ่งเข้า firebase โดยตรง ดังนั้นครังของการกด like จะไม่มี id field collection ที่ database
	ดังนั้นเราต้อง เช็ดก่อนว่า มี item_id หรือเปล่าจาก tigger ถ้าไม่มีแสดงว่าเราต้องวิ่งไป สร้างแล้ว return item_id เพือมา  update โดยครั้งต้องไปเราแค้ update field status like & unlike เท่านั้น

	friend_id ซ: คือ id ของคนที่กด like
*/
exports.iDNA_MyApplication_Post_Like_Unlike = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_CENTER_IDNA + '/{category_id}/{app_id}/posts/{post_id}/likes/{friend_id}/').onWrite(event => {
    
    /*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {

		// console.log(">>>> iDNA_MyApplication_Post_Like_Unlike");
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;
	
	if (crnt.val() && !prev.val()) {
		// var val = event.data.current.val();
		// console.log(val);

		// console.log(">>>> Add iDNA_MyApplication_Post_Like_Unlike");
		// กรณี profile user มีการ edit | Update

		// call api เพือไป create follow
		request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_CREATE_MY_APPLICATIOM_POST_LIKE, form: {post_id:event.params.post_id, friend_id:event.params.friend_id}, headers: headers}, function(err,httpResponse,body){ 
			
			// console.log(body);
			
			var $objectValue = JSON.parse(body);
			if ($objectValue.result) {
				
				//  update item_id ที่ firebase เพราะว่าถ้าเราใช้ครั้งต่อไป เช่น unfollow เราจะสามารถวิ่งไป update database ได้ถูกต้อง
				var ref = db.ref(PATH_ROOT_IDNA);
				ref.child(PATH_CENTER_IDNA).child(event.params.category_id).child(event.params.app_id).child('posts').child(event.params.post_id).child('likes').child(event.params.friend_id).update({'item_id':$objectValue.item_id });
			
			}	
		});		

	}else{
		// console.log(">>>> Edit | Update PATH_UPDATE_MY_APPLICATIOM_POST_LIKE");
		// กรณี profile user มีการ edit | Update
		// console.log(event.data.current.val());
		request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_MY_APPLICATIOM_POST_LIKE, form: {friend_id:event.params.friend_id, data:event.data.current.val()}, headers: headers}, function(err,httpResponse,body){ 
			// console.log(body);
		});
	}
});



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// https://stackoverflow.com/questions/43415759/use-firebase-cloud-function-to-send-post-request-to-non-google-server/43645498#43645498


// <---------- PATH CONFIG
var path = 'toonchat';
var path_message = 'toonchat_message';

var API_URL 	= 'http://128.199.247.179';
var END_POINT 	= '/api';

var UPDATE_MY_PROFILE = '/update_my_profile';
var UPDATE_DATA_PROFILE = '/update_data_group';


/*
 เป็นการลบเพือน กรณีเราลบโดยตรงจาก firebase แล้วจะมีการวิ่งไปลบ ที drupal ให้ด้วย
*/
var DELETE_FRIEND_FROM_USER 	= "/delete_friend_from_user";

var DELETE_GROUP_CHAT    		= "/delete_group_chat";
var GROUP_DELETE_MEMBERS 		= "/group_delete_members"; 

var MULTI_CHAT_DELETE_MEMBERS 	= "/multi_chat_delete_members"; 
var DELETE_MULTI_CHAT         	= "/delete_multi_chat";
// ----------> PATH CONFIG


/*
Refer :
call api delete_group_chat
https://www.npmjs.com/package/request

nodejs
array : https://www.npmjs.com/package/node-array
	*/


// https://github.com/firebase/firebase-functions/blob/master/src/providers/database.ts

// request(API_URL, function (error, response, body) {
//   console.log('google > error:', error); // Print the error if one occurred
//   console.log('google > statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('google > body:', body); // Print the HTML for the Google homepage.
// });


/*
 เมือมีการ write /toochat/uid/{friends, invite_group, profile, group}/{key}
*/
exports.tiggerUser = functions.database.ref(path + '/{uid}/{type}/{key}/').onWrite(event => {
	// console.log(event.data);

	/*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	// if (event.data.previous.exists()) {
	// 	console.log('#000');
	//     return;
	// }
	if (!event.data.exists()) {
		// console.log("Removed : " + event.params.type);

		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;

    if (crnt.val() && !prev.val()) {
        // value created
        console.log('Created: send push notification');
    } else if (!crnt.val() && prev.val()) {
        // value removed
        // console.log('Removed: send push notification');
    } else {
        // value edit & updated
        console.log('>Updated');
        console.log(event.params.type);
        console.log('<Updated');
    }

	// console.log('#' + event.params.uid);

	var _val = event.data.toJSON();
	// console.log('# _val : ' + _val);

	var cc = event.data.current.val();
	// var ccc = cc.val();
	// console.log('# cc : ' + JSON.stringify(cc));

    /*
	// loop all data
	event.data.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();

      // console.log('# key : ' + key + ", childData : " + childData);
  	});

	// จะได้ได้ key ข้อมูลที่ เพิ่มใหม่ หรือ แก้ไข 
  	console.log('key new : ' + event.params.key);
  	*/
	
	switch(event.params.type) {
		case 'profiles':{
			console.log('#1 : profiles');
			// console.log(event.params.key);
			// console.log(event.data.current.val());
			// console.log(event.data);
			// console.log('#2 : profiles');
			/*
			กรณีแก้ใขข้อมูลจาก firebase โดยตรงจึงเป้นต้องวิ่งไป update ข้อมูลที่ drupal ด้วย
			*/
			switch(event.params.key){
				case 'name':{
					// uid
					request.post({url:API_URL + END_POINT + UPDATE_MY_PROFILE, form: {uid:event.params.uid, name:event.data.current.val()}}, function(err,httpResponse,body){ 
						/* ... */ 
						console.log(body);
					});
				}
				break;
				case 'status_message':{
					request.post({url:API_URL + END_POINT + UPDATE_MY_PROFILE, form: {uid:event.params.uid, status_message:event.data.current.val()}}, function(err,httpResponse,body){ 
						/* ... */ 
						console.log(body);
					});
				}
				break;
			}
		}
		break;

		case 'friends':{
			console.log('#2 : friends');
		}
		break;

		case 'groups':{
			console.log('#3 : groups');

			if (crnt.val() && !prev.val()) {
		        // value created
		        console.log('Created: groups');

				event.data.forEach(function(childSnapshot) {
			      // key will be "ada" the first time and "alan" the second time
			      // var key = childSnapshot.key;
			      // childData will be the actual contents of the child
			      // var childData = childSnapshot.val();

			      // console.log('# key : ' + key + ", childData : " + childData);

					/*
			      if (event.params.key == childSnapshot.key) {
			      	var key = childSnapshot.key;
			      	var childData = childSnapshot.val();
					console.log('># key : ' + key + ", childData : " + childData);
			      }else{
			      	console.log(">###< | " + event.params.key + " & "+ childSnapshot.key);
			      }
			      */

			      if(childSnapshot.key == 'members'){
			      	// var members = JSON.parse(childSnapshot.val());

			      	var members = childSnapshot.val();

			      	
			      	// members.forEach(function(childMembers) {
			      	// 	console.log('>## childMembers :' + childMembers.key);
			      	// });

			  //     	for(let index in members){
					//   var element = members[index];
					//   console.log('>## element :' + element);
					// }

					// console.log('>## numChildren() :' + childSnapshot.numChildren());

					var ref = db.ref(path);

					childSnapshot.forEach(function (snapshot) {
			           var obj = snapshot.val();
			           if(obj.status == "pedding") {
			               // console.log("uid : " + snapshot.key + ", status = " + obj.status);

			               // เราต้อง เพิ่ม invite_group เพือ่นที่เรา invite ไปด้วย
			               /*
			               ref.child(snapshot.key).child("invite_group").child(event.params.key).set({
			               	'owner_id':event.params.uid,
			               	'status':obj.status
			               });
			               */

			               ref.child(obj.friend_id).child("invite_group").child(event.params.key).set({
			               	'node_id' : snapshot.key,
			               	'owner_id':event.params.uid,
			               	'status':obj.status
			               });

			               /*
							ต้องวิ่งไป update ที่ api ด้วย
			               */
			           }
			        });


			      	// console.log(JSON.parse(JSON.stringify(childSnapshot.val())));
			      	// console.log('>## KOK : #2 >');
			      	// $.each(JSON.parse(JSON.stringify(childSnapshot.val())), function(index, valueA){
			      	// 	console.log('>##>' + index);
			      	// 	console.log('>##>>' + valueA);
			      	// });

			   //    	for (var keyM in members) {
						// console.log('>## keyM : ' + keyM);
			   //    	}

			   //    	for (var ikey in members) {
						// console.log('>## ikey : ' + ikey);
			   //    	}
					// members.forEach(function(childMember) {
					// 	var _key = childMember.key;
					// 	console.log('>## key : ' + _key);
					// });
			      }
			  	});
		    } else if (!crnt.val() && prev.val()) {
		        // value removed
		        // console.log('Removed: send push notification');
		    } else {
		        // value edit & updated
		        console.log('>>> Updated: key ' + event.params.key + ", val : " + JSON.stringify(event.data.current.val()));
		    
		        request.post({url:API_URL + END_POINT + UPDATE_DATA_PROFILE, form: {data:event.data.current.val()}}, function(err,httpResponse,body){ 
						/* ... */ 
						console.log(body);
				});
		    }
		}
		break;

		case 'invite_group':{
			console.log('#4 : invite_group');
		}
		break;
		case 'chat':{
			console.log('#4 : invite_group');
		}
		break;

		case 'multi_chat':{
			console.log('#5 : multi_chat');

			/*
			event.data.forEach(function(childSnapshot) {
		      // key will be "ada" the first time and "alan" the second time
		      // var key = childSnapshot.key;
		      // childData will be the actual contents of the child
		      // var childData = childSnapshot.val();

		      // console.log('# key : ' + key + ", childData : " + childData);


		      if(childSnapshot.key == 'members'){
		      	// var members = JSON.parse(childSnapshot.val());

		      	var members = childSnapshot.val();

		      	
		      	// members.forEach(function(childMembers) {
		      	// 	console.log('>## childMembers :' + childMembers.key);
		      	// });

		  //     	for(let index in members){
				//   var element = members[index];
				//   console.log('>## element :' + element);
				// }

				console.log('>## multi_chat numChildren() :' + childSnapshot.numChildren());

				var ref = db.ref(path);

				childSnapshot.forEach(function (snapshot) {
		           var obj = snapshot.val();
		           // console.log("----- multi_chat ----- 1");
		           // console.log(obj);
		           // console.log("----- multi_chat ----- 2");
		           if(obj.status == "pedding") {
		               // console.log("uid : " + snapshot.key + ", status = " + obj.status);

		               // เราต้อง เพิ่ม invite_group เพือ่นที่เรา invite ไปด้วย
		               ref.child(obj.friend_id).child("invite_multi_chat").child(event.params.key).set({
		               	'node_id' : snapshot.key,
		               	'owner_id':event.params.uid,
		               	'status':obj.status
		               });
		           }
		        });


		      	// console.log(JSON.parse(JSON.stringify(childSnapshot.val())));
		      	// console.log('>## KOK : #2 >');
		      	// $.each(JSON.parse(JSON.stringify(childSnapshot.val())), function(index, valueA){
		      	// 	console.log('>##>' + index);
		      	// 	console.log('>##>>' + valueA);
		      	// });

		   //    	for (var keyM in members) {
					// console.log('>## keyM : ' + keyM);
		   //    	}

		   //    	for (var ikey in members) {
					// console.log('>## ikey : ' + ikey);
		   //    	}
				// members.forEach(function(childMember) {
				// 	var _key = childMember.key;
				// 	console.log('>## key : ' + _key);
				// });
		      }
		  	});
		  	*/
		}
		break;
	}
	
	return;
});

/*
	กรณี ลบ Group
*/
exports.tiggerDeleteGroupAndMutiChat = functions.database.ref(path + '/{uid}/{type}/{key}/').onDelete(event => {

	console.log('#x : tiggerDeleteGroupAndMutiChat');
	console.log('#x1 : ' + event.params.uid);
	// console.log('#x2 : ' + event.params.type);
	console.log('#x3 : ' + event.params.key);

	// request(API_URL + END_POINT + DELETE_GROUP_CHAT , function (error, response, body) {
	//   console.log('google > error:', error); // Print the error if one occurred
	//   console.log('google > statusCode:', response && response.statusCode); // Print the response status code if a response was received
	//   console.log('google > body:', body); // Print the HTML for the Google homepage.
	// });


	/*
	call api delete_group_chat
	https://www.npmjs.com/package/request

	nodejs
	*/
	
	switch(event.params.type) {
		case 'profiles':{
			console.log('#1 : profiles');
		}
		break;

		case 'friends':{
			console.log('#tiggerDeleteGroupAndMutiChat : delete friend from user.');
			request.post({url:API_URL + END_POINT + DELETE_FRIEND_FROM_USER, form: {uid:event.params.uid, friend_id:event.params.key}}, function(err,httpResponse,body){ 
				/* ... */ 
				console.log(body);
			});
		}
		break;

		case 'groups':{
			// https://stackoverflow.com/questions/43415759/use-firebase-cloud-function-to-send-post-request-to-non-google-server
			request.post({url:API_URL + END_POINT + DELETE_GROUP_CHAT, form: {uid:event.params.uid, group_id:event.params.key, text_array:[ 1, 2, 3, 4, 5 ]}}, function(err,httpResponse,body){ 
				/* ... */ 
				console.log(body);
			});
		}
		break;

		case 'multi_chat':{
			request.post({url:API_URL + END_POINT + DELETE_MULTI_CHAT, form: {uid:event.params.uid, multi_id:event.params.key, text_array:[ 1, 2, 3, 4, 5 ]}}, function(err,httpResponse,body){ 
				/* ... */ 
				console.log(body);
			});
		}
		break;
	}
	
});

/*
	กรณีเราลบ member ของ Group & Multi
*/
exports.tiggerDeleteMemberGroupAndMutiChat = functions.database.ref(path + '/{uid}/{type}/{group_id}/members/{friend_id}/').onDelete(event => {

	console.log('#y : tiggerDeleteMemberGroup');
	console.log('#y1 : ' + event.params.uid);
	// console.log('#y2 : ' + event.params.type);
	console.log('#y3 : ' + event.params.group_id);
	// console.log('#y4 : ' + event.params.members);
	console.log('#y5 : ' + event.params.friend_id);

	switch(event.params.type) {
		case 'groups':{
			console.log('#2 : multi_chat > delete member');
			request.post({url:API_URL + END_POINT + GROUP_DELETE_MEMBERS, form: {uid:event.params.uid, group_id:event.params.group_id, member_id:event.params.friend_id, text_array:[ 1, 2, 3, 4, 5 ]}}, function(err,httpResponse,body){ 
				
				/* ... */ 
				console.log(err);
				console.log(httpResponse);
				console.log(body);
			});
		}
		break;

		case 'multi_chat':{
			console.log('#2 : multi_chat > delete member');
			request.post({url:API_URL + END_POINT + MULTI_CHAT_DELETE_MEMBERS, form: {uid:event.params.uid, group_id:event.params.group_id, member_id:event.params.friend_id, text_array:[ 1, 2, 3, 4, 5 ]}}, function(err,httpResponse,body){ 
				
				/* ... */ 
				console.log(err);
				console.log(httpResponse);
				console.log(body);
			});
		}
		break;
	}

	
});

exports.tiggerMessage = functions.database.ref(path_message + '/{chat_id}/{key}/').onWrite(event => {

	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;

    if (crnt.val() && !prev.val()) {
        // value created
        console.log('Created: {tiggerMessage}');
    } else if (!crnt.val() && prev.val()) {
        // value removed
        console.log('Removed: {tiggerMessage}');
    } else {
        // value updated
        console.log('Updated: {tiggerMessage}');
    }

    // var cc = event.data.current.val();

    console.log('key new : ' + event.params.key);

    console.log('Text : ' + event.data.val().text);
    console.log('Type : ' + event.data.val().type);

	var ref = db.ref(path);

    switch(event.data.val().type){
    	case 'group':{

			// https://stackoverflow.com/questions/42824688/firebase-get-data-by-key-or-chid-values-javascript
    		var chat_id  = event.params.chat_id;
    		var owner_id = event.data.val().owner_id;

    		var sender_id = event.data.val().uid;

    		//  udpate recents ของผู้ส่ง
			ref.child(sender_id).child("recents").child(chat_id).set({
		               	'create':admin.database.ServerValue.TIMESTAMP,
		               	'type':event.data.val().type,
		               	'text':event.data.val().text
		               });

			/*
				ดึงข้อมูล members ของ groups chat id โดยเราจะเอาเฉพาะ user ที่มี status = join เท่านั้น เพือ่ udpate recices ของ user id
			*/
			ref.child(owner_id).child('groups').child(chat_id).child("members").once("value", function(snap){

				/*
				console.log("xxxxxx #1");
				console.log("There are "+snap.numChildren()+" messages");
				console.log(JSON.stringify(snap.val()));
				console.log("xxxxxx #2");
				*/

				/*
				เช็กว่า  user id นี้มีข้อมูลหรือไม่
				*
				if (snap.numChildren() > 0) {
					ref.child(childSnapshot.key).child('update').child(event.params.type).child(event.params.nid).remove();
					// console.log("remove()" + childSnapshot.key);
				}
				*/

				

				//  udpate recents ของ friend(member)
				snap.forEach(function (snapshot) {
					console.log('x-x ' + snapshot.key +', status : ' + snapshot.val().status);

					ref.child(snapshot.key).child("recents").child(chat_id).set({
		               	'create':admin.database.ServerValue.TIMESTAMP,
		               	'type':event.data.val().type,
		               	'text':event.data.val().text
		               });
				});

			}, function (errorObject) {
	  			console.log(errorObject.code);
			});

    	}
    	break;

    	case 'private':{
    		var chat_id  = event.params.chat_id;
    		var friend_id  = event.data.val().friend_id;

    		var sender_id = event.data.val().uid;


			console.log('y-y chat_id : ' + chat_id +', friend_id : ' + friend_id);

			//  udpate recents ของ friend
			ref.child(friend_id).child("recents").child(chat_id).set({
		               	'create':admin.database.ServerValue.TIMESTAMP,
		               	'type':event.data.val().type,
		               	'text':event.data.val().text
		               });

			//  udpate recents ของผู้ส่ง
			ref.child(sender_id).child("recents").child(chat_id).set({
		               	'create':admin.database.ServerValue.TIMESTAMP,
		               	'type':event.data.val().type,
		               	'text':event.data.val().text
		               });
    	}
    	break;
    }

    // event.data.forEach(function(childSnapshot) {
    // 	// console.log(childSnapshot.val());
    // 	if (childSnapshot.key == event.params.key) {
    // 		console.log(childSnapshot);
    // 	}

    // 	console.log('> : ' + childSnapshot.key + ', ' + childSnapshot.val());

    // 	switch(childSnapshot.key){
    // 		case 'private':{

    // 		}
    // 		break;

    // 		case 'group':{
    			
    // 		}
    // 		break;
    // 	}
    // });

    return;
});
