const knex = require("../db/connection");

function combineReviewsAndCritics(reviewId) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select(
            "*",
            "c.critic_id as criticId",
            "c.created_at as created",
            "c.updated_at as updated"
        )
        .where({ "r.review_id": reviewId });
}

function list(movieId) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select(
            "*",
            "c.critic_id as criticId",
            "c.created_at as created",
            "c.updated_at as updated"
        )
        .where({ "r.movie_id": movieId });
}

function read(reviewId) {
    return knex("reviews")
        .select("*")
        .where({ review_id: reviewId })
        .first();
}

function update(review) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select(
            "*",
            "c.critic_id as criticId",
            "c.created_at as created",
            "c.updated_at as updated"
        )
        .where({ review_id: review.review_id })
        .update({
            ...review
        })
        .returning("*");
}

function destroy(reviewId) {
    return knex("reviews")
        .where({ review_id: reviewId })
        .del();
}

module.exports = {
    list,
    update,
    delete: destroy,
    read,
    combineReviewsAndCritics
}