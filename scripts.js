var request_url = "https://api.imgur.com/3/gallery/search/?q=cats";
const client_id = "b067d5cb828ec5a";

// Imgur authorization to begin pulling from API
function requestAlbum() {
  var req = new XMLHttpRequest();

  req.onreadystatechange = function (e) {
    if (req.readyState == 4 && req.status == 200) {
      processRequest(req.responseText);
    } else {
      console.log("Error with Imgur Request.");
    }
  };

  req.open("GET", request_url, true); // true for asynchronous
  req.setRequestHeader("Authorization", "Client-ID " + client_id);
  req.send(null);
}

function processRequest(response_text) {
  if (response_text == "Not found") {
    console.log("Imgur album not found.");
  } else {
    var node = document.getElementById("parent");
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    var json = JSON.parse(response_text);

    for (const value of json.data) {
      if (value.images && value.images[0].link.split(".").pop() !== "mp4") {
        const card = document.createElement("div");
        card.setAttribute("class", "card");
        const h1 = document.createElement("h1");
        h1.textContent = value.title;
        card.appendChild(h1);

        for (const image of value.images) {
          const imgurImg = document.createElement("img");
          imgurImg.setAttribute("class", "imgurImg");
          imgurImg.src = image.link;

          var modal = document.getElementById("myModal");
          var modalImg = document.getElementById("focusedImage");
          var span = document.getElementsByClassName("close")[0];
          imgurImg.onclick = function () {
            modal.style.display = "block";
            modalImg.src = this.src;
          };
          modal.onclick = function () {
            modal.style.display = "none";
          };
          span.onclick = function () {
            modal.style.display = "none";
          };
          card.appendChild(imgurImg);
        }
        var container = document.getElementById("parent");
        container.appendChild(card);
      }
    }
  }
}

function myFunction() {
  var x = document.getElementById("myText").value;
  request_url = "https://api.imgur.com/3/gallery/search/top/?q=" + x;
  requestAlbum();
}

function closingFunc() {
  modal.style.display = "none";
}

var input = document.getElementById("myText");

input.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("myBtn").click();
  }
});
