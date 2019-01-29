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
      result.rows.forEach(function(row, i){
        callback(row, i);
      });
      client.end();
  });
}

function displayPerson(person, num) {
  console.log(`- ${num + 1}: ${person.first_name} ${person.last_name}, born '${person.birthdate.toISOString().split('T')[0]}'`);
}
