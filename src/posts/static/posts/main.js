const postsBox = document.getElementById("posts-box");
const alertBox = document.getElementById("alert-box");
const spinnerBox = document.getElementById("spinner-box");

const loadMoreBtn = document.getElementById("load-btn");
const endBox = document.getElementById("end-box");

const postForm = document.getElementById("post-form");
const title = document.getElementById("id_title");
const body = document.getElementById("id_body");
const csrf = document.getElementsByName("csrfmiddlewaretoken");

const url = window.location.href;

const addBtn = document.getElementById("add-btn");
const closeBtns = document.getElementsByClassName("add-modal-close");
const dropzone = document.getElementById("my-dropzone");

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
const csrftoken = getCookie("csrftoken");
const deleted = localStorage.getItem("title");

if (deleted) {
  handleAlerts("danger", `<b>${deleted}</b> deleted!`);
  localStorage.clear();
}

const likeUnlikePosts = () => {
  postsBox.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("like-unlike")) {
      const clickedId = e.target.getAttribute("data-form-id");
      const clickedBtn = document.getElementById(`like-unlike-${clickedId}`);

      $.ajax({
        type: "POST",
        url: "like-unlike/",
        data: {
          csrfmiddlewaretoken: csrftoken,
          pk: clickedId,
        },
        success: function (response) {
          console.log(response);
          clickedBtn.textContent = response.liked
            ? `Unlike (${response.count})`
            : `Like (${response.count})`;
        },
        error: function (error) {
          console.log(error);
        },
      });
    }
  });
};

let visible = 3;

const getData = () => {
  $.ajax({
    type: "GET",
    url: `/data/${visible}/`,
    success: function (response) {
      const data = response.data;
      setTimeout(() => {
        spinnerBox.classList.add("not-visible");
        data.forEach((element) => {
          postsBox.innerHTML += `
                  <div class="card mb-2">
                      <div class="card-body" >
                          <h5 class="card-title">${element.title}</h5>
                          <p class="card-text">${element.body}</p>    
                      </div>
                      <div class="card-footer">
                            <div class="row">
                              <div class="col-1">
                                  <a href="${url}${
            element.id
          }" class="btn btn-primary ">Details</a>
                              </div>
                              <div class="col-2">
                              <form class="like-unlike" data-form-id="${
                                element.id
                              }">
                              <button class="btn btn-primary like-unlike-btn" id="like-unlike-${
                                element.id
                              }">
                                  ${
                                    element.liked
                                      ? `Unlike (${element.count})`
                                      : `Like (${element.count})`
                                  }
                              </button>
                          </form>
                          
                              </div>
                            </div>
                      </div>
                  </div>
              `;

          // show posts status
          if (response.size === 0) {
            endBox.textContent = "No posts added yet...";
          } else if (response.size <= visible) {
            loadMoreBtn.classList.add("not-visible");
            endBox.textContent = "No more posts to load";
          }
        });
        likeUnlikePosts();
      }, 100);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

loadMoreBtn.addEventListener("click", () => {
  visible += 3;
  getData();
});

let newPostId = null;
postForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "",
    data: {
      csrfmiddlewaretoken: csrf[0].value,
      title: title.value,
      body: body.value,
    },
    success: function (response) {
      console.log("response with ID", response);
      newPostId = response.id;
      postsBox.insertAdjacentHTML(
        "afterbegin",
        `
      <div class="card mb-2">
        <div class="card-body" >
            <h5 class="card-title">${response.title}</h5>
            <p class="card-text">${response.body}</p>    
        </div>
        <div class="card-footer">
          <div class="row">
            <div class="col-1">
              <a href="${url}${response.id}" class="btn btn-primary ">Details</a>
            </div>
            <div class="col-2">
              <form class="like-unlike" data-form-id="${response.id}">
                <button class="btn btn-primary like-unlike-btn" id="like-unlike-${response.id}">
                 Like (0)
                </button>
              </form>
            </div>
          </div>
        </div>
    </div>
      `
      );
      likeUnlikePosts();
      // $("#addPostModal").modal("hide");
      handleAlerts("success", "New Post Added");
      // postForm.reset();
    },
    error: function (error) {
      console.log(error);
      handleAlerts("danger", "Something went wrong");
    },
  });
});

addBtn.addEventListener("click", () => {
  dropzone.classList.remove("not-visible");
});

closeBtns.forEach((e) => {
  e.addEventListener("click", () => {
    postForm.reset();
    if (!dropzone.classList.contains("not-visible")) {
      dropzone.classList.add("not-visible");
    }

    const mydropzone = Dropzone.forElement("#my-dropzone");
    mydropzone.removeAllFiles(true);
  });
});

Dropzone.autoDiscover = false;
const myDropZone = new Dropzone("#my-dropzone", {
  url: "upload/",
  init: function () {
    this.on("sending", function (file, xhr, formData) {
      formData.append("csrfmiddlewaretoken", csrftoken);
      formData.append("new_post_id", newPostId);
    });
  },
  maxFiles: 5,
  maxFilesize: 4,
  acceptedFiles: ".jpeg, .jpg, .png",
});

getData();
