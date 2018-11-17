const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser =  require('body-parser');
const fs = require('fs');
const port = process.env.PORT || 3000 ;

//for parsing application/json
app.use(bodyParser.json());
//For CORS
app.use(cors());

app.post('/addGrade', (req, res) => {

    const {first, last, grade } = req.body;
    fs.appendFile('./grades.txt', `\n${first}, ${last}, ${grade}`, (err) => {
        if (err) res.status(200).send({
            msg: 'fail'
        });
        res.status(200).send({
            msg: 'success'
        });
    });
});


app.get('/getAllGrades', (req, res) => {
    fs.readFile('./grades.txt', 'utf8', (err, data) => {
        if (err) {
            const error = '<!DOCTYPE html>'
          + '<html><head></head><body><h4>Error</h4></body></html>';
          res.status(401).send(error);
        } else {
            // Get request for assignment 8
            // let list = '';
            // let allGrades;
            // data.toString().split("\n").forEach(function(line, index, arr) {
            //     if (index === arr.length - 1 && line === "") { return; }
                // list = list + '<li>'+`${line.match("[^,]+$")}` + '</li>';
            //   });
            //   allGrades = '<!DOCTYPE html>'
            //   + '<html><head></head><body><ol>' + `${list}` + '</ol></body></html>';
            // res.status(200).send(allGrades);


            // Modified get request for assignment 10
            let array = [];
            let student;
            data.toString().split("\n").forEach(function(line, index, arr) {
              
                if (index === arr.length - 1 && line === "") { return; }
                student = {
                    first: line.match("^([^,]*)"),
                    last: line.match(/\s(.+?)\,/),
                    grade: line.match("[^,]+$")
                }
                let obj = {
                    id: index + 1,
                    score: JSON.parse(student.grade[0])
                }
                array.push(obj)
              });
            res.status(200).send(array);
        }
    });
});

app.get('/getGrade/:lastname', (req, res) => {
    fs.readFile('./grades.txt', 'utf8', (err, data) => {
    if (err) {
        const error = '<!DOCTYPE html>'
      + '<html><head></head><body><h4>Error</h4></body></html>';
      res.status(401).send(error);
    } else {
        let score = 0;
        let grade;
        data.toString().split("\n").forEach((line, index, arr) => {
            if (index === arr.length - 1 && line === "") { return; }
                if (line.match(/\s(.+?)\,/)[1] == req.params.lastname) {
                    score = line.match("[^,]+$");
                    return;
            }
          });
          grade = '<!DOCTYPE html>'
          + '<html><head></head><body><ol>' + score + '</ol></body></html>';
        res.status(200).send(grade);

    }
    });
});

app.listen(port, () => console.info('Application running on port '+ `${port}`));