import db from './manager'
import {currentTimestamp} from '../../Utils/Helpers'

const myApplication_get = (app_id, callback) => {
    var t0 = performance.now();
    db.conn.transaction((tx) => {
        tx.executeSql("select * from my_applications where app_id=?", [app_id], (tx, results) => {
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

const myApplication_insert = (app_id, data, callback) => {
    db.conn.transaction((tx) => {
        tx.executeSql("INSERT INTO my_applications ('app_id', 'data', 'create', 'update') VALUES (?, ?, ?, ?);", [app_id, JSON.stringify(data), currentTimestamp(),currentTimestamp()], (tx, results) => {
            
            if(results.rowsAffected != 0 ){
                callback({'status':true})
            }else{
                // NSLog(@"Could not execute the query");
                callback({'status':false, 'message': 'Could not execute the query'})
            }
        })
    })
}

const myApplication_update = (app_id, data, callback) => {
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
                        tx.executeSql("UPDATE my_applications set 'data'=?, 'update'=? WHERE app_id=?;", [JSON.stringify(data), currentTimestamp(), app_id], (tx, results) => {
                            
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

const myApplication_delete = (app_id, callback) => {
    db.conn.transaction((tx) => {
        tx.executeSql("DELETE from my_applications WHERE app_id =?", [app_id], (tx, results) => {
            callback({'status':true, 'results':results})
        })
    })
}

export {myApplication_get, 
        myApplication_update, 
        myApplication_delete };