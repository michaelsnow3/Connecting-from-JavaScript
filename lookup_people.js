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

const name = process.argv[2];

function selectByName (inputName, callback) {
  client.connect((err) => {
    if (err) {
      return console.error("Connection Error", err);
    }
      client.query(`SELECT * FROM famous_people
        WHERE first_name = $1 OR last_name = $1`, [inputName], (err, result) => {
        if (err) {
          return console.error("error running query", err);
        }
        if(inDatabase(result)){
          displayPerson(result);
        }
    });
  });
}

function displayPerson(people) {
  people.rows.forEach(function(row, i){
    console.log(`- ${i + 1}: ${row.first_name} ${row.last_name}, born '${row.birthdate.toISOString().split('T')[0]}'`);
  });
  client.end();
}

function inDatabase (dbResult) {
  //if name is not in db
  if(!dbResult.rowCount){
   console.log("name is not in database");
   client.end();
   return false;
  } else{
    return true;
  }
}

selectByName(name, displayPerson);