let weeklyAmount = Number(prompt("How much will you save each week?"));
let numberOfWeeks = Number(prompt("How many weeks will you save? (1–10)"));


weeklyAmount = Number(weeklyAmount);
numberOfWeeks = Number(numberOfWeeks);

if (numberOfWeeks <= 0 || numberOfWeeks > 10 || numberOfWeeks % 1 != 0) {
	numberOfWeeks = 5;
}

if (weeklyAmount <= 0) {
	weeklyAmount = 10;
}



let totalSaved = 0;
let tableRows = "";
let goalReached = "Keep saving"


for (let i=0;i<numberOfWeeks;i++) {
	let weekNumber = i + 1;
	totalSaved += weeklyAmount;
	if (totalSaved >= 100) {
		goalReached = "Goal reached"
	}
	tableRows += "<tr><td>" + weekNumber + "</td><td>" + "$" + totalSaved.toFixed(2) + "</td><td>" + goalReached + "</td></tr>"
}
