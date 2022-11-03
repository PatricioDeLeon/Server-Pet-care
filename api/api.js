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

  data = req.body;
  let dataUser = data['data'][0];
  try {
    var existingAccont = false;
    connection.query(
      `SELECT name FROM usuarios WHERE email = '${dataUser['email']}'` , (err, result, fiel) =>{
        if(err) throw err;

        if(result.length > 0){
          existingAccont = true;
          console.log('email ya usao');
          res.send(existingAccont);
        }else{
          existingAccont = false;
          console.log('No existe la cueta, proceder a registrarla...');
          connection.query( 
            `INSERT INTO pet_care_db.usuarios (name, email, password, phone) VALUES(
            '${dataUser['name']}',
            '${dataUser['email']}',
            '${dataUser['password']}',
            '${dataUser['phone']}')`, (err, result, field) =>{
              if(err) throw err;
              res.send(result);
               
          });
        }
       
      }

    );


    
  } catch (err) {
    res.send(err);
  }

});

router.post("/update_user", (req, res) => {
  data = req.body;
  let dataUser = data['data'][0];
  console.log(dataUser['name']);
try {
  connection.query( 
    `UPDATE pet_care_db.usuarios SET
    name = '${dataUser['name']}',
    email = '${dataUser['email']}',
    phone = '${dataUser['phone']}' WHERE Id = ${dataUser['id'] }`, (err, result, field) =>{
      if(err) throw err;
      res.send(result);    
  });
} catch (err) {
  res.send(err);
}

});

router.post("/auth_login", (req, res) => {
  data = req.body;
  let dataUser = data['data'][0];
  
try {
  connection.query( 
    `SELECT name, email, phone FROM pet_care_db.usuarios  WHERE email = '${dataUser['email']}' AND password = '${dataUser['password']}'`,
     (err, result, field) =>{
      if(err) throw err;

      if(result.length > 0){

        res.send('Enter -> ' + JSON.stringify(result)); 

      }else{
        res.send('Cuenta no existe');
      }

         
  });
} catch (err) {
  res.send(err);
}

});

router.post("/add_pet", (req, res) => {
  data = req.body;
  let dataPet = data['data'][0];

  try {
    connection.query(
      `INSERT INTO pet_care_db.users_pets (id_user, name_pet, age_pet, race_pet, weight_pet, additional_pet) 
    VALUES('${dataPet['id_user']}', '${dataPet['name_pet']}', '${dataPet['age_pet']}', '${dataPet['race_pet']}', '${dataPet['weight_pet']}', '${dataPet['additional_pet']}') `,
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
  data = req.body;
  let dataPet = data['data'][0];

  try {
    connection.query( 
      `UPDATE pet_care_db.users_pets SET
      name_pet = '${dataPet['name_pet']}',
      age_pet = '${dataPet['age_pet']}',
      race_pet = '${dataPet['race_pet']}',
      weight_pet = '${dataPet['weight_pet']}',
      additional_pet = '${dataPet['additional_pet']}'
      WHERE id_user = ${dataPet['id_user'] }`, (err, result, field) =>{
        if(err) throw err;
        if(result){
          res.send(result);
        }    
    });  

  } catch (err) {
    res.send(err);
  }

});

router.post("/delete_pet", (req, res) => {
  data = req.body;
  let dataPet = data['data'][0];

  try {
    connection.query( 
      `DELETE FROM pet_care_db.users_pets WHERE id = '${dataPet['id']}'`, (err, result, field) =>{
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