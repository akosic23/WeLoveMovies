const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");

const reduceCritics = reduceProperties("critic_id", {
    criticId: ["critic", "critic_id"],
    preferred_name: ["critic", "preferred_name"],
    surname: ["critic", "surname"],
    organization_name: ["critic", "organization_name"],
    created: ["critic", "created_at"],
    updated: ["critic", "updated_at"]
});

function validateReview(req, res, next) {
    const body = req.body.data;
    if (body) {
        res.locals.reviewBody = body;
        return next();
    }
    next({
        status: 400,
        message: "Request must include data"
    });
}

async function reviewExists(req, res, next) {
    const foundReview = await service.read(req.params.reviewId);
    if (foundReview) {
        res.locals.foundReview = foundReview;
        return next();
    }
    next({
        status: 404,
        message: "Review cannot be found."
    });
}

async function list(req, res) {
    const { movieId } = req.params;
    const data = await service.list(movieId);
    const configuredData = reduceCritics(data);
    res.json({ data: configuredData });
}

async function update(req, res) {
    const updatedReview = res.locals.reviewBody;
    updatedReview.review_id = req.params.reviewId;
    await service.update(updatedReview);
    const data = await service.combineReviewsAndCritics(updatedReview.review_id);
    const configuredData = reduceCritics(data);
    res.json({ data: configuredData[0] });
}

async function destroy(req, res) {
    const review = res.locals.foundReview;
    await service.delete(review.review_id);
    res.sendStatus(204);
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    update: [asyncErrorBoundary(reviewExists), validateReview, asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
}