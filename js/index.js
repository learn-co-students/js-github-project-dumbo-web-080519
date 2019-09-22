const searchForm = document.querySelector("#github-form");
const userList = document.querySelector("#user-list");
const repoList = document.querySelector("#repos-list");

function makeUserLi(userObj) {
  let userLi = document.createElement("li");
  userLi.innerText = userObj.login;
  userLi.classList.add("user")
  userLi.dataset.id = userObj.id;

  userLi.addEventListener("click", e => {
    hideUsersExceptOne(userObj);
    fetch(`https://api.github.com/users/${userObj.login}/repos`, {
      headers: {
        Accept: "application/vnd.github.v3+json"
      }
    })
    .then(res => res.json())
    .then(reposObj => reposObj.forEach(repoObj => {
      let li = makeRepoLi(repoObj);
      repoList.append(li);
    }))
  })
  return userLi;
}

function makeRepoLi(repoObj) {
  let newRepoLi = document.createElement("li");
  newRepoLi.innerText = repoObj.name;
  newRepoLi.classList.add("repo")
  // newRepoLi.dataset.id = repoObj.id;
  return newRepoLi;
}

function hideUsersExceptOne(user) {
  let allOtherLis = document.querySelectorAll(`.user:not([data-id="${user.id}"])`);
  allOtherLis.forEach(li => li.style.display = "none");
}

fetch("https://api.github.com/users", {
  headers: {
    Accept: "application/vnd.github.v3+json"
  }
})
.then(res => res.json())
.then(usersObj => usersObj.forEach(userObj => {
  let li = makeUserLi(userObj);
  userList.append(li);
}));

searchForm.addEventListener("submit", e => {
  e.preventDefault();
  let searchValue = e.target.search.value;
  let searchParams = `q=${searchValue}`;

  fetch(`https://api.github.com/search/users?${searchParams}`, {
    headers: {
      Accept: "application/vnd.github.v3+json"
    }
  })
  .then(res => res.json())
  .then(usersObj => {
    userList.innerHTML = "<h2>Users</h2>";
    usersObj.items.forEach(userObj => {
      let li = makeUserLi(userObj);
      userList.append(li);
    })
  })
})
