const backbtn = document.getElementById("back-btn");
const updatebtn = document.getElementById("update-btn");
const deletebtn = document.getElementById("delete-btn");
const postBox = document.getElementById("post-box");
const alertBox = document.getElementById("alert-box");
const spinnerBox = document.getElementById("spinner-box");
const csrf = document.getElementsByName("csrfmiddlewaretoken");

const url = window.location.href + "data/";
const updateUrl = window.location.href + "update/";
const deleteUrl = window.location.href + "delete/";

const updateForm = document.getElementById("update-form");
const deleteForm = document.getElementById("delete-form");

const titleInput = document.getElementById("id_title");
const bodyInput = document.getElementById("id_body");

backbtn.addEventListener("click", () => {
  history.back();
});

$.ajax({
  type: "GET",
  url: url,
  success: function (response) {
    const data = response.data;

    if (data.logged_in === data.author) {
      updatebtn.classList.remove("not-visible");
      deletebtn.classList.remove("not-visible");
    }
    const titleEl = document.createElement("h3");
    titleEl.setAttribute("class", "mt-3");
    titleEl.setAttribute("id", "title");

    const bodyEl = document.createElement("p");
    bodyEl.setAttribute("class", "mt-1");
    bodyEl.setAttribute("id", "body");

    titleEl.textContent = data.title;
    bodyEl.textContent = data.body;

    postBox.appendChild(titleEl);
    postBox.appendChild(bodyEl);

    titleInput.value = data.title;
    bodyInput.value = data.body;

    spinnerBox.classList.add("not-visible");
  },
  error: function (error) {
    console.log(error);
  },
});

updateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title");
  const body = document.getElementById("body");

  $.ajax({
    type: "POST",
    url: updateUrl,
    data: {
      csrfmiddlewaretoken: csrf[0].value,
      title: titleInput.value,
      body: bodyInput.value,
    },
    success: function (response) {
      handleAlerts("success", "Post has been updated");
      title.textContent = response.title;
      body.textContent = response.body;
    },
    error: function (error) {
      console.log(error);
    },
  });
});
