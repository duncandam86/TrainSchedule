$(document).ready(function () {


    //initialize firebase connection
    var config = {
        apiKey: "AIzaSyC_C2yBW6xyfYsyGY8zbZbn8csQqaxqmQ0",
        authDomain: "clickbuttoncounter-8d19a.firebaseapp.com",
        databaseURL: "https://clickbuttoncounter-8d19a.firebaseio.com",
        projectId: "clickbuttoncounter-8d19a",
        storageBucket: "clickbuttoncounter-8d19a.appspot.com",
        messagingSenderId: "732823821420"
    };
    firebase.initializeApp(config);
    //store data from firebase in database variable
    var database = firebase.database();

    //create current time
    function currentTime() {
        var current = moment().format('MMMM Do YYYY, h:mm:ss a');
        $("#current-time").html(current);
        setTimeout(currentTime, 1000);
    };

    currentTime();

    //set up click even for submit button
    $("#submit").on("click", function (event) {
        console.log("form submission");
        event.preventDefault();
        var AddTrainName = $("#add-train-name").val().trim();
        var AddDestination = $("#add-destination").val().trim();
        var AddFirstTrainArrival = $("#first-train-arrival").val().trim();
        var AddFrequency = $("#add-frequency").val().trim();
        console.log(AddTrainName, AddDestination, AddFirstTrainArrival, AddFrequency);

        //push information into firebase
        database.ref("/train-schedule").push({
            name: AddTrainName,
            destination: AddDestination,
            first_arrival: AddFirstTrainArrival,
            frequency: AddFrequency,
        });
    })

    //set up the child_added event for firebase train-schedule location
    database.ref("/train-schedule").on("child_added", function (childSnap) {
        //console.log(childSnap);
        console.log(childSnap.val());
        //create a new Row using <tr> tag
        var newRow = $("<tr>");
        newRow.addClass("text-center");
        //create a new variable to store the name and put it in a <td> tag
        var newTrainName = $("<th>").text(childSnap.val().name);
        console.log(childSnap.val().name);
        //create a new variblae to store new destination
        var newDestination = $("<td>").text(childSnap.val().destination);
        console.log(childSnap.val().destination);
        //create a new variblae to store new first arrival
        var newFrequency = $("<td>").text(childSnap.val().frequency);
        console.log(childSnap.val().frequency);

        //create a new variblae to store new first arrival
        // convert first arrival to hh:mm 
        var newFirstTrainArrival = moment(childSnap.val().first_arrival, "hh:mm").subtract(1, "years");
        console.log(newFirstTrainArrival.format());
        //calculate time difference between now and new first arrival by minutes
        var timeDifferent = moment().diff(newFirstTrainArrival, "minutes")
        console.log(timeDifferent);

        //calculate the amount of minute until the next train arrives
        var minuteAway = childSnap.val().frequency - (timeDifferent % childSnap.val().frequency);
        console.log(minuteAway);
        var newMinuteAway = $("<td>").text(minuteAway);

        //calculate and set the time for the next arrival time
        var nextArrival = moment().add(minuteAway, "minutes").format('LT');
        console.log(nextArrival);
        var newNextArrival = $("<td>").text(nextArrival);

        //create a remove button
        var removeButton = $("<button>");
        removeButton.addClass("btn btn-danger text-center fa fa-trash");
        var key = childSnap.key; //store the key of each child into a variable
        removeButton.attr("data-key", key);
        var newRemoveButton = $("<td>").append(removeButton)

        newRow.append(newTrainName, newDestination, newFrequency, newNextArrival, newMinuteAway, newRemoveButton);
        $("#table-body").append(newRow);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    //remove row from remove button
    $(document).on("click", ".fa-trash", function () {
        // remove the row when trash button is clicked on html
        $(this).closest("tr").remove();
        //remove the data from firebase
        var keyref = $(this).attr("data-key");//create variable to store the key of each child
        console.log(keyref);
        database.ref("/train-schedule").child(keyref).remove();//remove the child 
    });

    //create function for page to automatically restart
    setInterval(function () {
        window.location.reload();
    }, 50000);

})