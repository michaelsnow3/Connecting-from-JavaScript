const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

let name = process.argv[2];

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  selectByName(name, displayPerson);
});

function selectByName (inputName, callback) {
    client.query(`SELECT * FROM famous_people
      WHERE first_name = $1 OR last_name = $1`, [inputName], (err, result) => {
      if (err) {
        return console.error("error running query", err);
      }

      if(inDatabase(result)){
        displayPerson(result);
      }

      client.end();
  });
}

function displayPerson(people) {
  people.rows.forEach(function(row, i){
    console.log(`- ${i + 1}: ${row.first_name} ${row.last_name}, born '${row.birthdate.toISOString().split('T')[0]}'`);
  });
}

function inDatabase (dbResult) {
  //if name is not in db
  if(!dbResult.rowCount){
   console.log("name is not in database");
   return false;
  } else{
    return true;
  }
}