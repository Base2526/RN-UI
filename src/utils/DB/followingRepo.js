import db from './manager'
import {currentTimestamp} from '../../utils/Helpers'

const following_get = (item_id, callback) => {
    var t0 = performance.now();
    db.conn.transaction((tx) => {
        tx.executeSql("select * from following where item_id=?", [item_id], (tx, results) => {
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

const following_insert = (item_id, data, callback) => {
    db.conn.transaction((tx) => {
        tx.executeSql("INSERT INTO following ('item_id', 'data', 'create', 'update') VALUES (?, ?, ?, ?);", [item_id, JSON.stringify(data), currentTimestamp(),currentTimestamp()], (tx, results) => {
            
            if(results.rowsAffected != 0 ){
                callback({'status':true})
            }else{
                // NSLog(@"Could not execute the query");
                callback({'status':false, 'message': 'Could not execute the query'})
            }
        })
    })
}

const following_update = (item_id, data, callback) => {
    var t0 = performance.now();
    following_get(v=>{
        if(v.status){
            if(v.value.length < 1){
                // insert 
                following_insert(data, v=>{
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
                        tx.executeSql("UPDATE following set 'data'=?, 'update'=? WHERE item_id=?;", [JSON.stringify(data), currentTimestamp(), item_id], (tx, results) => {
                            
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

const following_delete = (item_id, callback) => {
    db.conn.transaction((tx) => {
        tx.executeSql("DELETE from following WHERE item_id =?", [item_id], (tx, results) => {
            callback({'status':true, 'results':results})
        })
    })
}

export {following_get, 
        following_update, 
        following_delete };