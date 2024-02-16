const { Router } = require("express");
const { updateAbout, getAbout } = require("../controllers/about.controller");
const { admin } = require("../middlewars/admin.middleware");
const router = Router();

router.get("/", getAbout)
router.put("/", admin, updateAbout)

module.exports = router;