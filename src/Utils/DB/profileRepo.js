import db from './manager'
import {currentTimestamp} from '../../Utils/Helpers'

const profile_get = (callback) => {
    var t0 = performance.now();
    db.conn.transaction((tx) => {
        tx.executeSql("select * from profiles;", [], (tx, results) => {
            let value = []
            for (let i = 0; i < results.rows.length; i++) {
                let row = results.rows.item(i);
                // console.log(`Employee name: ${row.name}, Dept Name: ${row.deptName}`);
                
                value = [...value, row]
            }

            // console.log(results)

            var t1 = performance.now();

            callback({'status':true, 'value':value, 'execute_time': ((t1 - t0) / 1000) + " seconds."})
        })
    })
}

const profile_insert = (data, callback) => {
    db.conn.transaction((tx) => {
        tx.executeSql("INSERT INTO profiles ('data', 'create', 'update') VALUES (?, ?, ?);", [JSON.stringify(data), currentTimestamp(),currentTimestamp()], (tx, results) => {
            
            if(results.rowsAffected != 0 ){
                callback({'status':true})
            }else{
                // NSLog(@"Could not execute the query");
                callback({'status':false, 'message': 'Could not execute the query'})
            }
        })
    })
}

const profile_update = (data, callback) => {

    var t0 = performance.now();
    profile_get(v=>{
        if(v.status){
            if(v.value.length < 1){
                // insert 
                profile_insert(data, v=>{
                    if(v.status){
                        var t1 = performance.now();
                        callback({'status':true, 'execute_time': ((t1 - t0) / 1000) + " seconds."})
                    }else{
                        callback({'status':false, 'message':v.message})
                    }
                })
            }else{

                /*
                กรณีเรา check แล้วว่า data ไม่มีการเปลีย่นแปลงเราจะไม่ทำการ update
                 */
                if(JSON.stringify(data) === v.value[0].data){
                    var t1 = performance.now();
                    callback({'status':true, 'execute_time': ((t1 - t0) / 1000) + " seconds."})
                }else{
                    // update 
                    db.conn.transaction((tx) => {
                        tx.executeSql("UPDATE profiles set 'data'=?, 'update'=? WHERE id=?;", [JSON.stringify(data), currentTimestamp(), v.value[0].id], (tx, results) => {
                            
                            if(results.rowsAffected != 0 ){
                                var t1 = performance.now();
                                callback({'status':true, 'execute_time': ((t1 - t0) / 1000) + " seconds."})
                            }else{
                                // NSLog(@"Could not execute the query");
                                callback({'status':false, 'message': 'Could not execute the query'})
                            }
                        })
                    })
                }
            }
        }else{
            callback({'status':false, 'message': 'Could not execute the query'})
        }
    })
}

const profile_delete = (callback) => {
    db.conn.transaction((tx) => {
        tx.executeSql("DELETE from profiles;", [], (tx, results) => {
            callback({'status':true, 'results':results})
        })
    })
}

export {profile_get, 
        profile_update, 
        profile_delete };


/*
Usage
import {profile_get, 
        profile_update, 
        profile_delete} from './DB'

profile_get(v=>{
    console.log(v)
})

profile_update({'test':'11'}, v=>{
    console.log(v)
})

profile_delete(v=>{
    console.log(v)
})
*/