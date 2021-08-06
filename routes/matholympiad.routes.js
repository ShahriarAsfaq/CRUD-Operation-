const express = require("express");
const bodyPerser = require("body-parser");
const router = express.Router();
const {
  ensureAuthenticated,
  addUserData,
} = require("./../middleware/userMiddlewire.middlewire");

const {
  getMo,
  postMo,
  getMolist,
  deleteMo,
  paymentDoneMo,
  selectMo,
  editMo,
  getUpdateFormMo,
  postUpdateFormMo,
} = require("./../controller/mathOlympiad.controller");
router.use(bodyPerser.urlencoded({ extended: false }));
router.use(bodyPerser.json());

router.get("/perticipentRegister",ensureAuthenticated,addUserData, getMo);
router.post("/perticipentRegister",ensureAuthenticated,addUserData, postMo);
router.get("/list",ensureAuthenticated,addUserData, getMolist);
router.get("/delete/:id",ensureAuthenticated,addUserData, deleteMo);
router.get("/paymentDone/:id",ensureAuthenticated,addUserData, paymentDoneMo);
router.get("/select/:id",ensureAuthenticated,addUserData,selectMo);
router.get("/edit/:id",ensureAuthenticated,addUserData,editMo);
router.get("/updateform",ensureAuthenticated,addUserData,getUpdateFormMo);
router.post("/updateform",ensureAuthenticated,addUserData,postUpdateFormMo);

module.exports = router;

