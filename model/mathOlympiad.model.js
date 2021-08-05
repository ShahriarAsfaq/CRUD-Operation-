let perticipent = {
    pname: "",
    catagory: "",
    contact: "",
    institution: "",
    total: "",
    paid: "",
    selected: "",
    t_shirt: "",
    reg_date: "",
  };
  
  const perticipentCreation = (pname,catagory,contact,institution,total,paid,selected,t_shirt,reg_date) => {
   perticipent.pname=pname;
   perticipent.catagory=catagory;
   perticipent.contact=contact;
   perticipent.institution=institution;
   perticipent.total=total;
   perticipent.paid=paid;
   perticipent.selected=selected;
   perticipent.t_shirt=t_shirt;
   perticipent.reg_date=reg_date;
  };
  module.exports = { perticipent, perticipentCreation };