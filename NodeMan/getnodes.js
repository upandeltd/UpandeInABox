let json = [
    {
        "DevAddr": "HELLO",
        "Token": "WORLD",
        "DevType": "OMMM",
        "Encoding": "HELLOO"
    },
    {
        "DevAddr": "HELLO",
        "Token": "WORLD",
        "DevType": "OMMM",
        "Encoding": "HELLOO"
    },
    {
        "DevAddr": "HELLO",
        "Token": "WORLD",
        "DevType": "OMMM",
        "Encoding": "HELLOO"
    },
    {
        "DevAddr": "HELLO",
        "Token": "WORLD",
        "DevType": "OMMM",
        "Encoding": "HELLOO"
    },
    {
        "DevAddr": "HELLO",
        "Token": "WORLD",
        "DevType": "OMMM",
        "Encoding": "HELLOO"
    },
    {
        "DevAddr": "HELLO",
        "Token": "WORLD",
        "DevType": "OMMM",
        "Encoding": "HELLOO"
    },
    {
        "DevAddr": "HELLO",
        "Token": "WORLD",
        "DevType": "OMMM",
        "Encoding": "HELLOO"
    },
    {
        "DevAddr": "HELLO",
        "Token": "WORLD",
        "DevType": "OMMM",
        "Encoding": "HELLOO"
    },
    {
        "DevAddr": "HELLO",
        "Token": "WORLD",
        "DevType": "OMMM",
        "Encoding": "HELLOO"
    },
    {
        "DevAddr": "HELLO",
        "Token": "WORLD",
        "DevType": "OMMM",
        "Encoding": "HELLOO"
    },
    {
        "DevAddr": "HELLO",
        "Token": "WORLD",
        "DevType": "OMMM",
        "Encoding": "HELLOO"
    }
]

let cardList = document.getElementById("flex-a")
function addNodeProp(data) {
    data = JSON.parse(data)
    data.forEach(element => {
        let card = document.createElement('div')
        card.setAttribute('class', 'card')

        for (const [key, value] of Object.entries(element)) {
            let p = document.createElement('p')
            p.innerText = `${key}: ${value}`
            card.appendChild(p)
            console.log(key, value);
        }

        let delBtnHtml = `<button onClick=deleteNode("${element.DevAddr}") id="cancel-btn">Delete</button>`
        card.insertAdjacentHTML('beforeend', delBtnHtml)
        cardList.appendChild(card)
    });
}

function deleteNode(Addr) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if ((this.responseText).length > 20) {
                let nodes = [];
                nodes = JSON.parse(xhr.responseText)
                nodes.forEach(element => {
                    console.log("NODE1:: ", element);
                })
                nodes.forEach(element => {
                    if ((element.DevAddr).toLowerCase() == Addr.toLowerCase()) {
                        console.log("NODEDEL ", element);
                        nodes.pop(element)
                    }
                })
                nodes.forEach(element => {
                    console.log("NODE2:: ", element);
                })

                if (nodes != null || nodes != undefined) {
                    let xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            console.log(this.responseText);
                        }
                    };
                    xhr.open("POST", "/postnode", true);
                    xhr.send(JSON.stringify(nodes));
                    location.reload()
                } else {
                    console.log('Node Undef');
                }
            } else {
                console.log("Nothing to Do here");
            }
        }
    };
    xhr.open("GET", "/getnodes", true);
    xhr.send();
}


document.addEventListener("DOMContentLoaded", function () {

    let xhttp = new XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            addNodeProp(xhr.responseText)
        }
    };
    xhr.open("GET", "/getnodes", true);
    xhr.send();
    document.body.addEventListener('click', (e) => {
        if (e.target && e.target.class === 'del') {
            let addr = e.target.data - devAddr
            let newNodes = deleteDev(addr)
            updateNode(newNodes);
            location.reload()
        }
    })
}, false);

var navList = document.getElementById("nav-lists");
function Show() {
    navList.classList.add("_Menus-show");
}

function Hide() {
    navList.classList.remove("_Menus-show");
}

