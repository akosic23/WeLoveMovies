const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
    const id = req.params.movieId;
    const movie = await service.read(id);
    if (movie) {
        res.locals.movie = movie;
        return next();
    }
    next({
        status: 404,
        message: "Movie cannot be found."
    });
}


async function list(req, res) {
    let isShowing = req.query.is_showing;
    const data = await service.list(isShowing);
    res.json({ data });
}

function read(req, res) {
    const { movie: data } = res.locals;
    res.json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), read],
    movieExists: asyncErrorBoundary(movieExists)
}