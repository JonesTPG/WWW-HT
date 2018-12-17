'use strict'


var app = new Vue({
    
    
    el: '#app',
    data: {
        infoText: null,
        selectedAmount: "",
        selectedGenre: "",
        rows: [{}],
        allrows: [{}]
      
    },

     created: function () {
        console.log("hello");

        document.addEventListener('DOMContentLoaded', function() {
            this.elems = document.querySelectorAll('select');
            this.instances = M.FormSelect.init(this.elems, "*");
          });

        //   this.rows.push({user: 'joonas', date: '19.12.1997', questions: '5', genre: 'Matematiikka', score: '344'});

        //   this.rows.push({user: 'kassu', date: '19.12.1997', questions: '5', genre: 'Matematiikka', score: '344'});


          axios.get('http://localhost:3000/data').then((response)=> {
                var data = JSON.parse(response.data);

                
                for (var i=0; i<data.length; i++) {

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

                this.rows.sort(function (a,b) {
                    if (a.score < b.score) {
                        return 1;
                    }
                    if (a.score > b.score) {
                        return -1;
                    }
                    return 0;
                });
                
        });


     },
  
  
    methods: {

        update() {
            console.log('update');
            console.log(this.selectedAmount + this.selectedGenre);

            if (this.selectedAmount == "" && this.selectedGenre == "") {
                this.rows = this.allrows;
                return;
            }

            if (this.selectedAmount == "" && this.selectedGenre != "") {
                var newRows = [{}];
                for (var i=0; i<this.allrows.length; i++) {
                    if (this.allrows[i].genre == this.selectedGenre) {
                        newRows.push(this.allrows[i]);
                    }

                }

                this.rows = newRows;
                
                return;
            }

            if (this.selectedAmount != "" && this.selectedGenre == "") {
                var newRows = [{}];
                for (var i=0; i<this.allrows.length; i++) {
                    if (this.allrows[i].questions == this.selectedAmount) {
                        newRows.push(this.allrows[i]);
                    }

                }

                this.rows = newRows;
                
                return;
            }

            if (this.selectedAmount != "" && this.selectedGenre != "") {
                var newRows = [{}];
                for (var i=0; i<this.allrows.length; i++) {
                    if (this.allrows[i].questions == this.selectedAmount 
                        && this.allrows[i].genre == this.selectedGenre) {
                        newRows.push(this.allrows[i]);
                    }

                }

                this.rows = newRows;
                
                return;
            }
           

           
        }

    }
  });
  