'use strict'

var selectedgenre;


Vue.component('genreItem', {
    props: ['item'],
    

    methods: {
        updateSelected(name) {
            selectedgenre = name;
        }
    },

    template: `
    
        <li class="collection-item avatar blue-grey">

            <div class="row">

                <div class="col l3">
                    <img :src="item.imageUrl" alt="mathquiz" width="100px" height="100px"/>
                </div>
                <div class="col l9">
                    <span class="title white-text">{{item.name}}</span>
                    <p class="white-text">Kysymyksiä: {{item.questionAmount}} kpl <br>
                    </p> <br>
                    
                        <button v-on:click="updateSelected(item.name)" class="waves-effect blue darken-1 btn white-text">Valitse</button>
                   
                </div>
            </div>
            
        
        </li>
        
        `
  });


Vue.component('questionAmount', {
    data() {
        return {
            amounts: [
                3, 5, 10
            ],
            selected: null,
            error: false
        }
    },

    created: function() {
        document.addEventListener('DOMContentLoaded', function() {
            this.elems = document.querySelectorAll('select');
            this.instances = M.FormSelect.init(this.elems, "*");
          });
    },

    methods: {
        getSelected() {
            if (this.selected == null) {
                this.error = true;
            }
            else if (selectedgenre == null) {
                this.error = true;
            }
            else {
                this.error = false;
                //var data = {genre: selectedgenre, amount: this.selected};
                
                // axios.get('http://localhost:3000/quiz/startquiz?genre='+ selectedgenre + '&amount='+ this.selected).then((response)=> {
                   
                // })
                window.location.href = "http://localhost:3000/quiz/startquiz?genre="+ selectedgenre + "&amount="+ this.selected;
                
            }
            
        }
    },
    
    template: `
        <div>
          
            <div class="input-field col s12 white-text">
                <select v-model="selected">
                    <option v-for="amount in amounts" v-bind:value="amount">{{amount}}</option>
                    
                </select>
                <br><br>
               
                <br><br>

                <a href="/profile" class="waves-effect blue darken-1 btn">Takaisin</a>
                <button v-on:click="getSelected" class="waves-effect blue darken-1 btn">Aloita</button>
                <br><br>

                <p v-if="error" class="white-text">Valitse sekä genre että kysymysten määrä.</p>
               
            </div>
        </div>

        `
  });

  


var app = new Vue({
    
    
    el: '#app',
    data: {
        
        
        genreList: null,
        amount: 0,
        error: false,
        infoText: null
        
        
    },

     created: function () {

        var url = window.location.href;  
        console.log(url);
        var urlObj = new URL(url);

        this.error = urlObj.searchParams.get("error");
        if (this.error) {
            this.infoText = "Quizia ei voida aloittaa, koska genressä ei ole tarpeeksi kysymyksiä";
        }


        axios.get('http://localhost:3000/quiz/genres').then((response)=> {
                var data = JSON.parse(response.data);
                this.genreList = data;
        });
        
     
     },
  
  
    methods: {
        startQuiz() {
            console.log(selectedgenre);
            
        }
    }
    
  });
  







