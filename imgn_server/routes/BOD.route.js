const { Router } = require("express");
const { admin } = require("../middlewars/admin.middleware");
const { getAllBOD, createBOD, updateBOD, deleteBOD, getBOD } = require("../controllers/BOD.controller");
const router = Router();

router.get("/", getAllBOD)
router.get("/:_id", getBOD)
router.post("/create", admin, createBOD)
router.put("/:_id", admin, updateBOD)
router.delete("/:_id", deleteBOD)

module.exports = router;