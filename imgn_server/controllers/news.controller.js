const { news } = require("../models/news.model")

exports.getAllNews = (req, res) => {
    if (!req.query.page) {
        req.query.page = 1;
    }
    const { name, _id, createdAt } = req.body;
    let filters = {};
    if (name) filters.name = name;
    if (_id) filters._id = _id;
    if (createdAt) {
        const start = new Date(createdAt);
        let end = new Date();
        end = new Date(end.setDate(start.getDate() + 1));
        end.setUTCHours(0)
        end.setUTCMinutes(0)
        end.setUTCMilliseconds(0)
        filters.createdAt = { $gte: start, $lt: end }
        console.log(start, end);
    }
    news.find(filters).sort({ updatedAt: -1 }).then(result => {
        const perPage = 9;
        const pages = Math.ceil(result.length / perPage);
        const from = (req.query.page - 1) * perPage;
        const to = (req.query.page - 1) * perPage + perPage;
        let response = {
            data: result.filter((i, index) => index >= from && index < to),
            total: result.length,
            perPage
        }
        let links = [
            {
                url: req.query.page != pages ? `${req.baseUrl}?page=${Number(req.query.page) + 1}` : null
            },
            {
                url: req.query.page != 1 ? `${req.baseUrl}?page=${req.query.page - 1}` : null
            }
        ];
        for (let i = 1; i <= pages; i++) {
            const element = {
                url: `${req.baseUrl}?page=${i}`,
                label: i,
                active: req.query.page == i
            }
            links.push(element);
        }
        response.links = links;
        res.send(response)
    }).catch(err => console.log(err))
}

exports.getLastThree = (req, res) => {
    news.find({}).sort({ updatedAt: -1 }).limit(3).then(result => {
        res.send(result)
    })
}

exports.getNews = (req, res) => {
    const { id } = req.params;
    news.findById(id).then(result => {
        res.send(result)
    }).catch(err => res.sendStatus(404))
}

exports.createNews = (req, res) => {
    const { title, subTitle, hero, description } = req.body;
    if (!title || !subTitle || !hero || !description) {
        res.sendStatus(400);
    } else {
        news.create(req.body).then(result => {
            res.send(result);
        })
    }
}

exports.updateNews = (req, res) => {
    const { _id } = req.params;
    news.findOneAndUpdate({ _id }, req.body, { new: true }).then(result => {
        res.send(result)
    })
}

exports.deleteNews = (req, res) => {
    const { _id } = req.params;
    news.findByIdAndDelete(_id).then(result => res.sendStatus(200))
}

exports.getRelated = async (req, res) => {
    const { tag } = req.params;
    news.find({ $text: { $search: tag.split(",").join(" ") } }).then(result => res.send(result))
}

exports.search = async (req, res) => {
    const { tag } = req.params;
    news.find({ $text: { $search: `\"${tag.split(",").join(" ")}\"` } }).then(result => res.send(result))
}