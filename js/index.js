console.log("binded corectly");
$('.buttons').hide();
var prev = "", next = "";

//Fetch
function handleFetch(searchTerm, callback){
    let apiKey = "AIzaSyAYKZ1juzmCref1emyZqXaNqwvCq2zBHXs";
    let url = `https://www.googleapis.com/youtube/v3/search?maxResults=10&part=snippet&key=${apiKey}&q=${searchTerm}`;
    
    fetch(url) //fetch(url,{method:"GET"}) --> in case you want to specify, takes GET for default
        .then(response => {
            if (response.ok){
                return response.json();
            }else{
                throw new Error("Something went wrong. Try again later.");
            }
        })
        .then(responseJson => {
            callback(responseJson);
        }) 
        .catch(err =>{
            $('.results').html(err.message);
        })
}

//Fetch more or less Results
function handleNewFetch(searchTerm, token, callback){
    let apiKey = "AIzaSyAYKZ1juzmCref1emyZqXaNqwvCq2zBHXs";
    let url = `https://www.googleapis.com/youtube/v3/search?maxResults=10&part=snippet&key=${apiKey}&q=${searchTerm}&pageToken=${token}`;
    
    fetch(url)
        .then(response => {
            if (response.ok){
                return response.json();
            }else{
                throw new Error("Something went wrong. Try again later.");
            }
        })
        .then(responseJson => {
            callback(responseJson);
        }) 
        .catch(err =>{
            $('.results').html(err.message);
        })
}

//Results
function displayResults(data){
    prev = data.prevPageToken;
    next = data.nextPageToken;
    console.log("Next Page Token " + next);
    console.log("Previous Page Token " + prev);

    if(prev == undefined){
        $('#previous').attr('disabled', true);
    }else{
        $('#previous').attr('disabled', false);
    }
    if(next == undefined){
        $('#next').attr('disabled', true);
    }else{
        $('#next').attr('disabled', false);
    }

    $('.results').html('');
    data.items.forEach(function(video){
        let id = video.id.videoId;
        let link = `https://www.youtube.com/watch?v=${id}`;
        $('.results').append(`
            <div class="videos">
                <h3>${video.snippet.title}</h3>
                <a href="${link}" target="_blank"> <img src="${video.snippet.thumbnails.medium.url}"> </a>
                <hr>
            </div>`);
    });
}


//Submit with handleFetch
$('.apiForm').on('submit', (event) => {
    event.preventDefault();
    let videos = $('#apiSearchBox').val();
    if(videos != ""){
        handleFetch(videos, displayResults);
        $('.buttons').show();
    }else{
        alert("Please enter a keyword");
    }
});

//Previous with new fetch
$('#previous').on('click', (event) => {
    event.preventDefault();
    let videos = $('#apiSearchBox').val();
    handleNewFetch(videos, prev, displayResults);
    $("body").scrollTop(0);
    $('.buttons').show();
});

//Next with new fetch
$('#next').on('click', (event) => {
    event.preventDefault();
    let videos = $('#apiSearchBox').val();
    handleNewFetch(videos, next, displayResults);
    $("body").scrollTop(0);
    $('.buttons').show();
});

