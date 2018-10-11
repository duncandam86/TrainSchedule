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
        //console.log(childSnap.val());
        //create a new Row using <tr> tag
        var newRow = $("<tr>");
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
        
        //calculate and set the time for the next arrival time
        var nextArrival = moment()+(timeDifferent % childSnap.val().frequency); 
        console.log(nextArrival);

        //calculate the amount of minute until the next train arrives
        var minuteAway = childSnap.val().frequency - (timeDifferent % childSnap.val().frequency);
        console.log(minuteAway);

        newRow.append(newTrainName, newDestination, newFrequency, nextArrival, minuteAway);
        $("#table-body").append(newRow);



    })

















})