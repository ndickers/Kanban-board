import verificationKey from "./approve.js";

window.addEventListener("DOMContentLoaded", fetchDataOnLoad);

async function fetchDataOnLoad() {
  // load data in todosection
  const todoProgressUrl = {
    url1: "https://64b6b8aadf0839c97e16081a.mockapi.io/todo",
    url2: "https://64de658a825d19d9bfb28fd2.mockapi.io/prog-proje/progressection",
  };

  const todoSection = document.querySelector("#todo-section");
  await loadApiData(todoProgressUrl.url1, todoSection);
  // get articles in todo section
  const getTodoSectionArticles = document.querySelectorAll(
    "#todo-section article"
  );
  setDraggableAtt(getTodoSectionArticles);
  dragStart(getTodoSectionArticles);
  // deleting article
  const deleteTodos = document.querySelectorAll("#todo-section button");
  await deleteArticle(deleteTodos, todoProgressUrl.url1);

  // ----------------------------------------
  // load data in in progress section

  const progressSec = document.querySelector("#in-progress-section");
  await loadApiData(todoProgressUrl.url2, progressSec);
  await dropToTarget(progressSec, todoProgressUrl);
  const deleteProgress = document.querySelectorAll(
    "#in-progress-section .delete-btn"
  );
  await deleteArticle(deleteProgress, todoProgressUrl.url2);
  // end progress section
  // -------------------------------------------------

  // load review section data
  const getProgressSectionArticles = document.querySelectorAll(
    "#in-progress-section article"
  );
  setDraggableAtt(getProgressSectionArticles);

  const progReviewUrl = {
    url1: todoProgressUrl.url2,
    url2: "https://64de658a825d19d9bfb28fd2.mockapi.io/prog-proje/review",
  };
  dragStart(getProgressSectionArticles);
  const inReviewSec = document.querySelector("#in-review-section");
  await loadApiData(progReviewUrl.url2, inReviewSec);
  await dropToTarget(inReviewSec, progReviewUrl);
  const deleteReview = document.querySelectorAll(
    "#in-review-section .delete-btn"
  );
  await deleteArticle(deleteReview, progReviewUrl.url2);
  // end review section data
  // -----------------------------------------------

  // start done section data load

  const getReviewSectionArticles = document.querySelectorAll(
    "#in-review-section article"
  );
  setDraggableAtt(getReviewSectionArticles);

  const reviewDoneUrl = {
    url1: progReviewUrl.url2,
    url2: "https://64e507a7c555638029140f2a.mockapi.io/done",
  };
  dragStart(getReviewSectionArticles);
  const inDoneSec = document.querySelector("#done-section");
  await loadApiData(reviewDoneUrl.url2, inDoneSec);
  await dropToTarget(inDoneSec, reviewDoneUrl);
  const deleteDone = document.querySelectorAll("#done-section .delete-btn");
  await deleteArticle(deleteDone, reviewDoneUrl.url2);
}

async function loadApiData(url, sectionToAddArticle) {
  // gets data from api
  const dataContent = await getDataFromApi(url);

  const noTaskP = document.createElement("p");

  // checks if the array data from api is empty
  if (dataContent.length == 0) {
    // if empty, we add text in the paragraph created above and append it to
    // a div where aticle was supposed to be added
    noTaskP.textContent = "No task yet";
    noTaskP.classList.add("notask-text");
    sectionToAddArticle.appendChild(noTaskP);

    // We then get the section heading and update it to 0 since there is no task added yet
    sectionToAddArticle.parentNode.firstElementChild.childNodes[1].firstElementChild.textContent =
      "0";
  } else {
    //check if data fetched from api is available,
    dataContent.forEach((data) => {
      // we create new html article using the data
      const newArticle = createArticle(data);
      // we then append the newly created article in the specified section(todo/in progress/in review /done)
      sectionToAddArticle.appendChild(newArticle);
      // after appending article we remove the "no task" paragraph created and make
      // the new aticlem the fistchild element of the specified section
      noTaskP.remove();
      // update the section heading to with the number of children
      sectionToAddArticle.parentNode.firstElementChild.childNodes[1].firstElementChild.textContent =
        sectionToAddArticle.children.length;
    });
  }
}

// display verification form on clicking each header link
const addProjectBtn = document.querySelector(".add-btn");
addProjectBtn.addEventListener("click", function (e) {
  e.preventDefault();
  displayVerificationForm();
  const verifyBtn = document.querySelector("#verify");
  verifyBtn.addEventListener("click", function () {
    displayInputProjectForm(addProjectBtn, form);
  });
});

function displayVerificationForm() {
  const form = document.createElement("form");
  form.setAttribute("id", "form");
  form.innerHTML = verificationForm();
  const opacityBg = opaqueBg();
  main.append(opacityBg, form);
  form.addEventListener("submit", preventSubmission);
  opacityBg.addEventListener("click", removeFormAndBg);
}

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

