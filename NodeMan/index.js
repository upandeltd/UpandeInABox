function addField() {
    var form = document.getElementById("flex-a");
    var fieldName = document.getElementById("field-name").value;
    if (fieldName.length <= 4) {
        alert('Field Name Must be atleast 5 characters long')
    } else {
        var newfield = document.createElement("input");
        newfield.setAttribute("type", "text");
        newfield.setAttribute("name", fieldName);
        newfield.setAttribute("placeholder", fieldName);
        newfield.setAttribute("required", true);
        form.appendChild(newfield)
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let nodes = [];
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
           if ((this.responseText).length > 20) {
                nodes = JSON.parse(xhr.responseText)
                console.log("NODE:: ",nodes);
           }
        }
    };
    console.log('Loaded');
    xhr.open("GET", "/getnodes", true);
    xhr.send();
    var form = document.getElementById("form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        document.getElementById("save-btn").setAttribute('disabled',true)
        var dev = toJSONString(this);
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                location.reload()
            }
        };
        xhr.open("POST", "/postnode", true);
        let nodePresent = false;
        nodes.forEach(element=>{
            if ((element.DevAddr).toLowerCase() == dev.DevAddr.toLowerCase()) {
                nodePresent = true
            }
        })

        if (!nodePresent) {
            nodes.push(dev)
            xhr.send(JSON.stringify(nodes));
            document.getElementById("save-btn").setAttribute('disabled',false)   
        }else{
            alert("Node Already Exist")
            xhr.send(JSON.stringify(nodes));
        }
    }, false);

});


var navList = document.getElementById("nav-lists");
function Show() {
    navList.classList.add("_Menus-show");
}

function Hide() {
    navList.classList.remove("_Menus-show");
}

function toJSONString(form) {
    var obj = {};
    var elements = form.querySelectorAll("input, select, textarea");
    for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        var name = element.name;
        var value = element.value;

        if (name) {
            obj[name] = value;
        }
    }

    return obj;
}