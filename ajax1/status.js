/*
 * Carson Gooch, cse383, Fall 2026, Week9 XMLHTTPRequest
 * */


//list of fields that should be in JSON response
var fields = ["clientIp","load1","load5","load15","numUsers","numTcpConnections","txBytes","rxBytes"];
//which URL are we using (lets us use loadError.php)
let url="https://ceclnx01.cec.miamioh.edu/~campbest/cse383/api/load.php";

//switch between url's
function toggleError() {
  var d = document.getElementById("toggleError");
  if (d.textContent=="Turn Errors On") {
    console.log("Turn on errors");
    url = "https://ceclnx01.cec.miamioh.edu/~campbest/cse383/api/loadError.php";
    d.textContent="Turn Errors Off";
  }
  else {
    console.log("Turn off errors");
    url="https://ceclnx01.cec.miamioh.edu/~campbest/cse383/api/load.php";

    d.textContent="Turn Errors On";
  }

}

//xmlhttprequest response handler
function updateStatus() {

  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);

  xhr.addEventListener("load", function() {

    if (this.status==200) {
      try {
        const data = JSON.parse(xhr.responseText);

        document.getElementById("clientIp").textContent =
          data.client_ip;

        document.getElementById("load1").textContent =
          data.load_1min;

        document.getElementById("load5").textContent =
          data.load_5min;

        document.getElementById("load15").textContent =
          data.load_15min;

        document.getElementById("numUsers").textContent =
          data.numUsers;

        document.getElementById("numTcpConnections").textContent =
          data.numTcpConnections;

        document.getElementById("txBytes").textContent =
          data.txBytes.toLocaleString();

        document.getElementById("rxBytes").textContent =
          data.rxBytes.toLocaleString();

	document.getElementById("locationRecord1").textContent =
		data.Other.info[0].uid + " " + data.Other.info[0].location + " " + data.Other.info[0].computer;

        document.getElementById("locationRecord2").textContent =
                data.Other.info[1].uid + " " + data.Other.info[1].location + " " + data.Other.info[1].computer;

        document.getElementById("locationRecord3").textContent =
                data.Other.info[2].uid + " " + data.Other.info[2].location + " " + data.Other.info[2].computer;

        document.getElementById("locationRecord4").textContent =
                data.Other.info[3].uid + " " + data.Other.info[3].location + " " + data.Other.info[3].computer;

        document.getElementById("locationRecord5").textContent =
                data.Other.info[4].uid + " " + data.Other.info[4].location + " " + data.Other.info[4].computer; 

        document.getElementById("lastUpdated").textContent =
          new Date().toLocaleTimeString();
      } catch (e) {
        console.log("Error parsing json",e)
        document.getElementById("lastUpdated").textContent = "Error parsing json"
      }
    }
    else {//oops -> Got error response
      console.log("Error");
      //clear out fields
      for (i of fields) {
        document.getElementById(i).textContent="Error";
      }
      document.getElementById("lastUpdated").textContent = "Error retrieiving data"
    }

  });

  //actually send out request
  xhr.send();
}


// Get data immediately
updateStatus();


// Update every 5 seconds
setInterval(updateStatus, 5000);
