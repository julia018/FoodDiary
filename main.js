document.getElementById('try').addEventListener('click', postData);

 function postData(event){
     console.log("POSTING");
            event.preventDefault();

            //let tittle = document.getElementById('tittle').value;
            let title = "test";
            //let body = document.getElementById('body').value;

            fetch('https://localhost:3000/posts', {
                method: 'POST',
                headers : new Headers(),
                body:JSON.stringify({tittle:tittle})
            }).then((res) => res.json())
            .then((data) =>  console.log(data))
            .catch((err)=>console.log(err))
        }