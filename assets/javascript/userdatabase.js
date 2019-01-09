var fname;
var lname;
var uemail;
var upassword;
  


  // Initialize Firebase
  var config = {
   
    apiKey: "AIzaSyA57Ald5V2ubl1_lDvhMysN8wOGPy0KQO4",
    authDomain: "first-firebase-proj-a7d2a.firebaseapp.com",
    databaseURL: "https://first-firebase-proj-a7d2a.firebaseio.com",
    projectId: "first-firebase-proj-a7d2a",
    storageBucket: "first-firebase-proj-a7d2a.appspot.com",
    messagingSenderId: "113777479070"
  };
  firebase.initializeApp(config);


    // VARIABLES
    // --------------------------------------------------------------------------------

    var database = firebase.database();
    var clickCounter = 0;
    var ref = database.ref("UserRecord");

    // FUNCTIONS + EVENTS
    // --------------------------------------------------------------------------------

    $("#submit").on("click", function() {
      
        var fname=$("#firstname").val().trim();
        var lname=$("#lastname").val().trim();
        var uemail=$("#email").val().trim();
        var upassword=$("#password").val().trim();
        
        database.ref("UserRecord").push({
        firstname:fname,
        lastname:lname,
        email:uemail,
        password:upassword

      });
    });

    // MAIN PROCESS + INITIAL CODE
    // --------------------------------------------------------------------------------

    database.ref("UserRecord").on("child_added", function(snapshot) {
      console.log(snapshot.val());

       firstname= snapshot.val().firstname;
       lastname= snapshot.val().lastname;
       email= snapshot.val().email;
       password=snapshot.val().password;
//take current date on everytime user logins match it with the first signup date, then first signup date minus current date is more than 30 then password expries

// login validatation
//function validateForm() {
  //  var email = document.loginform.usr.value;
   // var pw = document.loginform.pword.value;
   // var username = "username"; 
   // var password = "password";
   // if ((un == email) && (pw == password)) {
//window.location = "signup.html";
   //     return false;
  // }
   // else {
    //    alert ("Login was unsuccessful, please check your username and password");
   // }
 //}
//firebase.auth().onAuthStateChanged(function(user) {
   // window.user = user;
    //document.querySelector('#Login').addEventListener('click', function(e) {
      //  e.preventDefault();
      //  e.stopPropagation();
       // var email = document.querySelector('#email').value;
       // var password = document.querySelector('#password').value
       // var credential = firebase.auth.EmailAuthProvider.credential(email, password);
       // var auth = firebase.auth();
       // var currentUser = auth.currentUser;
       // document.querySelector('#sign-out').addEventListener('click', function(e) {
       //     e.preventDefault();
        //    e.stopPropagation();
       //     firebase.auth().signOut();
       //   });
      
      // var totalbill;

       
      // var usrDate = new Date(snapshot.val().startdate);
      // var curDate = new Date(); 
      // var usrYear, usrMonth = usrDate.getMonth()+1;
      //  var curYear, curMonth = curDate.getMonth()+1;
       // if((usrYear=usrDate.getFullYear()) < (curYear=curDate.getFullYear())){
       // curMonth += (curYear - usrYear) * 12;
       // }
       // var diffMonths = curMonth - usrMonth;
        //if(usrDate.getDate() > curDate.getDate()) diffMonths--;
        
        //totalbill=diffMonths*rate;
        
      //var tbrow=$("<tr>");
      //tbrow.append("<td>"+name+"</td>");
     // tbrow.append("<td>"+role+"</td>");
      //tbrow.append("<td>"+startdate+"</td>");
      //tbrow.append("<td>"+rate+"</td>");
      //tbrow.append("<td>"+diffMonths+"</td>");
      //tbrow.append("<td>"+totalbill+"</td>");
      //$(".table").append(tbrow);
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });