const {
perticipent,
perticipentCreation,
} = require("./../model/mathOlympiad.model");

getMo = (req,res)=>{
    res.render("mathOlympiad/register.ejs");
};
postMo = (req,res)=>{
    const {name,catagory,contact,email,institution,t_shirt} = req.body;
   /* let registrationFee=0;
    if(catagory="school"){
        registrationFee=250;
    }
    else if (catagory="college"){
        registrationFee=400;
    }
    else{
        registrationFee=500;
    }
    let total=registrationFee;
    let paid=0;
    let selected = false;*/
    console.log(name," ",catagory," ",contact," ",email," ",institution," ",t_shirt);
    res.render("mathOlympiad/register.ejs");
};
getMolist = (req,res)=>{
    res.render("mathOlympiad/list.ejs");
}
deleteMo=(req,res)=>{
    const id =req.params.id;
    console.log(id);
    res.render("mathOlympiad/list.ejs")
}

module.exports={getMo,postMo,getMolist,deleteMo}