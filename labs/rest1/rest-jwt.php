<?php

// load the composer package
require_once vendor/autoload.php

$redis = new Redis();

$redis->connect("127.0.0.1", 6379);

$method = strtolower($_SERVER['REQUEST_METHOD']);


// This part checks whether a URL path exists, splits the URL into an arary with explode
// Then removes the first empty array element so it just has something like "", "color"
if (isset($_SERVER['PATH_INFO'])) {
        $parts = explode("/",$_SERVER['PATH_INFO']);
        for ($i=0;$i<count($parts);$i++) {
                $parts[$i] = htmlspecialchars($parts[$i]);
        }
} else {
        $parts = array();
}

array_shift($parts);

// function return JSON data
// Sets HTTP response status, converts PHP array into json and gives it back
function returnJSON($statusCode,$statusMsg, $json) {
        header("HTTP/1.1 $statusCode $statusMsg",true,$statusCode);

        header("Content-Type: application/json",true);

        if ($json != null) {
                print json_encode($json);
        }
}

// checks if the method is GET, checks how many path segments URL contains, checks if the first segment is api
// checks if v1 is the second segment and checks if info is the third (parts[0], parts[1], etc.)
// eventually gets $method ="get" and $parts=["api", "v1", "info"];
// After the if statement it returns the data as JSON and stops
//if ($method=="get" && sizeof($parts) == 3 && $parts[0] == "api" && $parts[1] == "v1" && $parts[2] == "info") {

if ($method=="get" && sizeof($parts) == 1 && $parts[0] == "color") {
        $color = $redis->get("goochcj-mycolors");
        $return = array("status"=>"OK","errorMsg"=>"","color"=>($color));
        returnJSON(200,"OK",$return);

        exit;
}

else if ($method=="post" && sizeof($parts) == 2 && $parts[0] == "color") {
        if ($parts[1] == "RED" || $parts[1] == "GREEN" || $parts[1] == "ORANGE"
                || $parts[1] == "BLUE" || $parts[1] == "BLACK" || $parts[1] == "WHITE" ||
                        $parts[1] == "PURPLE" || $parts[1] == "GOLD") {
                $redis->set("goochcj-mycolors", $parts[1]);
                $return = array("status"=>"OK", "errorMsg"=>"");
                returnJSON(200,"OK",$return);
                exit;
        } else {
                $return = array("status"=>"FAIL", "errorMsg"=>"Invalid color");
                returnJSON(200,"OK",$return);
                exit;
        }
}

if ($method=="get" && sizeof($parts) == 1 && $parts[0] == "book") {
        $books = $redis->get("goochcj-books");
        if($books === false) { // checks whether books is empty or not
                $bookArray = array(); // creates new book array
        } else {
                $bookArray = json_decode($books); // holds all book in bookArray
        } if ($bookArray === null) { // now checks if the array is valid, if it is it returns it, but if not error message is returned
                $return = array("status"=>"FAIL","errMsg"=>"bad data");
                returnJSON(200,"OK",$return);
        } else {
                $return = array("status"=>"OK","errMsg"=>"","books"=>($bookArray));
                returnJSON(200,"OK",$return);
        }

        exit;
}


else if ($method=="post" && sizeof($parts) == 1 && $parts[0] == "book") {
        $content = file_get_contents('php://input'); // gets array content and decodes it to data
        $data = json_decode($content);
        if ($data != null) {
                if (!isset($data->title) || !isset($data->author) || !isset($data->ISBN)) { // Checks to make sure all variables are valid
                        $return = array("status"=>"FAIL","errMsg"=>"Missing Book Info");
                        returnJSON(200,"OK",$return);
                        exit;
                } else { // if all of the data is valid we need to check if the data only contains letters
                        $valid = true;
                        $validLetters ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                        $length = strlen($data->title); // Grabs the length of the title

                        if ($length === 0) {
                                $return = array("status"=>"FAIL","errMsg"=>"Title is not valid");
                                returnJSON(200,"OK",$return);
                                exit;
                        }

                        for ($i = 0; $i < $length; $i++) { // Loops through the title and compares every letter to make sure it is in validLetters, if not valid = false
                                $letter = $data->title[$i];
                                if (strstr($validLetters, $letter) === false) {
                                        $valid = false;
                                }
                        }

                        if ($valid === true) { // The final check is to make sure that the book is not already in the array. To do this we use in_array
                                $books = $redis->get("goochcj-books"); // gets the complete array from goochcj-books
                                if ($books === false) { // if array is empty, make a new empty array
                                        $bookArray = array();
                                } else { // if array is not empty decode the data and put it into bookArray
                                        $bookArray = json_decode($books);
                                }

                                if ($bookArray === null) { // check if our new bookArray is null, if it is return error
                                        $return = array("status"=>"FAIL","errMsg"=>"Bad data");
                                        returnJSON(200,"OK",$return);
                                        exit;
                                }

                                if(in_array($data->title, $bookArray) === true) { // if this is true then we return book is already in array
                                        $return = array("status"=>"FAIL","errMsg"=>"Book is already in the array");
                                        returnJSON(200,"OK",$return);
                                        exit;
                                } else { // All checks are complete we just need to add book into the array and set our new redis
                                        $details = $redis->get("goochcj-book-details"); // We need to make a new redis so we can also add the book ISBN
                                        if ($details === false) {
                                                $bookDetails = array();
                                        } else {
                                                $bookDetails = json_decode($details);
                                        }

                                        if ($bookDetails === null) {
                                                $return = array("status"=>"FAIL", "errMsg"=>"Bad book detail");
                                                returnJSON(200,"OK",$return);
                                                exit;
                                        }

                                        $bookArray[] = $data->title; // adds the title to the book array

                                        $bookDetails[] = array("title"=>$data->title,"author"=>$data->author,"ISBN"=>$data->ISBN); // complete the bookDetail array with all existing information + book ISBN
                                        $redis->set("goochcj-books", json_encode($bookArray)); // sets both redis
                                        $redis->set("goochcj-book-details", json_encode($bookDetails));
                                        $return = array("status"=>"OK","errMsg"=>"");
                                        returnJSON(200,"OK",$return);
                                        exit;
                                }
                        } else {
                                $return = array("status"=>"FAIL","errMsg"=>"Title is not valid");
                                returnJSON(200,"OK",$return);
                                exit;
                        }
                }
        } else { // If the data at the start is null, return error message
                $return = array("status"=>"FAIL", "errMsg"=>"Data is not valid");
                returnJSON(200,"OK",$return);
                exit;
        }
}


