var router = require('express').Router()

const connection = require("../config/db.connectio");
const superCode = process.env.code;

router.get("/", function (req, res) {
    res.status(200).json({ message: "DataBase Connected" });
});


router.post("/add_vets_verify", (req, res) => {
    console.log(req.body);
    let code = req.body.code;
    let name = req.body.name_vet;
    let email = req.body.email_vet
    let password = req.body.password_vet
    let cedula = req.body.cedula_vet
    let phone = req.body.phone_vet;
    let uid = req.body.uid_vet;
    let aux = 0;
    
  try {

    // GET code from requests_code_vet
    connection.query(
      `SELECT code_req FROM pet_care_db.requests_code_vet WHERE email_vet = '${email}'`, (err, code_req, field) => {
        if (err) throw err;
        if (code_req[0]['code_req'] == code) {
          console.log("Correct: " + code_req[0]['code_req'])

          var success = true;
          connection.query(
            `SELECT email_vet, cedula_vet FROM veterinarios`, (err, result, fiel) => {
              if (err) throw err;

              result.forEach(element => {
                console.log(element);

                if (element['email_vet'] == email || element['cedula_vet'] == cedula) {
                  aux++;
                }
              });
              if (aux > 0) {
                success = false;
                console.log('ERROR, email or cedula vets alredy exist');
                res.send(success);
              } else {
                success = true;
                console.log('Account doesnt exist, proceeds to register...');
                connection.query(
                  `INSERT INTO pet_care_db.veterinarios (name_vet, email_vet, password_vet, cedula_vet, phone_vet, uid_vet) VALUES(
                      '${name}',
                      '${email}',
                      '${password}',
                      '${cedula}',
                      '${phone}',
                      '${uid}' )`, (err, result, field) => {
                  if (err) throw err;
                  if (result['affectedRows'] > 0) {
                    res.send(success);
                  }
                });
              }
            });
        }else{
          res.send("BadCode")
        }
      });
  } catch (err) {
    res.send(err);
  }

   



});

router.post("/auth_login_vet", (req, res) => {
   
console.log(req.body)
  let data = req.body;
  let email = data.email_vet;
  let password = data.password_vet;
  try {
    connection.query(
      `SELECT id_vet, name_vet, email_vet, cedula_vet, phone_vet FROM pet_care_db.veterinarios  WHERE email_vet = '${email}' AND password_vet = '${password}'`,
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

router.get('/get_vet_by_id/:id', (req, res) => {
    console.log(req.params.id);
    let id = JSON.parse(req.params.id);
  
    try {
      connection.query( 
        `SELECT id_vet, name_vet, email_vet, cedula_vet, phone_vet FROM pet_care_db.veterinarios  WHERE id_vet = '${id}'`, (err, result, field) =>{
          if(err) throw err;
          if(result){
            console.log('sucess');
            res.send(result);
          }
          else{
            console.log('NONN')
            res.send(false);
          }  
      });
    } catch (err) {
      res.send(err);
    }
  
  
  });

  router.post("/update_vet", (req, res) => {
    let data = req.body;
 // let data = req.body.data;
  console.log(data);
  let id = data.id_vet;
  let name = data.name_vet;
  let email = data.email_vet;
  let phone = data.phone_vet;
try {
  connection.query( 
    `UPDATE pet_care_db.veterinarios SET
    name_vet = '${name}',
    email_vet = '${email}',
    phone_vet = '${phone}' WHERE id_vet = ${id}`, (err, result, field) =>{
      if(err) throw err;

      if(result['affectedRows'] > 0){
        console.log(result)
        res.send(true);
      }
      else{
        console.log('Data doesnt updated correctly')
        res.send(false);
      }  
  });
} catch (err) {
  res.send(err);
}

});

router.post("/add_req_vet", (req, res) => {
  let data = req.body
  console.log(req.body);

  let email_vet = data.email_vet;
  let message_req = data.message_req;

  try {
    connection.query(
      `SELECT * FROM pet_care_db.requests_code_vet  WHERE email_vet= '${email_vet}'`, (err, result, field) => {
        if (err) throw err;
        if (result.length == 0) {
          console.log('esta vacio, se registrara en: pet_care_db.requests_code_vet ');

          connection.query(
            `INSERT INTO pet_care_db.requests_code_vet (email_vet, message_req, status_req) VALUES(
               '${email_vet}',
               '${message_req}',
               '0' )`, (err, result, field) => {
            if (err) throw err;
            if (result['affectedRows'] > 0) {
              console.log('vet account registred!!');
              res.send(true);
            } else {
              console.log("vet account registred failed :(");
              res.send(false);
            }
          });

        } else if (result.length > 0) {
          console.log('ya se hizo una peticion anteriormente');
          res.send("exist");
        }
      });
  } catch (err) {
    res.send(err);
  }
})

router.post("/ckeck_status_code_vet", (req, res) => {
  let email = req.body.email_vet;
  try {
    connection.query(
      `SELECT * FROM pet_care_db.requests_code_vet WHERE email_vet= '${email}'`, (err, result, field) => {
        if (err) throw err;
        console.log(result)
        if (result.length > 0) {
          connection.query(
            `SELECT code_req FROM pet_care_db.requests_code_vet  WHERE email_vet = '${email}'`, (err, data, field) => {
              if (err) throw err;
              console.log(data[0]['code_req'])
              if (data[0]['code_req'] == null) {
                console.log("peticion aun esta siendo revisada");
                res.send(false);

              } else {

                console.log("peticion aun esta siendo revisada");
                console.log("enviando codigo");

                res.send(data[0]['code_req']);

              }

            });
        } else {
          console.log('no existe peticion con este email');
          res.send("noExist");
        }
      });

  } catch (err) {
    res.send(err);
  }
 } )

 router.get("/manage_req_vet/:id/:email", (req, res) => {
  let id = req.params.id
  let email = req.params.email
  try {

    console.log(id + " " + email);

    let value = Math.floor(Math.random() * 9999) + 1000;

    console.log(value);

    if(id == 1){
      connection.query(
        `UPDATE pet_care_db.requests_code_vet SET
        code_req = '${value}', status_req = '1' WHERE email_vet = '${email}'`, (err, result, field) => {
          if (err) throw err;
          console.log(result)
          if (result.affectedRows > 0) {
            res.send(true);
          } else {
            console.log('no existe peticion con este email');
            res.send("noExist");
          }
        });

    }

    if(id == 0){

      connection.query(
        `DELETE FROM pet_care_db.requests_code_vet WHERE email_vet = '${email}'`, (err, result, field) => {
          if (err) throw err;
          console.log(result)
          if (result.affectedRows > 0) {
            res.send(true);
          } else {
            console.log('no existe peticion con este email');
            res.send("noExist");
          }
        });

    }
   

  } catch (err) {
    res.send(err);
  }
 } );

 router.get("/get_all_requests", (req, res) => {

  connection.query(
    `SELECT email_vet, message_req FROM pet_care_db.requests_code_vet WHERE status_req = '0'`, (err, result, field) => {
      if (err) throw err;
      console.log(result)
      if (result) {
        res.send(result);
      } else {
        console.log('no existe peticion con este email');
        res.send("noExist");
      }
    });



 })


module.exports = router;