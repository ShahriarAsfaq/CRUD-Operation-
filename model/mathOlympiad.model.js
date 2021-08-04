let perticipent = {
    name: "",
    catagory: "",
    contact: "",
    institution: "",
    total: "",
    paid: "",
    selected: "",
    t_shirt: "",
    date: "",
  };
  
  const perticipentCreation = (name,catagory,contact,institution,total,paid,selected,t_shirt,date) => {
   perticipent.name=name;
   perticipent.catagory=catagory;
   perticipent.contact=contact;
   perticipent.institution=institution;
   perticipent.total=total;
   perticipent.paid=paid;
   perticipent.selected=selected;
   perticipent.t_shirt=t_shirt;
   perticipent.date=date;
  };
  module.exports = { perticipent, perticipentCreation };