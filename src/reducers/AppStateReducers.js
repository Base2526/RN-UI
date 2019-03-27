import firebase from 'react-native-firebase';

// fb = (state, action) =>{
//     console.log(action)
//     console.log(state)
//     console.log("1, update ")
//     if(state.type == 'persist/REHYDRATE'){
//         // if(!action.hasOwnProperty('payload')){
//         //     return;
//         // }
//         console.log("2, update " )
//         let payload = state.payload
//         if(payload._persist.rehydrated){

//             console.log("3, update ")
//             let auth = payload.auth
//             if(auth.isLogin){
//                 // track to firebase status

//                 var updateRef = firebase.database().ref('idna/user/1/profiles/device_access/1121030/');
                

//                 switch(action.type){
//                     case FOREGROUND:{
//                         updateRef.update({ 'online': '1'});
//                         break;
//                     } 
//                     case BACKGROUND:{
//                         updateRef.update({ 'online': '0'});
//                         break;
//                     }
//                     case INACTIVE:{
//                         updateRef.update({ 'online': '0'});
//                         break;
//                     }
//                 }

//                 console.log("update")
//             }
//         }
//     }
// }

export default (state= {status:''}, action)=>{
    // console.log(action)
    // this.fb(state, action)
    /*
    switch(action.type){
        case FOREGROUND:{
            return {...state, 
                    status: FOREGROUND, 
                    }
        } 
        case BACKGROUND:{
            return {...state,
                    status: BACKGROUND, 
                    }
        }
        case INACTIVE:{
            return {...state,
                    status: INACTIVE, 
                    }
        }
        default:
            return state
    }
    */

    return state
}