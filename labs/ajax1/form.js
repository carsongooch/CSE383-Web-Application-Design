/*
 * Carson Gooch, cse383, Fall 2026, Week9 XMLHTTPRequest
 * */

function sendTransfer(event) {
	event.preventDefault();

	const data = {
		uid: "goochcj",
		location: document.getElementById("Location").value,
		computer: document.getElementById("computer").value
	};

	const xhr = new XMLHttpRequest();
	xhr.open("POST", "https://ceclnx01.cec.miamioh.edu/~campbest/cse383/api/load.php", true);
	xhr.setRequestHeader(
		"Content-Type",
		"application/json"
	);
	xhr.addEventListener("load",function() {
		console.log(xhr.responseText);	
        try {
                let data = JSON.parse(xhr.responseText);
                console.log(data);
		document.getElementById("Location").value = "";
        
	} catch (error) {
                console.log("Error, bad JSON", error);
        	}	
	});
	xhr.send(JSON.stringify(data));
}
