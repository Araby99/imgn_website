const { Router } = require("express");
const { getAllTags, createTags } = require("../controllers/tags.controller");
const router = Router();

router.get("/", getAllTags)
router.post("/", createTags)

module.exports = router;