import { FOREGROUND, BACKGROUND, INACTIVE } from 'redux-enhancer-react-native-appstate';

export default (state= {status:''}, action)=>{
    console.log(action)
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
}