$(function() {
    initMaterialize();
    loc.getLocation();
    setFindClick();
});

// initialize Materialize elements
function initMaterialize() {
    // MATERIALIZE INIT CALLS HERE
    
}

var loc = {
	lat: null,
	lon: null,
	
	// get user's location if browser supports it
	getLocation: function() {
		if ("geolocation" in navigator) {
			var watchID = navigator.geolocation.watchPosition(function(position) {
				loc.lat = position.coords.latitude;
                loc.lon = position.coords.longitude;
                $(".find_food").prop("disabled", false);
                
                console.log("Location updated.");
				console.log("lat: " + loc.lat);
				console.log("lon: " + loc.lon);
			});
        } else {
            console.log("Unable to access location.");
        }
	}
};

// enable #find_food button, set onclick action
function setFindClick() {
    $(".find_food").on("click", function() {
        const radius = $("#search_radius").val();

		// fill modal with ajax from POST call
		$.post("/api/find", {
            lat: loc.lat,
            lon: loc.lon,
            radius: radius
        })
		.done(function(data) {
            console.log(data);
            $("#rest_name").text(data.name);
            $("#rest_photo").attr("src", data.image_url);
            $("#rest_cats").text(JSON.stringify(data.categories));
            $("#rest_price").text(data.price);
            $("#rest_rating").text(data.rating);
            $("#rest_phone").text(data.address);
            $("#rest_address").text(data.distance);
            $("#rest_distance").text(data.phone);
		})
		.fail(function() {
			console.log("failed POST call.");
        });
        
        // init, open modal
		$("#a_modal").modal();
		$("#a_modal").modal("open");

    });
}