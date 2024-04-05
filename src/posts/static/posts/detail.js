const backbtn = document.getElementById("back-btn");
const url = window.location.href + "data/";
const spinnerBox = document.getElementById("spinner-box");
const updatebtn = document.getElementById("update-btn");
const deletebtn = document.getElementById("delete-btn");

backbtn.addEventListener("click", () => {
  history.back();
});

$.ajax({
  type: "GET",
  url: url,
  success: function (response) {
    console.log(response);
    const data = response.data;

    if (data.logged_in === data.author) {
      updatebtn.classList.remove("not-visible");
      deletebtn.classList.remove("not-visible");
    }
    spinnerBox.classList.add("not-visible");
  },
  error: function (error) {
    console.log(error);
    console.log(url);
  },
});
