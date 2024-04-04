const postsBox = document.getElementById("posts-box");
$.ajax({
  type: "GET",
  url: "/data/",
  success: function (response) {
    console.log(response);
    const data = response.data;
    console.log(data);
    data.forEach((element) => {
      postsBox.innerHTML += `
            ${element.title} - <b>${element.body}</b><br/>
        `;
    });
  },
  error: function (error) {
    console.log(error);
  },
});
