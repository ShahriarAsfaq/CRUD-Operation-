const express = require("express");
const bodyPerser = require("body-parser");
const router = express.Router();
const {
  ensureAuthenticated,
  addUserData,
} = require("./../middleware/userMiddlewire.middlewire");

const {
  getPc,
  postPc,
  getPclist,
  deletePc,
  paymentDonePc,
  selectPc,
} = require("./../controller/programingContest.controller");
router.use(bodyPerser.urlencoded({ extended: false }));
router.use(bodyPerser.json());

router.get("/pcperticipentRegister",ensureAuthenticated,addUserData, getPc);
router.post("/pcperticipentRegister",ensureAuthenticated,addUserData, postPc);
router.get("/pclist",ensureAuthenticated,addUserData, getPclist);
router.get("/pcdelete/:id",ensureAuthenticated,addUserData, deletePc);
router.get("/pcpaymentDone/:id",ensureAuthenticated,addUserData, paymentDonePc);
router.get("/pcselect/:id",ensureAuthenticated,addUserData,selectPc);

module.exports = router;