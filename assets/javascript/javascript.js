$(document).ready(function(){

    //variables


    

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



    });

    $("#recommended-music").on("click",function(){



    });

    $("#search-button").on("click",function(){
        


    });

    $("#top-music").on("click",function(){



    });

});