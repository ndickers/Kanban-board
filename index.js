import verificationKey from "./approve.js";

window.addEventListener("DOMContentLoaded", fetchDataOnLoad);

async function fetchDataOnLoad() {
  // load data in todosection
  const todoProgressUrl = {
    url1:"https://64b6b8aadf0839c97e16081a.mockapi.io/todo",
    url2:"https://64de658a825d19d9bfb28fd2.mockapi.io/prog-proje/progressection"
  };
    
  const todoSection = document.querySelector("#todo-section");
  await loadApiData(todoProgressUrl.url1, todoSection);
  // get articles in todo section
  const getTodoSectionArticles = document.querySelectorAll(
    "#todo-section article"
  );
  dragStart(getTodoSectionArticles);
  // deleting article
  const deleteTodos = document.querySelectorAll("#todo-section button");
  await deleteArticle(deleteTodos,todoProgressUrl.url1);

  // ----------------------------------------
  // load data in in progress section
  
  const progressSec = document.querySelector("#in-progress-section");
  await loadApiData(todoProgressUrl.url2, progressSec);
  await dropToTarget(progressSec,todoProgressUrl);
  const deleteProgress = document.querySelectorAll("#in-progress-section .delete-btn");
  await deleteArticle(deleteProgress,todoProgressUrl.url2);
}

async function loadApiData(url, sectionToAddArticle) {
  const dataContent = await getDataFromApi(url);
  dataContent.forEach((data) => {
    const newArticle = createArticle(data);
    sectionToAddArticle.appendChild(newArticle);
  });
}

// display verification form on clicking each header link
const addProjectBtn = document.querySelector(".add-btn");
addProjectBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const form = document.createElement("form");
  form.setAttribute("id", "form");
  form.innerHTML = verificationForm();
  const opacityBg = opaqueBg();
  main.append(opacityBg, form);
  form.addEventListener("submit", preventSubmission);
  opacityBg.addEventListener("click", removeFormAndBg);
  const verifyBtn = document.querySelector("#verify");
  verifyBtn.addEventListener("click", function () {
    displayInputProjectForm(addProjectBtn, form);
  });
});

function displayInputProjectForm(elem, formSection) {
  const verifyCode = document.querySelector("#verification").value;
  // check if user is verify
  if (verifyCode == verificationKey) {
    // if veify display form depending on the link clicked
    formSection.innerHTML = addProjectFormContent();
    document
      .getElementById("submit-project")
      .addEventListener("click", addProject);
  } else {
    form.style.animation = "shakeForm 1.2s linear";
    document.getElementById("verification").style.animation =
      "inputColorShake 1.2s linear";
    document.querySelector(".submit").style.animation =
      "btnBgColor 1.2s linear";
  }
}

function preventSubmission(e) {
  e.preventDefault();
}

// create verification form
function verificationForm() {
  const verificationFormContent = `<p class="form-header">Verify yourself</p>
  <input id="verification" type="text">
  <button id="verify" class="submit">Verify</button>`;

  return verificationFormContent;
}


function opaqueBg() {
  const opacityBg = document.createElement("div");
  opacityBg.setAttribute("id", "bg-opacity");
  opacityBg.setAttribute("class", "opacity-bg");
  return opacityBg;
}


function removeFormAndBg() {
  document.getElementById("form").remove();
  document.getElementById("bg-opacity").remove();
}

// function verifiedFunction(event) {
//   event.preventDefault();
//   const passCodeValue = document.getElementById("verification");
//   const form = document.getElementById("form");

//   if (passCodeValue.value == verificationKey) {
//     passCodeValue.remove();
//     form.innerHTML = addProjectForm("form-header");
//     const opacityBg = document.getElementById("bg-opacity");
//     opacityBg.addEventListener("click", removeFormAndBg);
//     document.querySelector(".submit").addEventListener("click", addProject);
//   } else {
//     form.style.animation = "shakeForm 1.2s linear";
//     document.getElementById("verification").style.animation =
//       "inputColorShake 1.2s linear";
//     document.querySelector(".submit").style.animation =
//       "btnBgColor 1.2s linear";
//   }
// }

function addProjectFormContent() {
  const projectFormData = `<p class="form-header">Add project Todo</p>
    <label for="project-type">Enter project type</label>
    <input type="text" id="project-type">
    <label for="project-title">Enter project title</label>
    <input type="text" id="project-title" >
    <label for="project-type">Describe the project</label>
    <textarea name="" id="project-description" cols="30" rows="10"></textarea>
    <button type="submit" id="submit-project" class="submit" >Add project</button>`;
  return projectFormData;
}

function addProject() {
  const addProject = {
    type: document.getElementById("project-type").value,
    title: document.getElementById("project-title").value,
    description: document.getElementById("project-description").value,
  };
  const todoSection = document.getElementById("todo-section");
  postDataToApi(
    "https://64b6b8aadf0839c97e16081a.mockapi.io/todo",
    addProject,
    todoSection
  );
}

