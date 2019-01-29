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

const inputFirstName = process.argv[2];
const inputLastName = process.argv[3];
const inputDateOfBirth = process.argv[4];

function addPerson (firstName, lastName, dateOfBirth) {
  knex('famous_people')
    .insert({
      first_name: firstName,
      last_name: lastName,
      birthdate: dateOfBirth
    })
    .returning('*')
    .catch(err => console.log(err.message))
    .then(function() {
      knex.destroy();
    });
}

addPerson(inputFirstName, inputLastName, inputDateOfBirth);
