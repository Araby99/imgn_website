const { Router } = require("express");
const { login, createAdmin, updateAdmin } = require("../controllers/admin.controller");
const router = Router();

router.post("/login", login)
router.post("/create", createAdmin)
router.put("/update/:_id", updateAdmin)

module.exports = router;