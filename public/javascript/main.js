const inputBoxID = "message";
const outPutBoxId = "output";
const keywordId = "keywordValue";

//Enum Value for each Cipher
const Cipher = {
    NORMAL: 'Normal',
    ROT13: 'ROT13',
    VIGENERE: 'Vigenère'
};

//Current active cipher | default = Rot13
var selectedCipher = Cipher.ROT13;
var keywordNeeded = false;

function selectCipher(cipher){
    selectedCipher = cipher;
    console.log("New cipher has been select " + cipher);
    updatePage();
}

function updatePage() {

    document.getElementById("selectCipher").innerHTML = selectedCipher;

    var keyword = document.getElementById("keywordBox");
    var div = document.getElementById("dropdown");
    div.innerHTML = "";

    var rot13 = document.createElement("a");
    var vigenere = document.createElement("a");
    var normal = document.createElement("a");
    var showKeyword = false;

    rot13.innerHTML = Cipher.ROT13;
    vigenere.innerHTML = Cipher.VIGENERE;
    normal.innerHTML = Cipher.NORMAL;

    if (selectedCipher == Cipher.ROT13) {
        rot13.getAttribute.className = "active";
        keywordNeeded = false;
    } else if (selectedCipher == Cipher.VIGENERE) {
        vigenere.getAttribute.className = "active";
        keywordNeeded = true;
    } else if (selectCipher == Cipher.NORMAL) {
        normal.getAttribute.className = "active";
    }


    if (keyword) {
        if (keywordNeeded) {
            keyword.style.display = "block";
        } else {
            keyword.style.display = "none";
        }
    } else {
        keywordNeeded = false;
    }

    rot13.addEventListener("click", function() {
        selectCipher(Cipher.ROT13);
    });

    vigenere.addEventListener("click", function() {
        selectCipher(Cipher.VIGENERE);
    });

    div.appendChild(rot13);
    div.appendChild(vigenere);

}

function encode() {
    var message = document.getElementById(inputBoxID).value.toUpperCase();
    var returnMessage = encodeMessage(message);

    document.getElementById(outPutBoxId).value = returnMessage;
}

function encodeMessage(message) {
    var returnMessage = "";
    var key;

    if (keywordNeeded) {
        if (document.getElementById(keywordId).value.length == 0) {
            document.getElementById(outPutBoxId).value = "Insert a key to encode!";
            return;
        }

        key = filterKey(document.getElementById(keywordId).value.toUpperCase());
        console.log(key);
    }

    switch(selectedCipher) {
        case Cipher.ROT13:
            returnMessage = rot13(message.toLowerCase());
            break;
        case Cipher.VIGENERE:
            returnMessage = vigenere(message, key);
            break;
        case Cipher.NORMAL:
            returnMessage = message;
        default: returnMessage = "Error Occured!";
    }
    return returnMessage;
}

function decode() {

    var message = document.getElementById(outPutBoxId).value.toUpperCase();
    var returnMessage = "";

    if (keywordNeeded) {
        if (document.getElementById(keywordId).value.length == 0) {
            document.getElementById(outPutBoxId).value = "Insert a key to encode!";
            return;
        }

        key = filterKey(document.getElementById(keywordId).value.toUpperCase());
        console.log(key);
    }

    switch(selectedCipher) {
        case Cipher.ROT13:
            returnMessage = rot13(message.toLowerCase());
            break;
        case Cipher.VIGENERE:
            returnMessage = vigenere(message, key);
            break;
        default: message = "Error Occured!";
    }

    document.getElementById(inputBoxID).value = returnMessage;
}

function deVigenere(text, key) {
    console.log("starting decoding... " + text + " with key " + key);
    var output = [];

    for (var i = 0; i < key.length; i++)
        key[i] = (26 - key[i]) % 26;

    for (var i = 0, j = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if (65 <= c && c <= 90) {
            var charID = (c - 65 + key[j % key.length]) % 26 + 65;
            var newChar = String.fromCharCode(charID);

            console.log("Char id: " + charID);
            console.log("New Char: " + newChar);
            output.push(newChar);
            j++;
        } else {
            output.push(text.charAt(i));
        }
        console.log(output);
    }
    return output.join("");
}

