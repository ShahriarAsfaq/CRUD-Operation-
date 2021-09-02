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

const perticipent= require("./../model/programingContest.model");


const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function autoMail(team_name,leader_emailAddress,member1_email, verficationCode) {
  try {
    vfCode = verficationCode.toString();
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
      to: leader_emailAddress,
      cc: member1_email,
      subject: "Verification ID",
      text: vfCode,
      html:
        " <b>Hello, Team "+team_name+"<br> <p> Registering for ICT FEST Programming Contest.<br><h4>Your verification code is :</h4><h1><t>" +
        vfCode +
        "</h1> <t><p>This is an automated email. Please do not reply to this email</p>.",
    };
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
    
const getPc = (req,res)=>{
        console.log("get pc te dhukse");
        res.render("ProgrammingContest/register.ejs");
};
const postPc = async(req,res)=>{
        const {team_name,
        institution_name,
        coach_name,
        coach_contact,
        coach_email,
        coach_t_shirt,
        leader_name,
        leader_contact,
        leader_email,
        leader_t_shirt,
        member1_name,
        member1_contact,
        member1_email,
        member1_t_shirt} = req.body;
        let selected = false;
        //console.log(name," ",catagory," ",contact," ",email," ",institution," ",t_shirt);
    
        const errors = [];
        if (!team_name || !leader_email || !leader_contact || !institution_name) {
          errors.push("All fields are required!");
        }
        if (errors.length > 0) {
            req.flash("errors", errors);
            res.redirect("/pcperticipentRegister");
          }
          else {
            let salt = await bcrypt1.genSalt(32);
            const verf_id = salt+"SUS";
            autoMail(team_name,leader_email,member1_email,verf_id);
         
            postgres("pcperticipents")
              .insert({
                team_name: team_name,
                 institution_name: institution_name,
                coach_name: coach_name,
                coach_contact: coach_contact,
                coach_email: coach_email,
                coach_t_shirt: coach_t_shirt,
                leader_name: leader_name,
                leader_contact: leader_contact,
                leader_email: leader_email,
                leader_t_shirt: leader_t_shirt,
                member1_name: member1_name,
                member1_contact: member1_contact,
                member1_email: member1_email,
                member1_t_shirt: member1_t_shirt,
                selected: selected,
                verificationID: verf_id,
              })
              .then(() => {
                errors.push("Success");
                req.flash("errors", errors);
                res.redirect("/pcperticipentRegister");
                
              })
              .catch((err) => {
                errors.push("user already exists with this email");
                console.log(err);
                req.flash("errors", errors);
                res.redirect("/pcperticipentRegister");
              });
          }
    };

const getPclist = (req,res)=>{
        let all_perticipent=[];
        let error="";
       
        
            postgres("pcperticipents")
                .select ("*")
            
            .then((user2) =>{
                all_perticipent=user2;
                
                res.render("ProgrammingContest/list.ejs",{
                    error: req.flash("error"),
                    perticipents: all_perticipent
                });
                })
            .catch((err) => {
                    error.push("user already exists with this email");
                    //console.log(err);
                    res.render("ProgrammingContest/list.ejs",{
                        error: req.flash("error", error),
                        perticipents: all_perticipent
                    });
                  });
        
    }
const deletePc=(req,res)=>{
        const pid =req.params.id;
        let errors=[];
     
        postgres('pcperticipents')
        .where('team_id','=', pid)
        .del()
        .then((deluser)=>{
            res.redirect("/pclist");
        })
        .catch((err) => {
            errors.push("Can't delete");
            console.log(err);
            req.flash("errors", errors);
            res.redirect("/pclist");
          });
        
    }
    
const paymentDonePc=(req,res)=>{
        const pid =req.params.id;
        let pay=0;
       
        postgres("pcperticipents")
                .select ("*")
                .where("id","=",pid)
        .then((user3)=>{
            
            pay=user3[0].total;
        })
    
        postgres("pcperticipents")
        .where("id", "=", pid)
        .update({
            paid: 500
          })
          .then((user4)=>{  
            console.log("pay= ",pay);
            res.redirect("/pclist");
          })
        
         
        
    }
const selectPc=(req,res)=>{
        const pid =req.params.id;
        console.log("team id = ",pid);
        let errors=[];
        
            postgres("pcperticipents")
            .where("team_id", "=", pid)
            .update({
                selected: true
              })
        .then((seluser)=>{
            res.redirect("/pclist");
        })
        .catch((err) => {
            errors.push("Can't delete");
            console.log(err);
            req.flash("errors", errors);
            res.redirect("/pclist");
          });
        
    }
module.exports={getPc,postPc,getPclist,deletePc,paymentDonePc,selectPc}