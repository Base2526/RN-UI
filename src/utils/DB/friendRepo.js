import db from './manager'
import {currentTimestamp} from '../Helpers'

const friend_get = (friend_id, callback) => {
    var t0 = performance.now();
    db.conn.transaction((tx) => {
        tx.executeSql("select * from friends where friend_id=?", [friend_id], (tx, results) => {
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

const friend_insert = (friend_id, data, callback) =>{
    db.conn.transaction((tx) => {
        tx.executeSql("INSERT INTO friends ('friend_id', 'data', 'create', 'update') VALUES (?, ?, ?, ?);", [friend_id, JSON.stringify(data), currentTimestamp(),currentTimestamp()], (tx, results) => {
            if(results.rowsAffected != 0 ){
                callback({'status':true})
            }else{
                // NSLog(@"Could not execute the query");
                callback({'status':false, 'message': 'Could not execute the query'})
            }
        })
    })
}

const friend_update = (friend_id, data, callback) => {
    friend_get(friend_id, v=>{
        if(v.status){
            if(v.value.length < 1){
                // insert 
                friend_insert(friend_id, data, v=>{
                    if(v.status){
                        var t1 = performance.now();
                        callback({'status':true, 'execute_time': ((t1 - t0) / 1000) + " seconds."})
                    }else{
                        callback({'status':false, 'message':v.message})
                    }
                })
            }else{
                // update
                /*
                กรณีเรา check แล้วว่า data ไม่มีการเปลีย่นแปลงเราจะไม่ทำการ update
                 */
                if(JSON.stringify(data) === v.value[0].data){
                    var t1 = performance.now();
                    callback({'status':true, 'execute_time': ((t1 - t0) / 1000) + " seconds."})
                }else{
                    // update 
                    db.conn.transaction((tx) => {
                        tx.executeSql("UPDATE friends set 'data'=?, 'update'=? WHERE friend_id=?;", [JSON.stringify(data), currentTimestamp(), friend_id], (tx, results) => { 
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
        }
    })
}

export {friend_get,
        friend_update};