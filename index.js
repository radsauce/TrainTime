//configure firebase
var config = {
  apiKey: "AIzaSyA7wpR-OC99TdahQqvOhcQBWLCVTb4my_o",
  authDomain: "traintime-97e94.firebaseapp.com",
  databaseURL: "https://traintime-97e94.firebaseio.com",
  projectId: "traintime-97e94",
  storageBucket: "traintime-97e94.appspot.com",
  messagingSenderId: "322202505674"
};
//initialize firebase
firebase.initializeApp(config);

//create database variable
var db = firebase.database();

//Current time banner
function realtime() {
  let cTime = moment().format('dddd, MMM D YYYY, HH:mm:ss a');
  document.querySelector('#currentTime').innerHTML = cTime;
  setInterval(() => {
    cTime = moment().format('dddd, MMM D YYYY, HH:mm:ss a');
    document.querySelector('#currentTime').innerHTML = cTime;
  }, 1000)
}
realtime();

//add train function
$('#tBtn').on('click', _ => {
  event.preventDefault();
  //retrieve inputs
    var tName = $('#tName').val().trim()
    var tDest = $('#tDest').val().trim()
    // var tTime = $('#tTime').val().trim()
    var tTime = moment($('#tTime').val().trim(), "HH:mm").format("X")
    var tFreq = $('#tFreq').val().trim()
    //create object for inputs
    var tInfo = {
      name: tName,
      destination: tDest,
      firstTime: tTime,
      frequency: tFreq,
    }
  //add object to firebase
    db.ref().push(tInfo);
    //clear input fields
    $('#tName').val('')
    $('#tDest').val('')
    $('#tTime').val('')
    $('#tFreq').val('')
  })

//Add train info table
function addTable() {
  db.ref().on("child_added", function (data) {
    var trainName = data.val().name
    var trainDest = data.val().destination
    var trainFirstTime = data.val().firstTime
    var trainFreq = data.val().frequency

    // Current time
    var currentTime = moment().format("X")

    // First train
    // var currentFirstTime = moment().set({'hours': trainFirstTime, 'minutes': trainFirstTime})
    var currentFirstTime = moment().set({ h: moment(trainFirstTime, "X").hour(), m: moment(trainFirstTime, "X").minute() }).format("X")
    // Minutes until arrival
    var minArrival = moment().diff(moment(currentFirstTime, "X"), 'minutes')
    var minLast = minArrival % trainFreq
    var awayTrain = 0

    // Determines Minutes away from Next Train
    if (minArrival < 0) {
      awayTrain = (-minArrival) + 1
    } else {
      awayTrain = (trainFreq - minLast)
    }
    //Freq Logic
    var logicFreq=""
    if (currentTime < currentFirstTime){
      logicFreq="Not Running"
    } else{
      logicFreq=trainFreq
    }
    // Determines Next Arrival
    var nextArrival = moment().add(awayTrain, 'minutes').format("hh:mm A")
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td>").text(logicFreq),
      $("<td>").text(nextArrival),
      $("<td>").text(awayTrain)
    );
    // Append the new row to the table
    $(".train-info-table").append(newRow)
  })
}  
addTable()
