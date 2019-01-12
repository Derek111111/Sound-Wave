$(document).ready(function(){

    //variables
    var artistSearch;
    var queryURL;

    //database Variables
    var records=0;
    var trendingStart = 0;
    var trackName=[];
   
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

    var database = firebase.database();
    var recentData = database.ref("Soundwave/Recent");
       
    

    //functions for initiation
    trendingList();
    recentPlaylist();

    //MusixMatch Ajax Call
    function ajaxCall(queryURL){

        var retrievedData;
        $.ajax({
            
            data: {
                apikey:"210a12390dca7dd6948cd30a4cd5eda2",
                q_track: artistSearch,
                format:"jsonp",
                callback:"jsonp_callback"
            },
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            url: queryURL,
            method: "GET"
        }).done(function(data1){

            retrievedData = data1;
            //console.log("Musixmatch:" +retrievedData); 
            var track = retrievedData.message.body.track_list[0];

            //Check if call returns data
            if(track == null){
                console.log("ERROR ERROR ERROR");
                $("#artistSearch").val("No song found");
                //1.5 seconds and then the text goes blank
                _.delay(function(){
                    $("#artistSearch").val("");
                },1500)
                return;
            }     
            var trackId=retrievedData.message.body.track_list[0].track.track_id;    
            //console.log(data1.message.body.track_list[0].track.track_name);
            var track_name=data1.message.body.track_list[0].track.track_name;
            
            //another MusixMatch Ajax Call to get the lyrics based on trackId
            if(retrievedData.message.body.track_list[0].track.has_lyrics===1)
            {
                queryURL="https://api.musixmatch.com/ws/1.1/track.lyrics.get";
                $.ajax({
            
                    data: {
                        apikey:"210a12390dca7dd6948cd30a4cd5eda2",
                        track_id: trackId,
                        format:"jsonp",
                        callback:"jsonp_callback"
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'jsonp_callback',
                    contentType: 'application/json',
                    url: queryURL,
                    method: "GET"
                }).done(function(data){
        
                    var stringData = JSON.stringify(data);
                    
                    $("#lyrics-holder").empty();
                    var lyrics = data.message.body.lyrics.lyrics_body;
                    var indexOfAsterix = lyrics.indexOf("*");
                    var strLength = lyrics.length;
                    var cutLyrics = lyrics.substring(0,indexOfAsterix - 1);
                    $("#lyrics-holder").append("<strong>"+track_name+"</strong><br><br>");
                    
                    //String manipulations to print lyrics line by line
                    var currentLine = "";
                    for(var i = 0; i <= strLength ; i++){

                        var checkPart = cutLyrics.substring(i,i+1);
                        
                        if(checkPart === "\n"){
                            
                            var lyricDiv = $("<p>");
                            lyricDiv.text(currentLine);
                            $("#lyrics-holder").append(lyricDiv);
                            currentLine = "";

                            //Hide Recent and Trending when lyrics are searched
                            $("#recentJumbo").css("display","none");
                            $("#trendingJumbo").css("display","none");
                            $("#music-player").css("display","none");
                            $("#lyrics-holder").css("text-align","center");
                            $("#lyrics-holder").css("font-size","18px");
                            $("#lyrics-holder").css("color","white");

                        }
                        else
                        {
                            currentLine = currentLine + checkPart;
                        }
                        
                    }
                
            })
        }

        }).fail(function(error){

            console.log("ERROR: ");
            $("#searchText").val("No Lyrics found");

        });

        return retrievedData;
        
    }

    //Function to display top 10 tracks of Artist name entered 
    function playlistSearch()
    {
        var retrieveddata;
        
        //Ajax Call to last.fm
        $.ajax({
           
            type : 'POST',
            url : 'http://ws.audioscrobbler.com/2.0/',
            data : 'method=artist.gettoptracks&' +
               'artist='+artistSearch+'&' +
               'api_key=526e845a2fb646935dce28bbef50eaaf&' +
               'format=json',
               
        }).done(function(data1){

            retrieveddata = JSON.stringify(data1);
            //console.log("Lastfm:" +retrieveddata);    
            var topTracks = data1.toptracks;

            //Check if call returns data
            if(topTracks == null){
                console.log("ERROR ERROR ERROR");
                $("#artistSearch").val("No Artist found");
                //1.5 seconds and then the text goes blank
                _.delay(function(){
                    $("#artistSearch").val("");
                },1500)
                return;
            }

            //Hide Recent and Trending when playlists are searched
            $("#lyrics-holder").empty();
            $("#recentJumbo").css("display","none");
            $("#trendingJumbo").css("display","none");
            $("#music-player").css("display","inherit");
            $("#lyrics-holder").css("text-align","center");
            //display image of an artist
            var image=$("<img>");
            
            image.attr("src",data1.toptracks.track[0].image[2]['#text']);
            $("#lyrics-holder").append(image);

            //display top 10 lyrics of an artist
            for(var j=0;j<10;j++)
            {
                var html =$("<a>");
                html.attr("href",data1.toptracks.track[j].url);
                html.text(JSON.stringify(data1.toptracks.track[j].name));
                html.attr("target",'song');
                html.attr("artist-img",data1.toptracks.track[0].image[2]['#text']);
                html.addClass("link");
                //console.log(data1.toptracks.track[j].artist.name);
                html.attr("track-name",data1.toptracks.track[j].name);
                html.attr("artist-name",data1.toptracks.track[j].artist.name);
                $("#lyrics-holder").append("<br><br>");
                $("#lyrics-holder").append(html);
                html.css("color","white");
            }
           
    }).fail(function(){

        console.log("ERROR: ");
        $("#searchText").val("No Artist found");

    });

    }

   //function to display trending tracks in Trending section
    function trendingList()
    {
        
        $.getJSON('http://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&api_key=526e845a2fb646935dce28bbef50eaaf&format=json', 
        function(response) {resultData = response}).done(function (resultData) 
        {
           
            //console.log("Trending:"+JSON.stringify(resultData));
            //display 4 trending tracks at a time
            for (var i= trendingStart;i< (trendingStart + 4);i++)
            {
                //pick tracks among  top 50 tracks from last.fm    
                
                    var currTrack = resultData.tracks.track[i];   
                    var artistImage = currTrack.image[2]["#text"];
                    var artistName = currTrack.artist.name;
                    var trackName = currTrack.name;
                    var trackurl = currTrack.url;
                    var difference = (trendingStart+4)-i;
                    var currentLink = "#link"+(difference-1);
                    $("#image"+(difference-1)).attr("src",artistImage);
                    $(currentLink).attr("href",trackurl);
                    $(currentLink).attr("target","song");
                    $(currentLink).text(trackName);
                    $(currentLink).attr("track-name",trackName);
                    $(currentLink).attr("artist-name",artistName);
                    $(currentLink).attr("artist-img",artistImage);
            }
        })
        
    }

   //function to display recently played tracks in Recent section
   function recentPlaylist()
   {
        
        //retrieve and display first recent track from firebase
        database.ref("SoundWave/Recent/One").on("value", function(snapshot) {
        
           $.getJSON('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist='+snapshot.val().artistName+'&track='+snapshot.val().trackName+'&api_key=526e845a2fb646935dce28bbef50eaaf&format=json', 
           function(response) {result = response}).done(function (result) 
           { 
               console.log(result.track.url);
               $("#img1").attr("src",snapshot.val().artistImage);
               $("#lnk1").attr("href",result.track.url);
               $("#lnk1").attr("target",'song');
               $("#lnk1").text(result.track.name);
               $("#lnk1").attr("artist-name",result.track.artist.name);
           })
          
        })
           
        //retrieve and display second recent track from firebase
        database.ref("SoundWave/Recent/Two").on("value", function(snapshot) {
        
           $.getJSON('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist='+snapshot.val().artistName+'&track='+snapshot.val().trackName+'&api_key=526e845a2fb646935dce28bbef50eaaf&format=json', 
           function(response) {result = response}).done(function (result) 
           {  
               //console.log(result.track.url);
               $("#img2").attr("src",snapshot.val().artistImage);
               $("#lnk2").attr("href",result.track.url);
               $("#lnk2").attr("target",'song');
               $("#lnk2").text(result.track.name);
               $("#lnk2").attr("artist-name",result.track.artist.name);
           })
           
        });

        //retrieve and display third recent track from firebase
        database.ref("SoundWave/Recent/Three").on("value", function(snapshot) {
        
           $.getJSON('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist='+snapshot.val().artistName+'&track='+snapshot.val().trackName+'&api_key=526e845a2fb646935dce28bbef50eaaf&format=json', 
           function(response) {result = response}).done(function (result) 
           {
               //console.log(result);
               $("#img3").attr("src",snapshot.val().artistImage);
               $("#lnk3").attr("href",result.track.url);
               $("#lnk3").attr("target",'song');
               $("#lnk3").text(result.track.name);
               $("#lnk3").attr("artist-name",result.track.artist.name);
           })
           
        });

        //retrieve and display fourth recent track from firebase
        database.ref("SoundWave/Recent/Four").on("value", function(snapshot) {
        
           $.getJSON('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist='+snapshot.val().artistName+'&track='+snapshot.val().trackName+'&api_key=526e845a2fb646935dce28bbef50eaaf&format=json', 
           function(response) {result = response}).done(function (result) 
           {   
               //console.log(result);
               $("#img4").attr("src",snapshot.val().artistImage);
               $("#lnk4").attr("href",result.track.url);
               $("#lnk4").attr("target",'song');
               $("#lnk4").text(result.track.name);
               $("#lnk4").attr("artist-name",result.track.artist.name);
           })

         });
   }

   //to check if same record already exists in firebase
   $(window).on("load",function() {
    localStorage.setItem("Tracks", JSON.stringify(trackName));
    // retrieving our data and converting it back into an array
    var retrievedData = localStorage.getItem("Tracks");
    var trackName = JSON.parse(retrievedData);
    console.log(trackName);
    alert(trackName);
  });

   //Store track-name,artist-name of currently played track ('ON CLICK' of hyperlink(class=link)) in firebase
   $(document).on("click",".link",function() {
        
    var recentText=$(this).attr("track-name");
    var checknumber = trackName.indexOf(recentText);
    //used set over push for firebase because we have preset folders     
    if(checknumber===-1)
    {
        if(records===0)
        {
            
            database.ref("SoundWave/Recent/One").set({
            link:this.href,
            trackName:$(this).attr("track-name"),
            artistName:$(this).attr("artist-name"),
            artistImage: $(this).attr("artist-img")
            });
            records++;
        }
        else if(records===1)
        {
            database.ref("SoundWave/Recent/Two").set({
            link:this.href,
            trackName:$(this).attr("track-name"),
            artistName:$(this).attr("artist-name"),
            artistImage: $(this).attr("artist-img")
            });
            records++;

        }
        else if(records===2)
        {
            database.ref("SoundWave/Recent/Three").set({
            link:this.href,
            trackName:$(this).attr("track-name"),
            artistName:$(this).attr("artist-name"),
            artistImage: $(this).attr("artist-img")
            });
            records++;

        }
        else if(records===3)
        {
            database.ref("SoundWave/Recent/Four").set({
            link:this.href,
            trackName:$(this).attr("track-name"),
            artistName:$(this).attr("artist-name"),
            artistImage: $(this).attr("artist-img")
            });
            records=0;
        }
        trackName.push($(this).attr("track-name"));
        
    }
            
    });
   

    //navigating through top tracks
    $("#arrowright").on("click",function()
    {
        trendingStart =trendingStart+ 4;
        if(trendingStart>=49)
        {
            trendingStart=0;
        }
        trendingList();
       
    });

    //navigating through top tracks
    $("#arrowleft").on("click",function()
    {   
        trendingStart =trendingStart- 4;
        if(trendingStart<=0)
        {
            trendingStart=49;
        }
        trendingList();


    });

    
    //on-click of Lyrics-search button
    $("#Lyrics-search").on("click",function(){

        event.preventDefault();     
        searchtype = "artist";
        artistSearch=$("#artistSearch").val().trim();

        //validation for search text
        if(artistSearch.length < 3){

            $("#artistSearch").val("");
            $("#artistSearch").val("Search too short");
    
            _.delay(function(){
                $("#artistSearch").val("");
               
            }, 1500);
            return;

        }

        queryURL="https://api.musixmatch.com/ws/1.1/track.search";
        $("#search-type-display").text("Artist name");
        ajaxCall(queryURL);

    });

    //on-click of Playlist-search button
    $("#Playlist-search").on("click",function(){

        event.preventDefault();     
        searchtype = "artist";
        artistSearch=$("#artistSearch").val().trim();
        $("#music-player").css("display","inherit");
        //validation for search text
        if(artistSearch.length < 3){

            $("#artistSearch").val("");
            $("#artistSearch").val("Search too short");
            _.delay(function(){
                $("#artistSearch").val("");
                
            }, 1500);
            return;

        }

        queryURL="https://api.musixmatch.com/ws/1.1/track.search";
        $("#search-type-display").text("Artist name");
        
        playlistSearch();
        
    });

});