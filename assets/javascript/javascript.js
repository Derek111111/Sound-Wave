$(document).ready(function(){

    //variables

    var searchtype = "all";//artist, song, by lyrics


    

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

    function createArtistRow(){



    }

    function ajaxCall(queryURL){

        var retrievedData = null;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(data){

            retrievedData = data;

        }).fail(function(error){

            console.log("ERROR: " + erorr);

        });

        return retrievedData;

    }

    $("#home-button").on("click",function(){

        //take me home to the place i belong west virginia

    });

    $("#recommended-music").on("click",function(){



    });

    $("#search-button").on("click",function(){
        


    });

    $("#top-music").on("click",function(){



    });


    $("#artist-search").on("click",function(){

        searchtype = "artist";
        $("#search-type-display").text("Artist name");

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