$(document).ready(function(){

    //variables

    var searchtype = "all";//artist, song, by lyrics

    var artistSearch;

    var queryURL;
   
   
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
            console.log(trackId);
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
                    //console.log(stringData);
                    //console.log("Musixmatch:" +JSON.parse(stringData));  
                    //console.log(data.message.body.lyrics.lyrics_body) ;
                    //$("#recent").html(data.message.body.lyrics.lyrics_body)
                    $("#lyrics-holder").empty();
                    var lyrics = data.message.body.lyrics.lyrics_body;
                    var indexOfAsterix = lyrics.indexOf("*");
                    var strLength = lyrics.length;
                    var cutLyrics = lyrics.substring(0,indexOfAsterix - 1);
                    //$("#lyrics-holder").text(cutLyrics);
                    var currentLine = "";
                    for(var i = 0; i <= strLength ; i++){

                        var checkPart = lyrics.substring(i,i+1);
                        //console.log("checkPart: " + checkPart);
                        if(checkPart === "\n"){
                            console.log("success");
                            console.log("Current Line Finished: " + currentLine);
                            var lyricDiv = $("<p>");
                            lyricDiv.text(currentLine);
                            $("#lyrics-holder").append(lyricDiv);
                            currentLine = "";
                            $("#recentJumbo").css("display","none");
                            $("#trendingJumbo").css("display","none");
                        }else{
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

    function Music()
    {
        var retrieveddata;
        console.log("for Spotify");
        $.ajax({
           
            type : 'POST',
            url : 'http://ws.audioscrobbler.com/2.0/',
            data : 'method=artist.getinfo&' +
               'artist='+artistSearch+'&' +
               'api_key=526e845a2fb646935dce28bbef50eaaf&' +
               'format=json',
        
        }).done(function(data1){

            retrieveddata = data1;
            console.log("Lastfm:" +retrieveddata);    
            window.location.href=retrieveddata.artist.url;
            console.log(retrieveddata.artist.image[2]);
            //$("#image1").attr('src',retrieveddata.artist.image[2]['#text'] );
    });
    }

    function lastFMcall()
    {
        //$.getJSON('http://ws.audioscrobbler.com/2.0/?method=user.getTopArtists&period=3month&user=samosfator&api_key=526e845a2fb646935dce28bbef50eaaf&format=json', 
        $.getJSON('http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&period=3month&api_key=526e845a2fb646935dce28bbef50eaaf&format=json', 
        function(response) {result = response}).done(function (result) 
        {
           
            console.log(result)
            for (var i=0;i<5;i++)
        {
            console.log(result.artists.artist[i].image[2]['#text']);
            var j=Math.floor((Math.random() * 50) + 1);          
            $("#image"+i).attr("src",result.artists.artist[j].image[2]['#text']);
            $("#link"+i).attr("href",result.artists.artist[j].url);
            $("#link"+i).text(result.artists.artist[j].name);
        }
        })
        
    }

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
        //Music();
    });

    $("#Playlist-search").on("click",function(){

        event.preventDefault();     
        searchtype = "artist";
        artistSearch=$("#artistSearch").val().trim();
        queryURL="https://api.musixmatch.com/ws/1.1/track.search";
        $("#search-type-display").text("Artist name");
        
        console.log("Testing");
        
        Music();
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