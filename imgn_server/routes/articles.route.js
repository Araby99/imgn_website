const { Router } = require("express");
const { getAllArticles, createArticles, getArticle, getLastThree, updateArticle, deleteArticle } = require("../controllers/articles.controller");
const { admin } = require("../middlewars/admin.middleware");
const router = Router();

router.post("/", getAllArticles)
router.get("/getLastThree", getLastThree)
router.get("/:id", getArticle)
router.post("/create", admin, createArticles)
router.post("/:_id", admin, updateArticle)
router.delete("/:_id", deleteArticle)

module.exports = router;