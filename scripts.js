// Wesley Kok

var requestURL = "https://api.imgur.com/3/gallery/search/?q=cats";
const clientID = "b067d5cb828ec5a";

// Imgur authorization to begin pulling from API
function requestGallery() {
  var req = new XMLHttpRequest();

  req.onreadystatechange = function (e) {
    if (req.readyState == 4 && req.status == 200) {
      processRequest(req.responseText);
    } else {
      console.log("Error with Imgur Request.");
    }
  };

  req.open("GET", requestURL, true); // true for asynchronous
  req.setRequestHeader("Authorization", "Client-ID " + clientID);
  req.send(null);
}

function processRequest(response) {
  if (response == "Not found") {
    console.log("Imgur gallery not found.");
  } else {
    // Remove all the previous images
    var node = document.getElementById("parent");
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    var json = JSON.parse(response);
    console.log(json);

    var tagsDict = {};
    for (const dataArray of json.data) {
      const tagsArray = dataArray.tags;
      if (tagsArray) {
        for (const tagObject of tagsArray) {
          const name = tagObject.name;
          console.log(name);

          if (name in tagsDict) {
            tagsDict[name] += 1;
          } else {
            tagsDict[name] = 1;
          }
        }
        console.log(tagsDict);
      }

      // Only care about the images
      const imagesArray = dataArray.images;

      // Exclude videos
      if (imagesArray && imagesArray[0].link.split(".").pop() !== "mp4") {
        // Make a card to store each post's title and images
        const card = document.createElement("div");
        card.setAttribute("class", "card");

        const h1 = document.createElement("h1");
        const titleText = dataArray.title;

        // Cut off the title if it's excessively long
        if (titleText.length > 100) {
          h1.textContent = `${titleText.substring(0, 100)}...`;
        } else {
          h1.textContent = titleText;
        }
        card.appendChild(h1);

        // Entries used to round off the last image in each card
        for (const [i, image] of imagesArray.entries()) {
          const imgurImg = document.createElement("img");
          if (i == imagesArray.length - 1) {
            imgurImg.setAttribute("class", "imgurImgLast");
          } else {
            imgurImg.setAttribute("class", "imgurImg");
          }
          imgurImg.src = image.link;

          // Create modal box for each image
          var modal = document.getElementById("myModal");
          var modalImg = document.getElementById("modalImg");

          imgurImg.onclick = function () {
            modal.style.display = "block";
            modalImg.src = this.src;
          };

          modal.onclick = function () {
            modal.style.display = "none";
          };

          card.appendChild(imgurImg);
        }
        var container = document.getElementById("parent");
        container.appendChild(card);
      }
    }
    for (const [tag, counter] of Object.entries(tagsDict).sort(function (a, b) {
      return b[1] - a[1];
    })) {
      console.log(counter);
      const tagsParent = document.getElementById("tagsParent");

      const tagCard = document.createElement("div");
      tagCard.setAttribute("class", "tagCard");
      tagCard.textContent = tag + " " + counter;
      tagsParent.appendChild(tagCard);
    }
  }
}

// Modify the request url and send the request
function search() {
  var searchInput = document.getElementById("myText").value;
  requestURL = "https://api.imgur.com/3/gallery/search/top/?q=" + searchInput;
  requestGallery();
}

// Adding ENTER key functionality for the search bar
var input = document.getElementById("myText");
input.addEventListener("keyup", function (event) {
  // 13 == ENTER key
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    document.getElementById("myBtn").click();
  }
});
