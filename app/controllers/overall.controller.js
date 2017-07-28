var express = require('express')
var article = require('../models/revision.js')
var fs = require('fs')
var async = require('async');
var MediaWiki = require("mediawiki")

module.exports.overall = function (req, res) {
    var admin = fs.readFileSync('./txt/admin.txt').toString().split("\n"); //parse admin.txt to array
    var bot = fs.readFileSync('./txt/bot.txt').toString().split("\n"); //parse bot.txt to array

    //pie chart admin
    article.findTypeUserCount(admin,function (err,count) {
        var sum =+count
        var userTypeCount= new Array() //[admin, bot, anon, regular]
        userTypeCount.push(count)
        //pie chart bot
        article.findTypeUserCount(bot, function (err,count) {
            sum =+count
            userTypeCount.push(count)
            //pie chart anon
            article.findOverallAnonymousCount(function (err, count) {
                sum =+count
                userTypeCount.push(count)
                //pie chart regular
                article.findAllCount(function (err,count) {
                    userTypeCount.push(count-sum)
                    var pieChartData = {
                        admin: userTypeCount[0],
                        bot: userTypeCount[1],
                        anon: userTypeCount[2],
                        regular: userTypeCount[3]
                    }
                    //bar chart admin
                    article.findRevisionDistributionByYearByUserType(admin, function (err, adminResult) {
                        //bar chart bot
                        article.findRevisionDistributionByYearByUserType(bot, function (err, botResult) {
                            //bar chart anon
                            article.findRevisionDistributionByYearByAnon(function (err, anonResult) {
                                //bar chart regular
                                article.findRevisionDistributionByYearRegularUser(admin,bot, function (err, regResult) {
                                    var barChartData = {
                                        admin: adminResult,
                                        bot: botResult,
                                        anon: anonResult,
                                        reg: regResult
                                    }
                                    article.findAllYear(function (err, allYear) {
                                        article.findArticleWithMostNumberOfRevision(function (err, articleWithMostNumberOfRevision) {
                                            article.findArticleWithLeastNumberOfRevision(function (err, articleWithLeastNumberOfRevision) {
                                                article.findLargestGroupOfRegisteredUsers(admin,bot,function (err, articleEditedByLargestGroupOfRegisteredUsers) {
                                                	if (err){
                                            			console.log("Cannot find ")
                                            		}else{
                                            			revision2 = articleEditedByLargestGroupOfRegisteredUsers[0]} 
                                            			
                                                    article.findBySmallestGroupOfRegisteredUsers(admin,bot,function (err, findBySmallestGroupOfRegisteredUsers) {
                                                    	if (err){
                                                			console.log("Cannot find ")
                                                		}else{
                                                			revision = findBySmallestGroupOfRegisteredUsers[0]}
                                                			
                                                        article.findLongestHistory(function (err, longestHistory) {
                                                            article.findShortestHistory(function (err, shortestHistory) {
                                                            	//console.log(revision2._id) 
                                                            	//console.log(revision._id) 
                                                                var statistics ={
                                                                    articleWithMostNumberOfRevision: articleWithMostNumberOfRevision[0]._id,
                                                                    articleWithLeastNumberOfRevision: articleWithLeastNumberOfRevision[0]._id,
                                                                    articleEditedByLargestGroupOfRegisteredUsers: revision2._id,
                                                                    articleEditedBySmallestGroupOfRegisteredUsers: revision._id,
                                                                    longestHistory: longestHistory[0].title,
                                                                    shortestHistory: shortestHistory[0].title
                                                                }
                                                                article.findAllArticleTitle(function (err, allArticleTitle) {
                                                                    res.render('home.pug', {
                                                                        title: 'Wiki Revisions',
                                                                        pieChartUserTypeCount: pieChartData,
                                                                        barChartUserTypeCount: barChartData,
                                                                        allYear: allYear,
                                                                        statistics: statistics,
                                                                        allArticleTitle: allArticleTitle
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
                    })
                })
            })
        })
    })
}