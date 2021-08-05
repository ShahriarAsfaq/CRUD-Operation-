

const {
perticipent,
perticipentCreation,
} = require("./../model/mathOlympiad.model");

getMo = (req,res)=>{
    res.render("mathOlympiad/register.ejs",{ errors: req.flash("errors") });
};
postMo = (req,res)=>{
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
        postgres("perticipents")
          .insert({
            pname: name,
            catagory: catagory,
            contact: contact,
            institution: institution,
            total: total,
            paid: paid,
            selected: selected,
            t_shirt: t_shirt,
            reg_date: new Date(),
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
                user1[0].institution,
                user1[0].total,
                user1[0].paid,
                user1[0].selected,
                user1[0].t_shirt,
                user1[0].reg_date)
            })
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
    postgres("perticipents")
            .select ("*")
            .where("id","=",pid)
    .then((user3)=>{
        
        pay=user3[0].total;
    })

    postgres("perticipents")
    .where("id", "=", pid)
    .update({
        paid: 500
      })
      .then((user4)=>{  
        console.log("pay= ",pay);
          console.log(user4);
      })
    
     
    res.redirect("/list");
}
selectMo=(req,res)=>{
    res.redirect("/list");
}
module.exports={getMo,postMo,getMolist,deleteMo,paymentDoneMo,selectMo}