function vigenere(text, key) {
    console.log("starting encoding... " + text + " with key " + key);
    var output = [];

    for (var i = 0, j = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if (65 <= c && c <= 90) {
            var charID = (c - 65 + key[j % key.length]) % 26 + 65;
            var newChar = String.fromCharCode(charID);

            console.log("Char id: " + charID);
            console.log("New Char: " + newChar);
            output.push(newChar);
            j++;
        } else {
            output.push(text.charAt(i));
        }
        console.log(output);
    }

    return output.join("");
}

function filterKey(key) {
	var result = [];
	for (var i = 0; i < key.length; i++) {
		var c = key.charCodeAt(i);
		if (65 <= c && c <= 90) result.push((c - 65) % 32);
	}
	return result;
}

function rot13(text) {
     var cypher_text = [];
     var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

     for (var idx = 0; idx < text.length; idx++) {
        input = alphabet.indexOf(text[idx]);

        if(input == -1) {
            cypher_text.push(text[idx]);
        } else {
            var coded = (input +13)%26;
            var letter = alphabet[coded];
            cypher_text.push(letter);
        }
     }
    return cypher_text.join("");
}

function signup() {

    var name = document.getElementById("name").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;


    post('/signup', {name: name, username:username, password:password });

}

function login() {
    var username = document.getElementById("login-user").value;
    var password = document.getElementById("login-pass").value;

    post('/login', {username:username, password:password });
}

function createChatRoom() {
    var chatName = document.getElementById("message").value;
    post('/conversations/create', {name:chatName});
}

function buildChat() {
  var pathArray = window.location.pathname.split('/');
  var name = pathArray[2];

  getAjax('/conversations/messages/' + name, data => {

      var parent = document.getElementById('messenger');



      for (var i of data){
        var chatDiv = document.createElement('div');
        var chatP = document.createElement('p');
        var chatSpan = document.createElement('span');

        chatDiv.getAttribute.className = "message";
        chatSpan.getAttribute.className = "time-right";

        var message = data[i].content;
        var sender = data[i].sender;

        chatP.innerHTML = message;
        chatSpan.innerHTML = sender;

        chatDiv.appendChild(chatP);
        chatDiv.appendChild(chatSpan);

        parent.appendChild(chatDiv);
      }

  });
}

function buildAccount() {
  var pathArray = window.location.pathname.split('/');
  var name = pathArray[2];

  getAjax('/conversations/messages/' + name, data => {

      var parent = document.getElementById('convo');

      for (var i of data){

        var chatDiv = document.createElement('li');
        var chatP = document.createElement('h1');
        var chatSpan = document.createElement('p');

        chatDiv.getAttribute.className = "convobox";

        var message = data[i].name;
        var sender = data[i].participants.size();

        chatP.innerHTML = message;
        chatSpan.innerHTML = sender;

        chatDiv.appendChild(chatP);
        chatDiv.appendChild(chatSpan);

        chatDiv.addEventListener("click", function() {
          window.location.href = window.location.hostname + "/conversations/" + message;
        });

        parent.appendChild(chatDiv);
      }

  });
}

function post(path, params, method='post') {
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }
  document.body.appendChild(form);
  console.log(form);
  form.submit();
}

function getAjax(url, success) {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
      if (xhr.readyState>3 && xhr.status==200) success(xhr.responseText);
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.send();
  return xhr;
}

function postAjax(url, data, success) {
  var params = typeof data == 'string' ? data : Object.keys(data).map(
          function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
      ).join('&');

  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open('POST', url);
  xhr.onreadystatechange = function() {
      if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(params);
  return xhr;
}

function getUserData(username) {
    var userData = getAjax(window.location.hostname + "/account/" + username);
    return JSON.parse(userData);
}

function getConversation(id) {
    var userData = getAjax(window.location.hostname + "/account/" + username);
    return JSON.parse(userData);
}