function postDataToApi(url, projectToPost, elementToAppend) {
  const requestObj = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(projectToPost),
  };
  fetch(url, requestObj).then((res) => {
    console.log(res);
    if (res.statusText == "Created") {
      res.json().then((data) => {
        elementToAppend.appendChild(createArticle(data));
      });
    } else {
      errorHandling("Error connecting with server. Try again later");
    }
  });
}

function getDataFromApi(url) {
  return fetch(url, {
    method: "GET",
    headers: { "content-type": "application/json" },
  }).then((res) => {
    if (res.statusText == "OK") {
      return res.json().then((data) => data);
    } else {
      errorHandling("404 Error: Data can't be reached. Try again later");
    }
  });
}

// get data from api and return a promise
// function getDataFromApi(url) {
//   return fetch(url)
//     .then((res) => {
//       console.log(res);
//       return res;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

function createArticle(project) {
  const article = document.createElement("article");
  article.setAttribute("id", `article-${project.id}`);
  article.setAttribute("draggable", "true");
  const articleContent = `<p class="project-type">${project.type}</p>
    <h2 class="project-title">${project.title}</h2>
    <p class="project-content">
      ${project.description}
    </p>
    <div class="line"></div>
    <div class="flex-images">
      <img src="./images/Frame 199.png" alt="" srcset="" />
      <button  class="delete-btn" getDeleteId=${project.id}>
        <img src="./images/trash.svg" alt="" srcset="" />
      </button>
    </div>`;
  article.innerHTML = articleContent;
  return article;
}
function deleteDataFromApi(url) {
  return fetch(url, { method: "DELETE" }).then((res) => res);
}

function deleteArticle(elemArr, sectionUrl) {
  elemArr.forEach((elem) => {
    elem.addEventListener("click", function () {
      const getElemId = elem.getAttribute("getDeleteId");
      const url = `${sectionUrl}/${getElemId}`;
      deleteDataFromApi(url).then((response) => {
        if (response.statusText == "OK") {
          elem.parentElement.parentElement.remove()
        } else {
          errorHandling("Unable to delete project. Try again later");
        }
      });
    });
  });
}

function errorHandling(message) {
  const warning = document.createElement("h1");
  warning.textContent = message;
  document.body.replaceChildren(warning);
}

// dragged item implementation
function dragStart(allArticles) {
  allArticles.forEach((article) => {
    article.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", event.target.id);
      console.log(event.target.id);
    });
  });
}

// dropped element implementation

function dropToTarget(targetSection,urlObj) {
  targetSection.addEventListener("dragenter", function (e) {
    e.preventDefault();
    e.dataTransfer.setData("text/plain", e.target.id);
  });

  targetSection.addEventListener("dragover", function (e) {
    e.preventDefault();
    targetSection.style.backgroundColor = "var(--gray-section)";
  });
  targetSection.addEventListener("dragleave", function (e) {
    e.preventDefault();
    targetSection.style.backgroundColor = "var(--body-bg-color)";
  });
  targetSection.addEventListener("drop", function (e) {
    e.preventDefault();
    const draggedElementId = e.dataTransfer.getData("text/plain");
    const getDraggedElement = document.getElementById(draggedElementId);

    const [, elemId] = draggedElementId.split("-");
    const projectContent = {
          type: getDraggedElement.childNodes[0].innerText,
          title: getDraggedElement.childNodes[2].innerText,
          description: getDraggedElement.childNodes[4].innerText
        };
   
      postDataToApi(urlObj.url2,projectContent,targetSection);
      deleteDataFromApi(`${urlObj.url1}/${elemId}`);
      targetSection.style.backgroundColor = "var(--body-bg-color)";
      getDraggedElement.remove();

  });
}

// progressSection.addEventListener("drop", function (e) {
//   e.preventDefault();
//   const draggedElementId = e.dataTransfer.getData("text/plain");
//   const getDraggedElement = document.getElementById(draggedElementId);

//   const projectContent = {
//     type: getDraggedElement.childNodes[0].innerText,
//     title: getDraggedElement.childNodes[2].innerText,
//     description: getDraggedElement.childNodes[4].innerText,
//   };

//   const [, elemId] = draggedElementId.split("-");

//   // store the dragged element to another collection
//   postDataToApi(
//     "https://64de658a825d19d9bfb28fd2.mockapi.io/prog-proje/progressection",
//     projectContent,
//     e.target
//   );
//   // delete from the previous collection
//   deleteDataFromApi(
//     `https://64b6b8aadf0839c97e16081a.mockapi.io/todo/${elemId}`
//   ).then((res) => {
//     if (res.statusText == "OK") {
//       document.getElementById(`article-${elemId}`).remove();
//     }
//   });
//   // remove the element from dom
// });
