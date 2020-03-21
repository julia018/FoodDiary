//var modal = document.querySelector(".modal");
var modal = document.getElementById('myModal');
console.log(modal === null)

function showBreakfastForm() {
    //alert("Br form"); 
    console.log("Toogle");    
    modal.style.display = "block";
    //modal.classList.add('visible')
    console.log("Toogle");  
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none"
}


async function addBreakfast() {
  var weight = document.getElementById('weight').value
  console.log(weight)  
  await fetch('/addBreakfast', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body : JSON.stringify({weight: weight})
            }).catch(err => alert("error"))
            
    /*var xhr = new XMLHttpRequest();
    var url = "/addBreakfast";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        console.log(json.email + ", " + json.password);
    }
    };
    
    let breakfast = {weight: weight}
    var data = JSON.stringify(breakfast);
    xhr.send(data);*/
    //alert("Breakfast +");

}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }


