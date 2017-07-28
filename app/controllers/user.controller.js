var express = require('express')
var article = require('../models/revision.js')
var fs = require('fs')
var async = require('async');
var MediaWiki = require("mediawiki")

module.exports.user = function (req, res) {
    var title = req.params.title
    var user = req.params.user
    var random = req.params.random
    article.findUserDistribution(title,user,function (err,userDistribution) {
        article.findIndiAllYear(title, function (err, indiAllYear) {
            var ajaxIndiUser = {
                title: title,
                user: user,
                userDistribution: userDistribution,
                indiAllYear: indiAllYear
            }
            res.send(ajaxIndiUser)
        })

    })
}
