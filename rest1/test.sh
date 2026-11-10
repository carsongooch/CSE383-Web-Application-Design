#!/bin/bash

curl -sS https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/color

curl -sS -X POST https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/color/GREEN

curl -sS -X POST https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/color/RED1234

curl -sS https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/book

curl -sS -X POST -H "Content-Type: application/json" -d '{"title":"book","author":"Bob Ross", "ISBN":"123435345"}'  https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/book

curl -sS -X POST -H "Content-Type: application/json" -d '{"title":"book","author":"Bob Ross", "ISBN":"123435345"}'  https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/book

curl -sS -X POST -H "Content-Type: application/json" -d '{"title":"","author":"Bob Ross", "ISBN":"123435345"}'  https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/book

curl -sS -X POST -H "Content-Type: application/json" -d '{"title":"*@*#---","author":"Bob Ross", "ISBN":"123435345"}' https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/book

curl -sS -X DELETE https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/book/123435345

curl -sS https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/book

curl -sS -X PUT -H "Content-Type: application/json" -d '{"range":15}'  https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/random

curl -sS -X PUT -H "Content-Type: application/json" -d '{}'  https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/random

curl -sS -X PUT -H "Content-Type: application/json" -d '{"range":0}'  https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/random

curl -sS -X PUT -H "Content-Type: application/json" -d '{"range":500}'  https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/random

curl -sS -X PUT -H "Content-Type: application/json" -d '{"range":"When life gives you lemons you dont eat them because wow they are sour"}'  https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/random

curl -sS https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/random

curl -sS -X POST https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/random/45632

curl -sS -X POST https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/random/

curl -sS -X POST https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/random/incaseIdontseeyagoodafternoongoodeveningandgoodnight

curl -sS https://ceclnx01.cec.miamioh.edu/~goochcj/cse383/cse383_W2/rest1/rest.php/random
