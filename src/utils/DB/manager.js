import {Platform} from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage';

let conn
if(Platform.OS === 'ios'){
    conn = openDatabase({ name: "db.sql", createFromLocation : "~www/db.sql", location: 'Library'});
}else{
    conn = openDatabase({ name: "db.sql", createFromLocation : "~db.sql"});
}

module.exports = {
    conn
}