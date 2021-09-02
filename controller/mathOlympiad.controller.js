require("dotenv").config();
const random = require("random");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt-nodejs");
const bcrypt1 = require("bcryptjs");
CLIENT_ID = "938339187947-vlb3niun7nv2f7044677cepp4fjs1f3f.apps.googleusercontent.com";
CLIENT_SECRET = "hHy81tKdKjUhKIlsARy9d-LY";
REDIRECT_URI = "https://developers.google.com/oauthplayground";
REFRESH_TOKEN = "1//04VDVw3gRf_PTCgYIARAAGAQSNwF-L9Ir_4glIXjT3uvIOGxnOOp70cpncl3CZJXDGFC9Bkgeh9EXTq8mcrtpF3KafC8S-9Jo8a8";
const knex = require("knex");
let postgres = knex({
  client: process.env.client,
  connection: {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  },
});

const { render } = require("ejs");
const {
perticipent,
perticipentCreation,
} = require("./../model/mathOlympiad.model");


const {
  updatemo,
  updatemoCreation,
  } = require("./../model/updateModel.model");


  
  
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  
  async function autoMail(name,emailAddress, verficationCode) {
    try {
      vfCode = verficationCode.toString();
      console.log(verficationCode);
      const accessToken = await oAuth2Client.getAccessToken();
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "shahriarutsha@gmail.com",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
  
      const mailOptions = {
        from: "ICT_Fest<shahriarutsha@gmail.com>",
        to: emailAddress,
        subject: "Verification ID",
        text: vfCode,
        html:
          " <b>Hello, Mr. "+name+"<br> <p> Registering for ICT FEST Math Olympiad.<br><h4>Your verification code is :</h4><h1><t>" +
          vfCode +
          "</h1> <t><p>This is an automated email. Please do not reply to this email</p>.",
      };
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }

getMo = (req,res)=>{
    res.render("mathOlympiad/register.ejs",{ errors: req.flash("errors") });
};
postMo = async(req,res)=>{
    const {name,catagory,contact,email,institution,t_shirt} = req.body;
    let registrationFee=0;
    if(catagory=="school"){
        registrationFee=250;
    }
    else if (catagory=="college"){
        registrationFee=400;
    }
    else{
        registrationFee=500;
    }
    let total=registrationFee;
    let paid=0;
    let selected = false;
    console.log(name," ",catagory," ",contact," ",email," ",institution," ",t_shirt);

    const errors = [];
    if (!name || !email || !contact || !institution) {
      errors.push("All fields are required!");
    }
    if (errors.length > 0) {
        req.flash("errors", errors);
        res.redirect("/perticipentRegister");
      }
      else {
        //const verf_id = random.int((min = 1111), (max = 9999));
       // console.log(verf_id);
        
        let salt = await bcrypt1.genSalt(32);
        const verf_id = salt+"SUS";
        autoMail(name,email,verf_id);
        console.log("salt = ",verf_id);
        postgres("perticipents")
          .insert({
            pname: name,
            catagory: catagory,
            contact: contact,
            email: email,
            institution: institution,
            total: total,
            paid: paid,
            selected: selected,
            t_shirt: t_shirt,
            reg_date: new Date(),
            verificationID: verf_id,
          })
          .then(() => {
            
            postgres("perticipents")
            .select ("*")
            .where("pname","=",name,"AND","contact","=",contact)
            .then((user1)=>{
              perticipentCreation(
                user1[0].pname,
                user1[0].catagory,
                user1[0].contact,
                user1[0].email,
                user1[0].institution,
                user1[0].total,
                user1[0].paid,
                user1[0].selected,
                user1[0].t_shirt,
                user1[0].reg_date
                )
                
                //const vid = user1[0].id;
                //const binid = vid.toString(2);
                //console.log("id size= ",binid.toString().length);

              })
            errors.push("Success");
            req.flash("errors", errors);
            res.redirect("/perticipentRegister");
            
          })
          .catch((err) => {
            errors.push("user already exists with this email");
            console.log(err);
            req.flash("errors", errors);
            res.redirect("/perticipentRegister");
          });
      }
   // res.render("mathOlympiad/register.ejs");
};
getMolist = (req,res)=>{
    let all_perticipent=[];
    let error="";
    
        postgres("perticipents")
            .select ("*")
        
        .then((user2) =>{
            all_perticipent=user2;
            
            res.render("mathOlympiad/list.ejs",{
                error: req.flash("error"),
                perticipents: all_perticipent
            });
            })
        .catch((err) => {
                error.push("user already exists with this email");
                //console.log(err);
                res.render("mathOlympiad/list.ejs",{
                    error: req.flash("error", error),
                    perticipents: all_perticipent
                });
              });
    
}
deleteMo=(req,res)=>{
    const pid =req.params.id;
    let errors=[];
    const knex = require("knex");
        const postgres = knex({
          client: process.env.client,
          connection: {
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: process.env.database,
          },
        });
    postgres('perticipents')
    .where('id','=', pid)
    .del()
    .then((deluser)=>{
        res.redirect("/list");
    })
    .catch((err) => {
        errors.push("Can't delete");
        console.log(err);
        req.flash("errors", errors);
        res.redirect("/list");
      });
    
}

paymentDoneMo=(req,res)=>{
    const pid =req.params.id;
    let pay=0;
 
    postgres("perticipents")
            .select ("*")
            .where("id","=",pid)
    .then((user3)=>{
        
        pay=user3[0].total;

        postgres("perticipents")
    .where("id", "=", pid)
    .update({
        paid: pay
      })
      .then((user4)=>{  
        console.log("pay= ",pay);
        res.redirect("/list");
      })

    })

    
    
     
    
}
selectMo=(req,res)=>{
    const pid =req.params.id;
    let errors=[];
  
        postgres("perticipents")
        .where("id", "=", pid)
        .update({
            selected: true
          })
    .then((seluser)=>{
        res.redirect("/list");
    })
    .catch((err) => {
        errors.push("Can't delete");
        console.log(err);
        req.flash("errors", errors);
        res.redirect("/list");
      });
    
}

getUpdateFormMo=()=>{

}


editMo= (req,res)=>{
  const pid =req.params.id;
  updatemoCreation(pid);
  res.render("mathOlympiad/updateform.ejs");

}
postUpdateFormMo=(req,res)=>{
  const {name,catagory,contact,email,institution,t_shirt} = req.body;
  /*
  if(name==""){
    name=perticipent.pname;
  }
  if(catagory==""){
    catagory=perticipent.catagory;
  }
  if(contact==""){
    contact=perticipent.contact;
  }
  if(email==""){
    email=perticipent.email;
  }
  if(institution==""){
  institution=perticipent.institution;
  }
  if(t_shirt==""){
    t_shirt=perticipent.t_shirt;
  }
  */
  let registrationFee=0;
    if(catagory=="school"){
        registrationFee=250;
    }
    else if (catagory=="college"){
        registrationFee=400;
    }
    else{
        registrationFee=500;
    }
    let total=registrationFee;
  let errors=[];
  
        postgres("perticipents")
        .where("id", "=", updatemo.pid)
        .update({
          pname: name,
          catagory: catagory,
          contact: contact,
          email: email,
          institution: institution,
          total: total,
          t_shirt: t_shirt,
          reg_date: new Date(),
          })
    .then((seluser)=>{
        res.redirect("/list");
    })
    .catch((err) => {
        errors.push("Can't delete");
        console.log(err);
        req.flash("errors", errors);
        res.redirect("/list");
      });
}
module.exports={getMo,postMo,getMolist,deleteMo,paymentDoneMo,selectMo,editMo,getUpdateFormMo,postUpdateFormMo}