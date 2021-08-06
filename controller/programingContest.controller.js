

const perticipent= require("./../model/programingContest.model");
    
const getPc = (req,res)=>{
        console.log("get pc te dhukse");
        res.render("ProgrammingContest/register.ejs");
};
const postPc = (req,res)=>{
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