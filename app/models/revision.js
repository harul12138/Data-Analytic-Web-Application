var mongoose = require('mongoose');
mongoose.Promise = global.Promise

var articleSchema = new mongoose.Schema({
    sha1: String,
    title: String,
    timestamp: String,
    parsedcomment: String,
    revid: Number,
    user: String,
    parentid: Number,
    size: Number
});



articleSchema.pre('update', function (next) {
    if (this.isNew){
        this.timestamp = Date.now();
    }else {
        this.timestamp = Date.now();
    }
    next();
});

articleSchema.statics = {
    findAll: function(cb){
        return this
            .find({})
            //.sort('timestamp')
            .exec(cb)
    },
    findById: function(id, cb){
        return this
            .findOne({_id: id})
            .exec(cb)
    },
    findArticleWithMostNumberOfRevision: function (cb) {
        return this
            .aggregate([
                {$group:{_id:"$title", numOfRevisions: {$sum:1}}},
                {$sort:{numOfRevisions:-1}},
                {$limit:1}
            ])
            .exec(cb)
    },
    findArticleWithLeastNumberOfRevision: function (cb) {
        return this
            .aggregate([
                {$group:{_id:"$title", numOfRevisions: {$sum:1}}},
                {$sort:{numOfRevisions:1}},
                {$limit:1}
            ])
            .exec(cb)
    },
    findAllCount: function (cb) {
        return this
            .find().count()
            .exec(cb)
    },
    findOverallAnonymousCount: function (cb) {
        return this
            .find({anon:{$exists:true}})
            .count()
            .exec(cb)
    },
    findTypeUserCount: function (userTypeArray, cb) {
        return this
            .find({"user": {$in: userTypeArray}})
            .count()
            .exec(cb)
    },
    findRegularUserCount: function (admin, bot, cb) {
        return this
            .find({anon:{$exists:false},user:{$nin:bot,$nin:admin}})
            .count()
            .exec(cb)
    },
    findRevisionDistributionByYearByUserType: function (userTypeArray,cb) {
        return this
            .aggregate(
                [
                    {$project:
                        {
                            title: "$title",
                            user: "$user",
                            yearSubstring: {$substr:["$timestamp",0,4]}
                        }
                    },
                    {$match:{user:{$in: userTypeArray}}},
                    {$group:{_id:"$yearSubstring", count:{$sum:1}}},
                    {$sort:{_id:1}}
                ])
            .exec(cb)
    },
    findRevisionDistributionByYearByAnon: function (cb) {
        return this
            .aggregate(
                [
                    {$project:
                        {
                            title: "$title",
                            user: "$user",
                            anon:"$anon",
                            yearSubstring: {$substr:["$timestamp",0,4]}
                        }
                    },
                    {$match:{anon:{$exists:true}}},
                    {$group:{_id:"$yearSubstring", count:{$sum:1}}},
                    {$sort:{_id:1}}
                ])
            .exec(cb)
    },
    findRevisionDistributionByYearRegularUser: function (admin, bot, cb) {
        return this
            .aggregate(
                [
                    {$project:
                        {
                            title: "$title",
                            user: "$user",
                            yearSubstring: {$substr:["$timestamp",0,4]}
                        }
                    },
                    {$match:{user:{$nin:bot,$nin:admin}}},
                    {$group:{_id:"$yearSubstring", count:{$sum:1}}},
                    {$sort:{_id:1}}
                ])
            .exec(cb)
    },
    findAllYear: function (cb) {
        return this
            .aggregate(
                [
                    {$project:
                        {

                            yearSubstring: {$substr:["$timestamp",0,4]}
                        }
                    },
                    {$group:{_id:"$yearSubstring", count:{$sum:1}}},
                    {$sort:{_id:1}}
                ])
            .exec(cb)

    },
    findArticleTitleList: function (cb) {
        return this
            .aggregate([{$group : {_id : "$title", totalNum : {$sum : 1}}}])
            .exec(cb)
    },
    findDetail: function (title, cb) {
        return this
            .aggregate([
                {$match:{title:title}}
            ])
            .exec(cb)
    },
    findLargestGroupOfRegisteredUsers: function (admin, bot,cb) {
        return this
            .aggregate([
            	{$match:{
                    $and:[{anon:{$exists:false}},{user:{$nin:bot,$nin:admin}}]}},
					{$group:{_id:"$title", 'numOfEdits': {$sum:1}}},
					{$sort:{numOfEdits:-1}},
					{$limit:1}	
            ])
            .exec(cb)
    },
    findBySmallestGroupOfRegisteredUsers: function (admin, bot,cb) {
        return this
            .aggregate([
            	{$match:{
                    $and:[{anon:{$exists:false}},{user:{$nin:bot,$nin:admin}}]}},
                    {$group:{_id:"$title", 'numOfEdits': {$sum:1}}},
					{$sort:{numOfEdits:1}},
					{$limit:1}	
            ])
            .exec(cb)
    },
    findShortestHistory: function (cb) {
        return this
            .aggregate([
                {$group:{_id:{title:"$title"},timestamp:{$min:"$timestamp"}}},
                {$project : {"_id": 0,"title":"$_id.title","timestamp":"$timestamp"}},
                {$sort:{timestamp:-1}},
                {$limit:1}
            ])
            .exec(cb)

    },
    findLongestHistory: function (cb) {
        return this
            .aggregate([
                {$group:{_id:{title:"$title"},timestamp:{$min:"$timestamp"}}},
                {$project : {"_id": 0,"title":"$_id.title","timestamp":"$timestamp"}},
                {$sort:{timestamp:1}},
                {$limit:1}
            ])
            .exec(cb)
    },
    findAllArticleTitle: function (cb) {
        return this
            .aggregate(
                [
                    {$group:{_id:"$title", count:{$sum:1}}},
                    {$sort:{count:-1}}
                ])
            .exec(cb)
    },

    //individual
    findTotalNumOfRevision: function (title, cb) {
        return this
            .find({title:title}).count()
            .exec(cb)
    },
    findTop5User: function (title, admin, bot,cb) {
        return this
            .aggregate([
                {$match:{
                    $and:[{title:title},{anon:{$exists:false}},{user:{$nin:bot,$nin:admin}}]}},
                {$group:{_id:{user:"$user"},count:{$sum:1}}},
                {$project : {"_id": 0,"user":"$_id.user","count":"$count"}},
                {$sort:{count:-1}},
                {$limit:5}
            ])
            .exec(cb)
    },
    findIndiAnon: function (title,cb) {
        return this
            .find({title:title,anon:{$exists:true}}).count()
            .exec(cb)
    },
    findIndiAdmin: function (title,admin,cb) {
        return this
            .find({title:title,anon:{$exists:false},user:{$in:admin}}).count()
            .exec(cb)
    },
    findIndiBot: function (title,bot,cb) {
        return this
            .find({title:title,anon:{$exists:false},user:{$in:bot}}).count()
            .exec(cb)
    },
    findIndiReg: function (title,admin,bot,cb) {
        return this
            .find({title:title,anon:{$exists:false},user:{$nin:admin,$nin:bot}}).count()
            .exec(cb)
    },
    findIndiRevisionDistributionByYearByUserType: function (title,userTypeArray,cb) {
        return this
            .aggregate(
                [
                    {$match:{title:title}},
                    {$project:
                        {
                            title: "$title",
                            user: "$user",
                            yearSubstring: {$substr:["$timestamp",0,4]}
                        }
                    },
                    {$match:{user:{$in: userTypeArray}}},
                    {$group:{_id:"$yearSubstring", count:{$sum:1}}},
                    {$sort:{_id:1}}
                ])
            .exec(cb)
    },
    findIndiRevisionDistributionByYearByAnon: function (title,cb) {
        return this
            .aggregate(
                [
                    {$match:{title:title}},
                    {$project:
                        {
                            title: "$title",
                            user: "$user",
                            anon:"$anon",
                            yearSubstring: {$substr:["$timestamp",0,4]}
                        }
                    },
                    {$match:{anon:{$exists:true}}},
                    {$group:{_id:"$yearSubstring", count:{$sum:1}}},
                    {$sort:{_id:1}}
                ])
            .exec(cb)
    },
    findIndiRevisionDistributionByYearRegularUser: function (title,admin, bot, cb) {
        return this
            .aggregate(
                [
                    {$match:{title:title}},
                    {$project:
                        {
                            title: "$title",
                            user: "$user",
                            yearSubstring: {$substr:["$timestamp",0,4]}
                        }
                    },
                    {$match:{user:{$nin:bot,$nin:admin}}},
                    {$group:{_id:"$yearSubstring", count:{$sum:1}}},
                    {$sort:{_id:1}}
                ])
            .exec(cb)
    },
    findIndiAllYear: function (title,cb) {
        return this
            .aggregate(
                [
                    {$match:{title:title}},
                    {$project:
                        {

                            yearSubstring: {$substr:["$timestamp",0,4]}
                        }
                    },
                    {$group:{_id:"$yearSubstring", count:{$sum:1}}},
                    {$sort:{_id:1}}
                ])
            .exec(cb)
    },
    findIndiMaxTime : function (title,cb) {
        return this
            .aggregate([
                {$match:{title:title}},
                {$group:{_id:{title:"$title"},timestamp:{$max:"$timestamp"}}}
            ])
            .exec(cb)

    },
    findUserDistribution: function (title, user, cb) {
        return this
            .aggregate(
                [
                    {$match:{title:title}},
                    {$match:{user:user}},
                    {$project:
                        {
                            yearSubstring: {$substr:["$timestamp",0,4]}
                        }
                    },
                    {$group:{_id:"$yearSubstring", count:{$sum:1}}},
                    {$sort:{_id:1}}
                ])
            .exec(cb)

    }

}

var article = mongoose.model('Revision', articleSchema,'test2');
module.exports = article;
//module.exports = articleSchema;