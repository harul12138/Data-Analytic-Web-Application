var express = require('express')
var article = require('../models/revision.js')
var fs = require('fs')
var async = require('async');
var MediaWiki = require("mediawiki")


module.exports.individual = function (req, res) {
    var admin = fs.readFileSync('./txt/admin.txt').toString().split("\n"); //parse admin.txt to array
    var bot = fs.readFileSync('./txt/bot.txt').toString().split("\n"); //parse bot.txt to array
    var title = req.params.title
    article.findTotalNumOfRevision(title, function (err, totalNum) {
        article.findTop5User(title,admin,bot,function (err, top5) {
            article.findIndiAnon(title,function (err, indiAnon) {
                article.findIndiAdmin(title,admin,function (err, indiAdmin) {
                    article.findIndiBot(title,bot, function (err, indiBot) {
                        article.findIndiReg(title,admin,bot,function (err, indiReg) {
                            article.findIndiRevisionDistributionByYearByAnon(title,function (err, indiYearAnon) {
                                article.findIndiRevisionDistributionByYearByUserType(title,admin,function (err, indiYearAdmin) {
                                    article.findIndiRevisionDistributionByYearByUserType(title,bot, function (err, indiYearBot) {
                                        article.findIndiRevisionDistributionByYearRegularUser(title,admin, bot, function (err, indiYearReg) {
                                            article.findIndiAllYear(title,function (err, indiAllYear) {
                                                article.findIndiMaxTime(title,function (err, indiMaxTime) {
                                                    if ((new Date()-new Date(indiMaxTime[0].timestamp)>86400000)){
                                                        var wikimedia = new MediaWiki.Bot()
                                                        wikimedia.get({ action: "query", titles: title,prop:"revisions",rvprop:"anon|sha1|title|user|timestamp|parsedcomment|revid|user|parentid|size|content",rvend:indiMaxTime[0].timestamp,rvlimit:"500",format:"json",formatversion:"2"}).complete(function (response) {
                                                            var wikiMediaData = response.query.pages[0].revisions;
                                                            if(wikiMediaData.length>1){
                                                                // console.log(wikiMediaData)
                                                                for(i=0;i<wikiMediaData.length-1;i++){
                                                                    if (wikiMediaData[i].hasOwnProperty("anon")){
                                                                        var newData = new article({
                                                                            sha1: wikiMediaData[i].sha1,
                                                                            title: title,
                                                                            timestamp: wikiMediaData[i].timestamp,
                                                                            parsedcomment: wikiMediaData[i].parsedcomment,
                                                                            revid: wikiMediaData[i].revid,
                                                                            user: wikiMediaData[i].user,
                                                                            parentid: wikiMediaData[i].parentid,
                                                                            size: wikiMediaData[i].size
                                                                        })

                                                                        newData.save(function (err) {
                                                                            if(err){
                                                                                console.log(err)
                                                                            }
                                                                        })
                                                                    }else {
                                                                       
                                                                        var newData = new article({
                                                                            sha1: wikiMediaData[i].sha1,
                                                                            title: title,
                                                                            timestamp: wikiMediaData[i].timestamp,
                                                                            parsedcomment: wikiMediaData[i].parsedcomment,
                                                                            revid: wikiMediaData[i].revid,
                                                                            user: wikiMediaData[i].user,
                                                                            parentid: wikiMediaData[i].parentid,
                                                                            size: wikiMediaData[i].size,
                                                                            anon:''
                                                                        })
                                                                        newData.save(function (err) {
                                                                            if(err){
                                                                                console.log(err)
                                                                            }
                                                                        })
                                                                    }

                                                                }

                                                                var ajaxIndi = {
                                                                    title: title,
                                                                    numRevision: totalNum,
                                                                    top5: top5,
                                                                    indiAnon: indiAnon,
                                                                    indiAdmin: indiAdmin,
                                                                    indiBot: indiBot,
                                                                    indiReg: indiReg,
                                                                    indiYearAnon: indiYearAnon,
                                                                    indiYearAdmin: indiYearAdmin,
                                                                    indiYearBot: indiYearBot,
                                                                    indiYearReg: indiYearReg,
                                                                    indiAllYear: indiAllYear,
                                                                    mediaData: true,
                                                                    wikiMediaData: wikiMediaData
                                                                }
                                                                // console.log(ajaxIndi)
                                                                res.send(ajaxIndi)

                                                            }
                                                            else {
                                                                var ajaxIndi = {
                                                                    title: title,
                                                                    numRevision: totalNum,
                                                                    top5: top5,
                                                                    indiAnon: indiAnon,
                                                                    indiAdmin: indiAdmin,
                                                                    indiBot: indiBot,
                                                                    indiReg: indiReg,
                                                                    indiYearAnon: indiYearAnon,
                                                                    indiYearAdmin: indiYearAdmin,
                                                                    indiYearBot: indiYearBot,
                                                                    indiYearReg: indiYearReg,
                                                                    indiAllYear: indiAllYear,
                                                                    mediaData: false
                                                                    // wikiMediaData: wikiMediaData
                                                                }
                                                                // console.log(ajaxIndi)
                                                                res.send(ajaxIndi)
                                                            }

                                                        })
                                                    }else {
                                                        var ajaxIndi = {
                                                            title: title,
                                                            numRevision: totalNum,
                                                            top5: top5,
                                                            indiAnon: indiAnon,
                                                            indiAdmin: indiAdmin,
                                                            indiBot: indiBot,
                                                            indiReg: indiReg,
                                                            indiYearAnon: indiYearAnon,
                                                            indiYearAdmin: indiYearAdmin,
                                                            indiYearBot: indiYearBot,
                                                            indiYearReg: indiYearReg,
                                                            indiAllYear: indiAllYear,
                                                            // wikiMediaData: wikiMediaData
                                                        }
                                                        // console.log(ajaxIndi)
                                                        res.send(ajaxIndi)
                                                    }
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}