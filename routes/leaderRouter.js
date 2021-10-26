const express = require('express');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
const leaderRouter = express.Router();
const authenticate = require('../authenticate');
leaderRouter.use(express.json());

leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {
        console.log('Leader Created', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operations not supported on /leaders');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
leaderRouter.route('/:leaderId')
.get((req,res) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        console.log('Leader Found', leader);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader)
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.end('Post operations not supported on /leaders/' + req.params.leaderId);
})
.put(authenticate.verifyUser, (req, res, next) => {
   Leaders.findByIdAndUpdate(req.params.leaderId, {
       $set: req.body
   }, {new: true})
   .then((leader) => {
    console.log('Leader Updated', leader);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(leader);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;