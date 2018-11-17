const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const MongoClient = require("mongodb").MongoClient;
const connectionString = "mongodb://localhost:27017";
//for parsing application/json
app.use(bodyParser.json());
//For CORS
app.use(cors());

MongoClient.connect(
    connectionString, {
        useNewUrlParser: true
    },
    (err, client) => {
        if (err) console.log(err);
        const db = client.db("score_sheet");

        app.post("/addGrade", (req, res) => {
            db.collection("grades").save(req.body, (err, result) => {
                if (err) return res.status(401).send({
                    msg: 'fail'
                });
                res.status(200).send({
                    msg: 'success'
                });
                client.close();
            });
        });

        app.get("/getAllGrades", (req, res) => {
            db.collection("grades").find().toArray((err, results) => {
                if (err) {
                    console.log('we have error')
                    const error = '<!DOCTYPE html>' +
                        '<html><head></head><body><h4>Error</h4></body></html>';
                    return res.status(401).send(error);
                } else {
                    let list = '';
                    results.forEach(result => {
                        list = list + '<li>' + `${result.grade}` + '</li>';
                    });
                    const response = '<!DOCTYPE html>' +
                        '<html><head></head><body><ol>' + `${list}` + '</ol></body></html>'
                    res.status(200).send(response);
                }
                client.close();
            });

        });

        app.get("/getGrade/:lastname", (req, res, next) => {
            db.collection("grades").findOne({
                "last": req.params.lastname
            }, (err, result) => {
                if (err)
                    return res.status(404).send('<!DOCTYPE html>' +
                        '<html><head></head><body><h4>Error</h4></body></html>');
                res.status(200).send('<!DOCTYPE html>' +
                    '<html><head></head><body><ol>' + `${result.grade}` + '</ol></body></html>');

                client.close();
            });
        });

        app.listen(port, () =>
            console.info("Application running on port " + `${port}`)
        );
    }
);