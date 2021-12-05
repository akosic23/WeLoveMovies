const knex = require("../db/connection");

function list(movieId) {
    if (movieId) {
        return knex("theaters as t")
            .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
            .select(
                "t.*",
                "mt.is_showing",
                "mt.movie_id"
            )
            .where({ "mt.movie_id": movieId });
    }
    return knex("theaters as t")
        .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
        .join("movies as m", "m.movie_id", "mt.movie_id")
        .select("*", "mt.theater_id as theaterId", "m.created_at as created", "m.updated_at as updated");
}

module.exports = {
    list
}