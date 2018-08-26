var bcrypt = require('bcrypt');
var express = require('express');
var mongodb = require('mongodb');


//#############################################
// These const/vars should be changed to use your own 
// ID, password, databse, and ports
const SERVER_PORT = 8110;
var user = 'dk_govindaraj';
var password = 'A00421724';
var database = 'dk_govindaraj';
//#############################################


//These should not change, unless the server spec changes
var host = '127.0.0.1';
var port = '27017'; // Default MongoDB port


// Now create a connection String to be used for the mongo access
var connectionString = 'mongodb://' + user + ':' + password + '@' +
        host + ':' + port + '/' + database;


//#############################################
//the var for the university collections
var shapesCollection;
const NAME_OF_COLLECTION = 'shapes';
//#############################################


//CORS Middleware, causes Express to allow Cross-Origin Requests
// Do NOT change anythinghere
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
};


//set up the server variables
var app = express();
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.static(__dirname));



//now connect to the db
mongodb.connect(connectionString, function (error, db) {
    
    //if something is wrong, it'll crash
    //you could add a try-catch block to handle it, 
    //but not needed for the assignment
    if (error) {
        throw error;
    }//end if


    //#############################################
    shapesCollection = db.collection(NAME_OF_COLLECTION);
    //#############################################



    // Close the database connection and server when the application ends
    process.on('SIGTERM', function () {
        console.log("Shutting server down.");
        db.close();
        app.close();
    });


    //now start the application server
    var server = app.listen(SERVER_PORT, function () {
        console.log('Listening on port %d',
                server.address().port);
    });
});




//#############################################
app.post('/saveShape', function (request, response) {

    //request.body contains the stringified object
    console.log(request.body);

    // now insert the record.
    // it's easer than the case of a text file, since you do NOT have to read
    //the data first!
    shapesCollection.insert(request.body,
            function (err, result) {
                if (err) {
                    console.log(err);
                    return response.send(400, 'Error occurred syncing records');
                }//end if
                
                //else success!
                return response.send(200,'Record saved.');
            });
    });
//#############################################



//#############################################
app.post('/getShape', function (request, response) {

    
    //case insensitive regex pattern using request.body.Name
    var searchKey = new RegExp(request.body.Name,"i");
    
    console.log('Retrieving records: ' + searchKey.toString() );
    

     shapesCollection.find(
            {"Name": searchKey }, 
        function (err, result) {
            
            if (err) {
                return response.send(400,'An error occurred retrieving records.');
            }//end if
            

            //now result is expected to be an array of universities
            result.toArray(
                function (err, resultArray) {
                    if (err) {
                        return response.send(400,
                                'An error occurred processing your records.');
                    }//end if

                    //if succeeded, send it back to the calling thread
                    return response.send(200, resultArray);
                });
        });

});
//#############################################




//#############################################
app.post('/getAllShapes', function (request, response) {

    console.log('Retrieving all the records.');

     shapesCollection.find({}, 
        function (err, result) {//use empty to get all records
           if (err) {
               return response.send(400,'An error occurred retrieving records.');
           }//end if

           //now result is expected to be an array of universities
            result.toArray(
                function (err, resultArray) {
                    if (err) {
                        return response.send(400,
                                'An error occurred processing your records.');
                    }//end if

                    //if succeeded, send it back to the calling thread
                    return response.send(200, resultArray);
            });
       });

});
//#############################################


