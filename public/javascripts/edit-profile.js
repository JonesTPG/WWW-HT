



var app = new Vue({
    
    
    el: '#app',
    data: {
        
        username: null,
        age: null,
        email: null,
        infoText: null
        
    },

     created: function () {
        
        axios.get('http://localhost:3000/userdata').then((response)=> {
                    data = JSON.parse(response.data);
                    this.username = data.username;
                    this.age = data.age;
                    this.email = data.email;
                  

                });
     
     },
  
  
    methods: {

      postForm() {
          if (this.email.length == 0 || !this.email.includes("@")) {
            this.infoText = "Tarkista email."
            return;
          }

          if ( !this.IsNumeric(this.age) ){
            this.infoText = "Tarkista ikä";
            return;
          }

          this.infoText = '';
          var data = {
            email: this.email,
            age: this.age
          }

          axios.post('http://localhost:3000/update-profile', data).then((response)=> {
            
            this.infoText = "tiedot tallennettu";
            return;
          

        });





      },
      IsNumeric(val) {
      return Number(parseFloat(val)) === val;
      }



    }
  });
  