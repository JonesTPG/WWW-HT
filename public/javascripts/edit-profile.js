



var app = new Vue({
    
    
    el: '#app',
    data: {
        
        username: null,
        age: null,
        email: null
        
    },

     created: function () {
        console.log("es");
        axios.get('http://localhost:3000/userdata').then((response)=> {
                    data = JSON.parse(response.data);
                    this.username = data.username;
                    this.age = data.age;
                    this.email = data.email;
                  

                });
     
     },
  
  
    methods: {
    }
  });
  