import verificationKey from "./approve.js";

// create verification form
function verificationForm(){
    const formHeading = document.createElement("p");
    formHeading.textContent = "Verify your self";
    formHeading.setAttribute("class", "form-header");
    const input = document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("id","verification");
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Verify";
    submitBtn.setAttribute("class", "submit");
    submitBtn.setAttribute("type", "submit");
 
    return [formHeading,input,submitBtn];
    
}
document.getElementById("todo-link").onclick = verificationInput;

function verificationInput(event) {
    event.preventDefault();
    const opacityBg = document.createElement("div");
    opacityBg.setAttribute("id","bg-opacity");
    opacityBg.setAttribute("class","opacity-bg");

    const form = document.createElement("form");
    form.setAttribute("id","form");
    form.onsubmit = verifiedFunction;
    form.append(...verificationForm());
    const main = document.getElementById("main")
    main.append(opacityBg,form);
    opacityBg.onclick = removeFormAndBg; 
}

async function removeFormAndBg() {
    document.getElementById("form").remove();
    document.getElementById("bg-opacity").remove();
}



async function verifiedFunction(event){
    event.preventDefault();
    
   
    const passCodeValue = document.getElementById("verification");
    const form = document.getElementById("form");
    
    if(passCodeValue.value == verificationKey){
       form.innerHTML = addProjectForm();
       document.getElementById("bg-opacity").onclick = removeFormAndBg;
    }else{
        form.style.animation = "shakeForm 1.2s linear";
        document.getElementById("verification").style.animation = "inputColorShake 1.2s linear";
        document.querySelector(".submit").style.animation = "btnBgColor 1.2s linear";
    }

}

function addProjectForm(){
    const projectFormData = `<p class="form-header">Add project Todo</p>
    <label for="project-type">Enter project type</label>
    <input type="text" id="project-type">
    <label for="project-title">Enter project title</label>
    <input type="text" id="project-title" >
    <label for="project-type">Describe the project</label>
    <textarea name="" id="project-description" cols="30" rows="10"></textarea>
    <button type="submit" class="submit" onClick="postNewProject()">Add project</button>`
    return projectFormData;
}


function postNewProject(url){
   const addProject = {
        type: document.getElementById("project-type").value,
        title:document.getElementById("project-title").value,
        description:document.getElementById("project-description").value
   };
   
   console.log(addProject);

}