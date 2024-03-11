/*
 * Project Github Early was
 * Created & Develop by Dalufishe ,
 * Copyright © 2024 Dalufishe 版權所有
 */

chrome.storage.local.get(["early_stargazers_list", "early_watchers_list"]).then(data => {

    async function fetchStargazerInfo(username, views) {
        const res = await githubFetch(`https://api.github.com/users/${username}`);
        return [await res.json(), views];
    }

    // early stargazers
    const early_stargazers_list = JSON.parse(data.early_stargazers_list)
    const early_stargazers_list_node = document.querySelector(".early-stargazers-list")

    const promisesa = Object.entries(early_stargazers_list)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(stargazer => fetchStargazerInfo(stargazer[0], stargazer[1]));

    Promise.all(promisesa)
        .then(stargazerInfos => {
            stargazerInfos.forEach(([json, views]) => {
                const item = document.createElement("a");
                item.className = "list-item"
                item.href = json.html_url
                item.target = "_blank"
                item.innerHTML = `
               <img width="32" height="32" src=${json.avatar_url}/>
               <div>${json.login}</div>
               <div>${views}</div>`
                early_stargazers_list_node.append(item);
            });
        });

    // early watchers
    const early_watchers_list = JSON.parse(data.early_watchers_list)
    const early_watchers_list_node = document.querySelector(".early-watchers-list")

    const promisesb = Object.entries(early_watchers_list)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(stargazer => fetchStargazerInfo(stargazer[0], stargazer[1]));

    Promise.all(promisesb)
        .then(stargazerInfos => {
            stargazerInfos.forEach(([json, views]) => {
                const item = document.createElement("a");
                item.className = "list-item"
                item.href = json.html_url
                item.target = "_blank"
                item.innerHTML = `
               <img width="32" height="32" src=${json.avatar_url}/>
               <div>${json.login}</div>
               <div>${views}</div>`
                early_watchers_list_node.append(item);
            });
        });

})
