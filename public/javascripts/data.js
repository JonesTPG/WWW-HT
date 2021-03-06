'use strict'


var app = new Vue({
    
    
    el: '#app',
    data: {
        infoText: null,
        selectedAmount: "",
        selectedGenre: "",
        rows: [], //pitää sisällään filtteröidy tulokset, aluksi sisältää kaikki tulokset
        allrows: [], //pitää sisällään kaikki tulokset
        genreList: []
       
       
      
    },

     created: function () {
        //haetaan data back-endiltä
        axios.get('http://localhost:3000/data').then((response)=> {
                var data = JSON.parse(response.data);

                //käydään tulokset yksi kerrallaan läpi
                for (var i=0; i<data.length; i++) {

                    //päivämäärästä tehdään järkevän näköinen stringi. (date-objektin metodit)
                    //eivät syystä tai toisesta toimineet, pakko tehdä näin
                    var hour = parseInt(data[i].date.toString().substring(11,13));
                    hour = hour + 2;
                    hour = hour.toString() + ":";
                    var d = data[i].date.toString().substring(8,10) +  "." + data[i].date.toString().substring(5,7)
                      + 
                    " " + hour + data[i].date.toString().substring(14,16);

                    var row = {user: data[i].username, date: d,
                    questions: data[i].amount, genre: data[i].genre, score: data[i].score};

                    this.allrows.push(row);
                    this.rows = this.allrows;

                }

                //sortataan tulokset scoren perusteella
                this.rows.sort(function (a,b) {
                    if (a.score < b.score) {
                        return 1;
                    }
                    if (a.score > b.score) {
                        return -1;
                    }
                    return 0;
                });

                //käydään vielä genret kannasta, jotta ne voidaan näyttää dropdown-valikossa filtterinä
                axios.get('http://localhost:3000/quiz/genres').then((response)=> {
                    var data = JSON.parse(response.data);
                    this.genreList = data;
                });
                
        });


     },
  
  
    methods: {

        update() {
            
            //päivitetään rows-listaa filttereiden mukaan
            if (this.selectedAmount == "" && this.selectedGenre == "") {
                this.rows = this.allrows;
                return;
            }

            if (this.selectedAmount == "" && this.selectedGenre != "") {
                var newRows = [];
                for (var i=0; i<this.allrows.length; i++) {
                    if (this.allrows[i].genre == this.selectedGenre) {
                        newRows.push(this.allrows[i]);
                    }

                }

                this.rows = newRows;
                
                return;
            }

            if (this.selectedAmount != "" && this.selectedGenre == "") {
                var newRows = [];
                for (var i=0; i<this.allrows.length; i++) {
                    if (this.allrows[i].questions == this.selectedAmount) {
                        newRows.push(this.allrows[i]);
                    }

                }

                this.rows = newRows;
                
                return;
            }

            if (this.selectedAmount != "" && this.selectedGenre != "") {
                var newRows = [];
                for (var i=0; i<this.allrows.length; i++) {
                    if (this.allrows[i].questions == this.selectedAmount 
                        && this.allrows[i].genre == this.selectedGenre) {
                        newRows.push(this.allrows[i]);
                    }

                }

                this.rows = newRows;
                
                return;
            }
           

           
        },

        //luodaan tuloksista pdf jsPDF-kirjastolla.
        genPDF() {
            var doc = new jsPDF()

            doc.text('Tulokset ' + new Date().toLocaleDateString('fi-FI'), 80, 10)
            doc.text('Valitut suodattimet:', 20, 20);
            doc.text('Genre: '+this.selectedGenre, 30, 30);
            doc.text('Kysymysten määrä: ' + this.selectedAmount, 30, 40)
            doc.line(0,45,220,45);

            doc.text('Käyttäjä              Päivämäärä              Kysymyksiä           Genre           Tulos', 0, 50);
            var y = 55;

            //tehdään jokaisesta tulosrivistä oma rivi pdf:ään
            for (var i=0; i<this.rows.length; i++) {
                var u = this.rows[i].user;
                var g = this.rows[i].genre;
                var a = this.rows[i].questions;
                var s = this.rows[i].score;
                var d = this.rows[i].date;
                
                doc.text(u, 0, y);
                doc.text(d, 40, y);
                doc.text(a.toString(), 110, y);
                doc.text(g, 130, y);
                doc.text(s.toString(), 170, y);

                y = y+5;
            }

            doc.line(0,y,220,y);
            doc.text("Quiz App 2018.", 80, y+15);


            doc.save('results.pdf');
        }

    }
  });
  