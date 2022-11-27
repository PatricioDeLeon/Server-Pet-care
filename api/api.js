var router = require('express').Router()

const connection = require("../config/db.connectio");
const moment = require('moment');

router.get("/", function (req, res) {
    res.status(200).json({ message: "DataBase Connected" });
  });

router.get("/get_all_users", (req, res) => {
  console.log('get_all_users');
  try {
    connection.query("SELECT * FROM pet_care_db.usuarios ", (err, result, field) => {
      if (err) throw err;
      res.send(result);
    })

  } catch (err) {
    res.send(err);
  }

});


router.post("/add_user_verify", (req, res) => {

  console.log(req.body);
 
  let email = req.body.email
  let password = req.body.password
  let name = req.body.name;
  let phone = req.body.phone;
  let uid = req.body.uid_user;
  

  try {
    var success = true;
    connection.query(
      `SELECT name FROM usuarios WHERE email = '${email}'` , (err, result, fiel) =>{
        if(err) throw err;
        if(result.length > 0){
          success = false;
          console.log('ERROR, email alredy exist');
          res.send(success);
        }else{
          success = true;
          console.log('Account doesnt exist, proceeds to register...');
          connection.query( 
            `INSERT INTO pet_care_db.usuarios (name, email, password, phone, uid_user) VALUES(
            '${name}',
            '${email}',
            '${password}',
            '${phone}',
            '${uid}' )`, (err, result, field) =>{
              if(err) throw err;
              if(result['affectedRows'] > 0)
              res.send(success);
               
          });
        }
       
      }

    );
  } catch (err) {
    res.send(err);
  }

});


router.get('/get_user_by_id/:id', (req, res) => {

  let id = JSON.parse(req.params.id);

  try {
    connection.query( 
      `SELECT id, name,email,phone FROM pet_care_db.usuarios  WHERE Id = ${id}`, (err, result, field) =>{
        if(err) throw err;
        if(result){
          console.log('sucess');
          res.send(result);
        }
        else{
          console.oog('NONN')
          res.send(false);
        }  
    });
  } catch (err) {
    res.send(err);
  }


});

router.post("/update_user", (req, res) => {
    let data = JSON.parse(req.body.data);
 // let data = req.body.data;
  console.log(data);
  let id = data.id;
  let name = data.name;
  let email = data.email;
  let phone = data.phone;
try {
  connection.query( 
    `UPDATE pet_care_db.usuarios SET
    name = '${name}',
    email = '${email}',
    phone = '${phone}' WHERE Id = ${id}`, (err, result, field) =>{
      if(err) throw err;

      if(result['affectedRows'] > 0){
        console.log(result)
        res.send(true);
      }
      else{
        console.olog('Data doesnt updated correctly')
        res.send(false);
      }  
  });
} catch (err) {
  res.send(err);
}

});

router.post("/auth_login", (req, res) => {
    let data = JSON.parse(req.body.data);
   console.log(req.body.data)
   //let data = req.body.data;
  let email = data.email;
  let password = data.password;

  console.log(email + " "  + password);

  try {
    connection.query(
      `SELECT id, name, email, phone FROM pet_care_db.usuarios  WHERE email = '${email}' AND password = '${password}'`,
      (err, result, field) => {
        if (err) throw err;

        if (result.length > 0) {
          console.log(result);
          res.send(result);
        } else {
          console.log('Error')
          res.send(false);
        }
      });
  } catch (err) {
    res.send(err);
  }

});

// pets 

router.post("/add_pet", (req, res) => {

    console.log(JSON.parse(req.body.data));
   let data = JSON.parse(req.body.data);
  //let data = req.body.data;
 
  let id_user = data.id_user;
  let name_pet = data.name_pet;
  let age_pet = data.age_pet;
  let race_pet = data.race_pet;
  let weight_pet = data.weight_pet;
  let additional_pet = data.additional_pet;

  try {
    connection.query(
      `INSERT INTO pet_care_db.users_pets (id_user, name_pet, age_pet, race_pet, weight_pet, additional_pet) 
    VALUES('${id_user}', '${name_pet}', '${age_pet}', '${race_pet}', '${weight_pet}', '${additional_pet}') `,
      (err, result, field) => {
        if (err) throw err;

        if (result['affectedRows'] > 0) {
          console.log(result);
          res.send(true);
        }else{
          res.send(false);
        }
      });
  } catch (err) {
    res.send(err);
  }

});

