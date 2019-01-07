$(document).ready(function(){

    //variables

    var searchtype = "all";//artist, song, by lyrics

    var artistSearch;

    var queryURL;

    //database Var
    var k=0;
    var records=0;
   
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
    var recentOne;
    var recentTwo;
    var recentThree;
    var recentFour;
   
    //functions
    function createMusicSquare(){

        //going to be creating a lot of the same objects
        //better to just have a function to create one with params

        var audioElement = new Audio();
        audioElement.src = "info-from-ajax";

        play-button.on("click",function(){

            audioElement.play();

        });

        pause-button.on("click",function(){

            audioElement.pause();

        });

    }

    lastFMcall();
    recentPlaylist();
    function createArtistRow(){



    }


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
            console.log("Musixmatch:" +retrievedData);      
            var trackId=retrievedData.message.body.track_list[0].track.track_id;    
            console.log(data1.message.body.track_list[0].track.track_name);
            var track_name=data1.message.body.track_list[0].track.track_name;
            //$("#lyrics-tilte").text(data1.message.body.track_list[0].track.track_name);
            //window.location.href=retrievedData.message.body.track_list[0].track.track_share_url;

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
                    
                    var currentLine = "";
                    for(var i = 0; i <= strLength ; i++){

                        var checkPart = cutLyrics.substring(i,i+1);
                        
                        if(checkPart === "\n"){
                            
                            var lyricDiv = $("<p>");
                            lyricDiv.text(currentLine);
                            $("#lyrics-holder").append(lyricDiv);
                            currentLine = "";
                            $("#recentJumbo").css("display","none");
                            $("#trendingJumbo").css("display","none");
                            $("#lyrics-holder").css("text-align","center");
                            $("#lyrics-holder").css("font-size","18px");
                            //$("#lyrics-holder").css("font-weight","bold");

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

        });

        return retrievedData;
        

    }

    function playlistSearch()
    {
        var retrieveddata;
        
        $.ajax({
           
            type : 'POST',
            url : 'http://ws.audioscrobbler.com/2.0/',
            data : 'method=artist.gettoptracks&' +
               'artist='+artistSearch+'&' +
               'api_key=526e845a2fb646935dce28bbef50eaaf&' +
               'format=json',
               
        }).done(function(data1){

            retrieveddata = JSON.stringify(data1);
            console.log("Lastfm:" +retrieveddata);    
            //window.location.href=retrieveddata.artist.url;
            $("#lyrics-holder").empty();
            $("#recentJumbo").css("display","none");
            $("#trendingJumbo").css("display","none");
            $("#lyrics-holder").css("text-align","center");
            var image=$("<img>");
            image.attr("src",data1.toptracks.track[0].image[2]['#text']);
            $("#lyrics-holder").append(image);
            for(var j=0;j<10;j++)
            {
                var html =$("<a>");
                html.attr("href",data1.toptracks.track[j].url);
                html.text(JSON.stringify(data1.toptracks.track[j].url));
                html.attr("target",'_blank');
                html.addClass("link");
                console.log(data1.toptracks.track[j].artist.name);
                html.attr("track-name",data1.toptracks.track[j].name);
                html.attr("artist-name",data1.toptracks.track[j].artist.name);
                //html += "<p><a href=" + data1.toptracks.track[j].url + "class='link' target='_blank'>" +data1.toptracks.track[j].url+ "</a></p>";
                $("#lyrics-holder").append("<br><br>");
                $("#lyrics-holder").append(html);
            }
           
    });

   /* $.getJSON("http://ws.audioscrobbler.com/2.0/?method=user.getTopArtists&user=test&api_key=526e845a2fb646935dce28bbef50eaaf&limit=10&format=json&callback=?", function(json) {
        var html = '';
        $.each(json.topartists.artist, function(i, item) {
            html += "<p><a href=" + item.url + " target='_blank'>" + item.name + " - " + "Play count : " +item.playcount + "</a></p>";
        });
        $("#lyrics-holder").empty();
        $("#recentJumbo").css("display","none");
        $("#trendingJumbo").css("display","none");
        $('#lyrics-holder').append(html);*/
    
}

    function lastFMcall()
    {
        //$.getJSON('http://ws.audioscrobbler.com/2.0/?method=user.getTopArtists&period=3month&user=samosfator&api_key=526e845a2fb646935dce28bbef50eaaf&format=json', 
        $.getJSON('http://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&period=3month&api_key=526e845a2fb646935dce28bbef50eaaf&format=json', 
        function(response) {result = response}).done(function (result) 
        {
           
            //console.log(result.tracks);
            for (var i=1;i<5;i++)
        {
            
            var j=Math.floor((Math.random() * 50) + 1);     
            //console.log(result.tracks.track[j].name);     
            $("#image"+i).attr("src",result.tracks.track[j].image[2]['#text']);
            $("#link"+i).attr("href",result.tracks.track[j].url);
            $("#link"+i).attr("target",'_blank');
            $("#link"+i).text(result.tracks.track[j].name);
            $("#link"+i).attr("track-name",result.tracks.track[j].name);
            $("#link"+i).attr("artist-name",result.tracks.track[j].artist.name);
        }
        })
        
    }

   function recentPlaylist()
   {
    database.ref("SoundWave/Recent").on("child_changed", function(snapshot) {
        console.log("Recent Changed");
        console.log("Snapshot"+snapshot.val().artistName);
        link= snapshot.val().link;
        
           // $("#lnk"+i).text(link);

           $.getJSON('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist='+snapshot.val().artistName+'&track='+snapshot.val().trackName+'&api_key=526e845a2fb646935dce28bbef50eaaf&format=json', 
           function(response) {result = response}).done(function (result) 
           {
            
               //console.log(result.tracks.track[0].artist.name);
               //for (var i=1;i<=5;i++)
           //{
               
                  
               //console.log(result);     
               $("#img"+k).attr("src",result.track.album.image[2]['#text']);
               $("#lnk"+k).attr("href",result.track.album.url);
               $("#lnk"+k).attr("target",'_blank');
               $("#lnk"+k).text(result.track.album.title);
               $("#lnk"+k).attr("artist-name",result.track.album.artist);
           //}
           })
           k++;

    });
   }

    $(document).on("click",".link",function() {
        console.log(this.href);
        console.log("Database1");
        if(records===0)
        {
            console.log("One");
            database.ref("SoundWave/Recent/One").push({
            link:this.href,
            trackName:$(this).attr("track-name"),
            artistName:$(this).attr("artist-name"),
            });
            records++;
        }
        else if(records===1)
        {
            console.log("Two");
            database.ref("SoundWave/Recent/Two").push({
            link:this.href,
            trackName:$(this).attr("track-name"),
            artistName:$(this).attr("artist-name"),
            });
            records++;

        }
        else if(records===2)
        {
            console.log("3");
            database.ref("SoundWave/Recent/Three").push({
            link:this.href,
            trackName:$(this).attr("track-name"),
            artistName:$(this).attr("artist-name"),
            });
            records++;

        }
        else if(records===3)
        {
            database.ref("SoundWave/Recent/Four").push({
            link:this.href,
            trackName:$(this).attr("track-name"),
            artistName:$(this).attr("artist-name"),
            });
            records=0;
        }
            
        
    });
   

    $("#arrowright").on("click",function()
    {
        lastFMcall();
    });

    $("#arrowleft").on("click",function()
    {
        lastFMcall();
    });

    $("#home-button").on("click",function(){

        //take me home to the place i belong west virginia

    });
    $("#main-btn").on("click",function(){

        //take me home to the place i belong west virginia
        
        
    });

    
    $("#recommended-music").on("click",function(){



    });

    $("#search-button").on("click",function(){
        


    });

    $("#top-music").on("click",function(){



    });


    $("#Lyrics-search").on("click",function(){

        event.preventDefault();     
        searchtype = "artist";
        artistSearch=$("#artistSearch").val().trim();
        queryURL="https://api.musixmatch.com/ws/1.1/track.search";
        $("#search-type-display").text("Artist name");
        console.log(queryURL);
        console.log("Testing");
        ajaxCall(queryURL);
        //playlistSearch();
    });

    $("#Playlist-search").on("click",function(){

        event.preventDefault();     
        searchtype = "artist";
        artistSearch=$("#artistSearch").val().trim();
        queryURL="https://api.musixmatch.com/ws/1.1/track.search";
        $("#search-type-display").text("Artist name");
        
        playlistSearch();
        //lastFMcall();
    });

    $("#lyric-search").on("click",function(){

        searchtype = "lyric";
        $("#search-type-display").text("Lyrics");

    });

    $("#song-search").on("click",function(){

        searchtype = "song";
        $("#search-type-display").text("Song name");

    });

});