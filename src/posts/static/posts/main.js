const postsBox = document.getElementById("posts-box");
const spinnerBox = document.getElementById("spinner-box");
const loadMoreBtn = document.getElementById("load-btn");
const endBox = document.getElementById("end-box");
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
                                  <a href="#" class="btn btn-primary ">Details</a>
                              </div>
                              <div class="col-1">
                                  <a href="#" class="btn btn-primary ">Like</a>
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

getData();