router.post("/update_pet", (req, res) => {
    console.log(JSON.parse(req.body.data));
    let { id, name_pet, age_pet, race_pet, weight_pet, additional_pet } = JSON.parse(req.body.data);
  //let { id, name_pet, age_pet, race_pet, weight_pet, additional_pet } = req.body.data;
  try {
    connection.query( 
      `UPDATE pet_care_db.users_pets SET
      name_pet = '${name_pet}',
      age_pet = '${age_pet}',
      race_pet = '${race_pet}',
      weight_pet = '${weight_pet}',
      additional_pet = '${additional_pet}'
      WHERE id = ${id}`, (err, result, field) =>{
        if(err) throw err;
        if(result['affectedRows'] > 0){
          console.log(result)
          res.send(true);
        }else{
          console.log('pet updated failed')
          res.send(false);
        }
    });  

  } catch (err) {
    res.send(err);
  }

});

router.post("/delete_pet/:id", (req, res) => {
   let id = JSON.parse(req.params.id);
  //let id = req.params.id;
  try {
    connection.query( 
      `DELETE FROM pet_care_db.users_pets WHERE id = '${id}'`, (err, result, field) =>{
        if(err) throw err;
        if(result['affectedRows'] > 0){
          console.log("Pet deleted: " + JSON.stringify(result))
          res.send(true);
        }else{
          console.log("Pet deleted: Failed" )
          res.send(false);
        }
    });  

  } catch (err) {
    res.send(err);
  }

});


router.get("/get_pet_by_user/:id", (req, res) => {
  let id_user = JSON.parse(req.params.id);
  console.log(id_user);
  try {
    connection.query(
      `SELECT * FROM pet_care_db.users_pets WHERE id_user = '${id_user}'`, (err, result, field) => {
        if (err) throw err;
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send(false);
        }
      });

  } catch (err) {
    res.send(err);
  }

});


// vaccines 
router.get("/get_vaccine_by_pet/:id", (req, res) => {
  let id_pet = JSON.parse(req.params.id);
  try {
    connection.query(
      `SELECT * FROM pet_care_db.vaccines_pet WHERE id_pet = '${id_pet}'`, (err, result, field) => {
        if (err) throw err;
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send(false);
        }
      });

  } catch (err) {
    res.send(err);
  }

});


router.post("/add_vaccine_pet", (req, res) => {

  console.log(req.body)
  let data = req.body;
  let id_user = data.id_user;
  let id_pet = data.id_pet;
  let name_pet = data.name_pet;
  let race_pet = data.race_pet;
  let vaccine_vac = data.vaccine_vac;
  let message_vac = data.message_vac;
  let date = moment().format('YYYY/MM/DD');

  try {
    connection.query(
      `INSERT INTO pet_care_db.vaccines_pet (
      id_user,
      id_pet,
      name_pet,
      race_pet,
      vaccine_vac,
      message_vac,
      date_vac) 
      VALUES (
        '${id_user}',
        '${id_pet}',
        '${name_pet}',
        '${race_pet}',
        '${vaccine_vac}',
        '${message_vac}',
        '${date}'
      )`, (err, result, field) => {
      if (err) throw err;
      console.log(result);
      if (result['affectedRows'] > 0) {
        res.send(true);
      } else {
        res.send(false);
      }
    });
  } catch (err) {
    res.send(err);
  }
});

router.get("/delete_vaccine_pet/:id", (req, res) => {
  console.log(req.params)
  let id_vac = req.params.id
  try {
    connection.query(
      `DELETE FROM vaccines_pet WHERE id_vac = '${id_vac}'`, (err, result, field) => {
      if (err) throw err;
      console.log(result);
      if (result['affectedRows'] > 0) {
        res.send(true);
      } else {
        res.send(false);
      }
    });
  } catch (err) {
    res.send(err);
  }
});
  



module.exports = router;