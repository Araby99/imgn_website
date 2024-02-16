const { Router } = require("express");
const { admin } = require("../middlewars/admin.middleware");
const { getAllSocial, createSocial, deleteSocial, updateSocial } = require("../controllers/social.controller");
const router = Router();

router.get("/", getAllSocial)
router.post("/", admin, createSocial)
router.put("/", admin, updateSocial)
router.delete("/:id", admin, deleteSocial)

module.exports = router;