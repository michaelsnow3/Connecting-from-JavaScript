const settings = require("./settings"); // settings.json
var knex = require('knex')({
  client: 'pg',
  connection: {
    user     : settings.user,
    password : settings.password,
    database : settings.database,
    host     : settings.hostname,
    port     : settings.port,
    ssl      : settings.ssl
  }
});

const inputName = process.argv[2];

function selectByName (name, callback) {
  if(!inputName) {
    console.log('No name entered');
    close();
    return 0;
  }
  knex.select().table('famous_people')
    .where({'first_name': name})
    .orWhere({'last_name': name})
    .asCallback(function(err, result) {
      callback(err, result);
    })
}

function displayPerson(err, people) {
  if(err) console.log(err);
  if(validName(people)){
    people.forEach(function(row, i){
      console.log(`- ${i + 1}: ${row.first_name} ${row.last_name}, born '${row.birthdate.toISOString().split('T')[0]}'`);
    });
  }
  close();
}

function validName(peopleSelected) {
  if(peopleSelected[0]) return true;

  console.log("name is not in database");
  return false;
}

function close() {
  knex.destroy();
}

selectByName(inputName, displayPerson);