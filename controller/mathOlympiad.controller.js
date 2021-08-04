const {
perticipent,
perticipentCreation,
} = require("./../model/mathOlympiad.model");

getMo = (req,res)=>{
    res.render("mathOlympiad/register.ejs");
};
postMo = (req,res)=>{
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