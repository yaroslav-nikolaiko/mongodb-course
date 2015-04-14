/**
 * Created by ynikolaiko on 4/7/15.
 */

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/school', function(err, db) {
    if(err) throw err;

    var cursor = db.collection('students').find();
    cursor.each(function(err, obj){
        console.log(obj);
        var scores = obj.scores;
        var homeworks = [];
        for(var i=0; i< scores.length; i++){
            if("homework" == scores[i].type)
                homeworks.push(scores[i]);
        }

        homeworks.sort(function(a,b) {
            return parseFloat(a.score) - parseFloat(b.score)
        });


        if(homeworks.length>0) {
            var lowestScoreHomeworke = (homeworks.shift()).score;
            db.collection('students').update(obj, {$pull : {scores : {type :"homework", score : lowestScoreHomeworke}}}, function(err, obj){
                if(err) throw err;
            });
        }

    });
});