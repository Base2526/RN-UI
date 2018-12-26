import {Platform} from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage';

let conn
if(Platform.OS === 'ios'){
    conn = openDatabase({ name: "db.sql", createFromLocation : "~www/db.sql", location: 'Library'});
}else{
    conn = openDatabase({ name: "db.sql", createFromLocation : "~db.sql"});
}

// class Database  {
//     getConnection() {
//         return conn;
//     }
// }

// export function __test() {
//     return "__test"
// }

// module.exports = new Database();

/*
DB.tableAll(value=>{
            alert(value)
          })
 */

// const _conn = () => {
//     return conn
// }

const _tableAll = (callback) => {
    conn.transaction((tx) => {
        // SELECT name FROM sqlite_master WHERE type=\'table\'
        tx.executeSql("SELECT name FROM sqlite_master WHERE type=\'table\'", [], (tx, results) => {
          // console.log("Query completed");
    
          // Get rows with Web SQL Database spec compliance.
          // console.log(results.rows)
          let table = []
          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            // console.log(`Employee name: ${row.name}, Dept Name: ${row.deptName}`);
            // console.log(row.name)

            table = [...table, row.name]
          }

          callback( table )
          
          // console.log('len : ' + len)
    
          // Alternatively, you can use the non-standard raw method.
    
          
          // let rows = results.rows.raw(); // shallow copy of rows Array
          // rows.map(row => console.log(`Employee name: ${row.name}, Dept Name: ${row.deptName}`));
          
        });
    })
}

const _insert = (callback) => {
    conn.transaction((tx) => {
        // SELECT name FROM sqlite_master WHERE type=\'table\'
        tx.executeSql("SELECT name FROM sqlite_master WHERE type=\'table\'", [], (tx, results) => {
            callback({'insert': true})
        })
    })
}

const _update = (callback) => {
    callback({'update': true})
}

const _delete = (callback) => {
    callback({'delete': true})
}

// module.exports = {
//     // conn: _conn,
//     tableAll:_tableAll,
//     insert:_insert,
//     update:_update,
//     delete:_delete
// }

// module.exports = {
//     // conn: _conn,
//     tableAll:_tableAll,
// }

export * from './profileRepo';
export * from './friendProfileRepo';
export * from './groupRepo'
export * from './groupDetailRepo'

// module.exports = {
//     // conn: _conn,
//     test:()=>{return{'test':1256}},
// }
/** 
 * use
 * 
 * import Database from '../Utils/DB'
 * 
 * Database.getConnection().transaction((tx) => {
 *      ...query
 * })
 * */