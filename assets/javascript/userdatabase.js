var fname;
var lname;
var uemail;
var upassword;
  


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB2W8UwsJNT6Z8q_XZOUpUHplupb8KlZjE",
    authDomain: "minalfirst.firebaseapp.com",
    databaseURL: "https://minalfirst.firebaseio.com",
    projectId: "minalfirst",
    storageBucket: "minalfirst.appspot.com",
    messagingSenderId: "786089528355"
};
  firebase.initializeApp(config);


    // VARIABLES
    // --------------------------------------------------------------------------------

    var database = firebase.database();
    var clickCounter = 0;
    var ref = database.ref("SoundWave/UserRecord");

    // FUNCTIONS + EVENTS
    // --------------------------------------------------------------------------------

    $("#submit").on("click", function() {
      
      event.preventDefault();
        var fname=$("#firstname").val().trim();
        var lname=$("#lastname").val().trim();
        var uemail=$("#signUpemail").val().trim();
        console.log(uemail);
        var upassword=$("#signUppassword").val().trim();
        
        database.ref("SoundWave/UserRecord").push({
        firstname:fname,
        lastname:lname,
        email:uemail,
        password:upassword

      });
    });

    // MAIN PROCESS + INITIAL CODE
    // --------------------------------------------------------------------------------

    database.ref("SoundWave/UserRecord").on("child_added", function(snapshot) {
      console.log(snapshot.val());

       firstname= snapshot.val().firstname;
       lastname= snapshot.val().lastname;
       email= snapshot.val().email;
       password=snapshot.val().password;

    });