// set attribute to draggable
function setDraggableAtt(articles) {
  articles.forEach((article) => {
    article.setAttribute("draggable", "true");
  });
}

function opaqueBg() {
  const opacityBg = document.createElement("div");
  opacityBg.setAttribute("id", "bg-opacity");
  opacityBg.setAttribute("class", "opacity-bg");
  document.body.style.overflow= "hidden";
  
  return opacityBg;
}

function removeFormAndBg() {
  document.getElementById("form").remove();
  document.getElementById("bg-opacity").remove();
  document.body.style.overflow = "scroll";
}

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
    // check if data is posted succesfully
    if (res.statusText == "Created") {
      res.json().then((data) => {
        //  check if section to add article, has any available "notask" paragraph
        if (elementToAppend.firstElementChild.nodeName == "P") {
          // if it has  a paragraph, create a new article using data posted to api
          // then replace the no task paragraph with new article
          elementToAppend.replaceChild(
            createArticle(data),
            elementToAppend.firstElementChild
          );
        } else {
          // if it has an article, append the new article at the bottom of the section
          elementToAppend.appendChild(createArticle(data));
        }
        // then update the header of the articles section with the number of children
        elementToAppend.parentNode.firstElementChild.firstElementChild.firstElementChild.textContent =
          elementToAppend.children.length;
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

function createArticle(project) {
  const article = document.createElement("article");
  article.setAttribute("id", `article-${project.id}`);
  // article.setAttribute("draggable", "true");
  const articleContent = `<p class="project-type">${project.type}</p>
    <h2 class="project-title">${project.title}</h2>
    <p class="project-content">
      ${project.description}
    </p>
    <div class="line"></div>
    <div class="flex-images">
      <img class="image-profile" src="./images/ndickers-logo.png" alt="" srcset="" />
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
  // get the array of delete button and add event listener to each button
  elemArr.forEach((elem) => {
    elem.addEventListener("click", function () {
      // get api data id from getDeleted id attribute we created
      displayVerificationForm();
      const verifyDelete = document.querySelector("#verify");
      verifyDelete.addEventListener("click", function () {
        const verifyCode = document.querySelector("#verification").value;
        if (verifyCode == verificationKey) {
          const getElemId = elem.getAttribute("getDeleteId");
          // construct new url using data id so as to delete specific article
          const url = `${sectionUrl}/${getElemId}`;

          // call deleteDataFromApi using the new url, which returns a promise
          deleteDataFromApi(url).then((response) => {
            if (response.statusText == "OK") {
              const sectionUpdated =
                elem.parentElement.parentElement.parentElement;
              // onsuccessful dalation from api, also remove the article elemnt
              elem.parentElement.parentElement.remove();
              // check if the div section to add post, has any available post
              if (sectionUpdated.children.length == 0) {
                // if no post, then create new paragraph with "no task" content
                const createNotask = document.createElement("p");
                createNotask.textContent = "No task yet";
                createNotask.classList.add("notask-text");
                // add the paragraph to the empty div section
                sectionUpdated.appendChild(createNotask);
                // update the section header to 0 since it has no available post
                sectionUpdated.parentElement.childNodes[1].firstElementChild.firstElementChild.textContent =
                  "0";
              } else {
                // otherwise update the section header to the number of children available
                sectionUpdated.parentElement.childNodes[1].firstElementChild.firstElementChild.textContent =
                  sectionUpdated.children.length;
              }

              // sectionUpdated.childNodes[1].firstElementChild.firstElementChild.textContent
            } else {
              errorHandling("Unable to delete project. Try again later");
            }
          });
        }else{
          form.style.animation = "shakeForm 1.2s linear";
    document.getElementById("verification").style.animation =
      "inputColorShake 1.2s linear";
    document.querySelector(".submit").style.animation =
      "btnBgColor 1.2s linear";
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
      event.dataTransfer.setData("text/plain", article.id);
    });
    article.addEventListener("dragend", function (event) {
      event.dataTransfer.clearData("text/plain");
    });
  });
}

// dropped element implementation

function dropToTarget(targetSection, urlObj) {
  targetSection.addEventListener("dragenter", function (e) {
    e.preventDefault();
    e.dataTransfer.setData("text/plain", targetSection.id);
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
      description: getDraggedElement.childNodes[4].innerText,
    };

    postDataToApi(urlObj.url2, projectContent, targetSection);
    deleteDataFromApi(`${urlObj.url1}/${elemId}`);
    targetSection.style.backgroundColor = "var(--body-bg-color)";
    const parentOfDrag = getDraggedElement.parentElement;
    getDraggedElement.remove();
    parentOfDrag.parentElement.firstElementChild.firstElementChild.firstElementChild.textContent =
      parentOfDrag.children.length;
    targetSection.parentElement.firstElementChild.firstElementChild.firstElementChild.textContent =
      targetSection.children.length;
  });
}