else if ($method=="delete" && sizeof($parts) == 2 && $parts[0] == "book") {
        $bookNumber = $parts[1]; // this gets our ISBN number

        $book = $redis->get("goochcj-books"); // grabs book info
        $details =  $redis->get("goochcj-book-details"); // grabs book ISBN

        if ($book === false || $details === false) {
                $return = array("status"=>"FAIL","errMsg"=>"Book is not in array");
                returnJSON(200,"OK",$return);
                exit;
        }

        $bookArray = json_decode($book); // decodes json and puts it into variables
        $bookDetails = json_decode($details);

        if ($bookArray === null || $bookDetails === null) { // checks if data is null or not
                $return = array("status"=>"FAIL","errMsg"=>"Data is invalid");
                returnJSON(200,"OK",$return);
                exit;
        }

        $bookInArray = false; // Set up helper variables that will be used later in this function
        $bookTitle = "";
        $newDetails = array();

        for ($i = 0; $i < count($bookDetails); $i++) { // loop through the length of bookDetails to determine if the ISBN number is in our array
                $book = $bookDetails[$i];
                if ($book->ISBN == $bookNumber) { // ISBN number is in the array, set $title and newDetails to the book with the found ISBN number
                        $bookInArray = true;
                        $bookTitle = $book->title;
                } else {
                        $newDetails[] = $book; // book that does not contain our ISBN is added to array
                }
        }
        if ($bookInArray === false) { // if ISBN in not in our array, return an error message
                $return = array("status"=>"FAIL","errMsg"=>"Book is not in the array");
                returnJSON(200,"OK",$return);
                exit;
        }

        $newBookArray = array(); // Create a new array that will hold all books besides the one we want to delete

        for ($j = 0; $j < count($bookArray); $j++) { // loop through book array and add the books that we do not want to delete
                $title = $bookArray[$j];
                if ($title != $bookTitle) {
                        $newBookArray[] = $title;
                }
        }

        // update values
        $redis->set("goochcj-books", json_encode($newBookArray));
        $redis->set("goochcj-book-details", json_encode($newDetails));

        $return = array("status"=>"OK","errMsg"=>"");
        returnJSON(200,"OK",$return);
        exit;
}

if ($method=="get" && sizeof($parts) == 1 && $parts[0] == "random") {
        $range = $redis->get("goochcj-numRange"); // gets set range

        if ($range === false) { // if range is not set up use range 10
                $range = 10;
        } else {
                $range = (int)$range; // convert range from string to int
        }

        $seed = $redis->get("goochcj-seed"); // get the seed
        if ($seed !== false) { // if seed is not set, set it.
             srand((int)$seed); // srand makes sure the seed remains unchanged even after making another call
        }

        $random = (string)rand(1,9); // generates a random number from 1-9 and converts it to a string
        for ($i = 1; $i < $range; $i++) { // randomly generates a pair of 10 digits 0-9
                $random = $random . rand(0,9);
        }

        $return = array("status"=>"OK","range"=>$range,"random"=>$random);
        returnJSON(200,"OK",$return);
        exit;
}


else if ($method=="put" && sizeof($parts) == 1 && $parts[0] == "random") {
        $content = file_get_contents('php://input');  // gets and decodes the content
        $data = json_decode($content);

        if ($data !== null || isset($data->range)) { // if data does not equal null and is not empty check the range
                if ($data->range <= 10 || $data->range >= 500) { // if data is outside of range return error
                        $return = array("status"=>"FAIL","errMsg"=>"Invalid range");
                        returnJSON(200,"OK",$return);
                        exit;
                } else { // data looks good set redis and return OK
                        $redis->set("goochcj-numRange", $data->range);
                        $return = array("status"=>"OK","errMsg"=>"");
                        returnJSON(200,"OK",$return);
                        exit;
                }
        } else { // data is null return error
                $return = array("status"=>"FAIL","errMsg"=>"Invalid data");
                returnJSON(200,"OK",$return);
                exit;
        }
}

else if ($method=="post" && sizeof($parts) == 2 && $parts[0] == "random") {
        $seed = $parts[1]; // gets the seed

        if ($seed !== null && $seed !== "") { // if seed does not equal null and is not empty set the seed
                $redis->set("goochcj-seed", $seed);
                $return = array("status"=>"OK","errMsg"=>"");
                returnJSON(200,"OK",$return);
                exit;
        } else { // seed is empty or null return error message
                $return = array("status"=>"FAIL","errMsg"=>"Invalid data");
                returnJSON(200,"OK",$return);
                exit;
        }
}

?>
