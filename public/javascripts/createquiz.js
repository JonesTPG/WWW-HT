'use strict'

var selectedgenre;

Vue.component('genreItem', {
    props: ['item'],
    

    methods: {
        updateSelected(name) {
            selectedgenre = name;
            console.log(selectedgenre)
            
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



var app = new Vue({
    
    
    el: '#app',
    data: {
        
        genreList: [],
        newGenre: null,
        infoText: null
       
        
    },

     created: function () {
       
        axios.get('http://localhost:3000/quiz/genres').then((response)=> {
            var data = JSON.parse(response.data);
            
            this.genreList = data;
        })
     },
  
  
    methods: {
       createGenre() {

            if (this.newGenre == null || this.newGenre == '') {
                this.infoText = 'Valitse genrelle nimi.';
                return;
            }

            var data = {genre: this.newGenre};
            axios.post('http://localhost:3000/create/new-genre', data).then((response)=> {
                
                console.log("success");
                window.location.reload(false); 
                
                return;

            })

           return;
       },

       proceed() {

        if (selectedgenre == null) {
            this.infoText = 'Sinun täytyy valita genre ennen kuin voit valita kysymyksiä.';
            return;
        }

        this.infoText = '';

        window.location.href = "http://localhost:3000/create/questions?genre="+ selectedgenre

        return;
       }
    }
    
  });
  







