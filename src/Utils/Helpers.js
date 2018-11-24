import {AsyncStorage} from 'react-native'

export async function loadDataLocal(key) {
    let result = {}

    if(key == null){
        result.status = false
        result.message = "key empty"
        return result
    }

    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
        result.status = true
        result.value = value
        return result
    }else{
        result.status = false
        result.message = "key not match"
        return result
    }
}

export async function saveDataLocal(key, data) {
    let result = {}

    if(key == null){
        result.status = false
        result.message = "key empty"
        return result
    }

    await AsyncStorage.setItem(key, JSON.stringify(data));
    result.status = true
    return result
}

export async function removeDataLocalByKey(key){
    
    let result = {}

    if(key == null){
        result.status = false
        result.message = "key empty"
        return result
    }

    await AsyncStorage.removeItem(key);
    result.status = true
    return result
}
