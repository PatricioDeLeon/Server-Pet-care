var router = require('express').Router()

const connection = require("../config/db.connectio");


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

  let email = req.body.email;;
  let password = req.body.password;
  let name = req.body.name;
  let phone = req.body.phone;
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
            `INSERT INTO pet_care_db.usuarios (name, email, password, phone) VALUES(
            '${name}',
            '${email}',
            '${password}',
            '${phone}')`, (err, result, field) =>{
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

router.post("/update_user", (req, res) => {
 
  let id = req.body.id;
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
try {
  connection.query( 
    `UPDATE pet_care_db.usuarios SET
    name = '${name}',
    email = '${email}',
    phone = '${phone}' WHERE Id = ${id}`, (err, result, field) =>{
      if(err) throw err;

      if(result['affectedRows'] > 0){
        res.send(true);
      }
      else{
        res.send(false);
      }  
  });
} catch (err) {
  res.send(err);
}

});

router.post("/auth_login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  try {
    connection.query(
      `SELECT name, email, phone FROM pet_care_db.usuarios  WHERE email = '${email}' AND password = '${password}'`,
      (err, result, field) => {
        if (err) throw err;

        if (result.length > 0) {
          res.send(result);
        } else {
          res.send('Cuenta no existe');
        }
      });
  } catch (err) {
    res.send(err);
  }

});

router.post("/add_pet", (req, res) => {
 
  let id_user = req.body.id_user;
  let name_pet = req.body.name_pet;
  let age_pet = req.body.age_pet;
  let race_pet = req.body.race_pet;
  let weight_pet = req.body.weight_pet;
  let additional_pet = req.body.additional_pet;

  try {
    connection.query(
      `INSERT INTO pet_care_db.users_pets (id_user, name_pet, age_pet, race_pet, weight_pet, additional_pet) 
    VALUES('${id_user}', '${name_pet}', '${age_pet}', '${race_pet}', '${weight_pet}', '${additional_pet}') `,
      (err, result, field) => {
        if (err) throw err;

        if (result['affectedRows'] > 0) {
          console.log(result);
          res.send(true);
        }
      });

  } catch (err) {
    res.send(err);
  }

});

router.post("/update_pet", (req, res) => {
  let { id, name_pet, age_pet, race_pet, weight_pet, additional_pet } = req.body;
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
          res.send(true);
        }else{
          res.send(false);
        }
    });  

  } catch (err) {
    res.send(err);
  }

});

router.post("/delete_pet/:id", (req, res) => {
  let id = req.params.id;

  try {
    connection.query( 
      `DELETE FROM pet_care_db.users_pets WHERE id = '${id}'`, (err, result, field) =>{
        if(err) throw err;
        if(result['affectedRows'] > 0){
          
          res.send(true);
        }else{
          res.send(false);
        }
    });  

  } catch (err) {
    res.send(err);
  }

});


router.get("/get_pet_by_user/:id", (req, res) => {
  let id_user = req.params.id;

  try {
    connection.query( 
      `SELECT * FROM pet_care_db.users_pets WHERE id_user = '${id_user}'`, (err, result, field) =>{
        if(err) throw err;
        if(result.length > 0){
          res.send(result);
        }else{
          res.send(false);
        }
    });  

  } catch (err) {
    res.send(err);
  }

});


  



module.exports = router;