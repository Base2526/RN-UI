import db from './manager'
import {currentTimestamp} from '../../Utils/Helpers'

const group_get = (group_id, callback) => {
    var t0 = performance.now();
    db.conn.transaction((tx) => {
        tx.executeSql("select * from group_chat where group_id=?", [group_id], (tx, results) => {
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

const group_insert = (group_id, data, callback) => {
    db.conn.transaction((tx) => {
        tx.executeSql("INSERT INTO group_chat ('group_id', 'data', 'create', 'update') VALUES (?, ?, ?, ?);", [group_id, JSON.stringify(data), currentTimestamp(),currentTimestamp()], (tx, results) => {
            
            if(results.rowsAffected != 0 ){
                callback({'status':true})
            }else{
                // NSLog(@"Could not execute the query");
                callback({'status':false, 'message': 'Could not execute the query'})
            }
        })
    })
}

const group_update = (group_id, data, callback) => {
    var t0 = performance.now();
    group_get(v=>{
        if(v.status){
            if(v.value.length < 1){
                // insert 
                group_insert(data, v=>{
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
                        tx.executeSql("UPDATE group_chat set 'data'=?, 'update'=? WHERE group_id=?;", [JSON.stringify(data), currentTimestamp(), group_id], (tx, results) => {
                            
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

const group_delete = (group_id, callback) => {
    db.conn.transaction((tx) => {
        tx.executeSql("DELETE from group_chat WHERE group_id =?", [group_id], (tx, results) => {
            callback({'status':true, 'results':results})
        })
    })
}

export {group_get, 
        group_update, 
        group_delete };