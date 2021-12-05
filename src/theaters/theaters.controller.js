const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties");

const reduceMovies = reduceProperties("theater_id", {
    theaterId: ["movies", null, "theater_id"],
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    created: ["movies", null, "created_at"],
    updated: ["movies", null, "updated_at"],
    is_showing: ["movies", null, "is_showing"],
});

async function list(req, res) {
    const { movieId } = req.params;
    const data = await service.list(movieId);
    if (!movieId) {
        const configuredData = reduceMovies(data);
        res.json({ data: configuredData });
    }
    res.json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list)
}