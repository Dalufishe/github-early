/*
 * Project Github Early was
 * Created & Develop by Dalufishe ,
 * Copyright © 2024 Dalufishe 版權所有
 */

const currentRepo = new URL(window.location).pathname.split("/")[1] + "/" +
    new URL(window.location).pathname.split("/")[2]

async function repoHaveViewedBefore() {
    const data = await chrome.storage.local.get(["have_viewed_repos"])
    const repos = data.have_viewed_repos ? JSON.parse(data.have_viewed_repos) : []
    if (repos.includes(currentRepo)) return true
    return false
}

async function setHaveViewedRepo() {
    const data = await chrome.storage.local.get(["have_viewed_repos"])
    const repos = data.have_viewed_repos ? JSON.parse(data.have_viewed_repos) : []
    chrome.storage.local.set({ "have_viewed_repos": JSON.stringify(repos.concat([currentRepo])) })

}

async function rigisterGithubToken() {
    const githubTokenInput = prompt('Enter your Github token - Github Early')
    if (githubTokenInput.trim()) {
        chrome.storage.local.set({ "github_token": githubTokenInput.trim() })
    }
}

class Early {
    repo = currentRepo
    node = document.createElement("div")
}

class EarlyStargazers extends Early {
    stargazers = []

    constructor(haveViewedBefore) {
        super()
        this.getStargazers().then(() => {
            this.initDOM()
            if (!haveViewedBefore)
                this.setStargazersToPopup()
        })
        return this
    }

    getStartgazersURL() {
        return `https://api.github.com/repos/${this.repo}/stargazers?per_page=98`
    }


    async getStargazers() {
        const res = await githubFetch(this.getStartgazersURL())
        const stargazers = await res.json()
        this.stargazers = stargazers
    }

    initDOM() {
        // structure
        this.node.className = "BorderGrid-row"
        this.node.innerHTML =
            `
      <div class="BorderGrid-cell">
        <h2 class="mb-3 h4">Early Stargazers</h2>
        <ul class="early-stargazers list-style-none d-flex flex-wrap mb-n2"></ul>
        <div class="mt-3">
            <a style="cursor:pointer;" class="early-stargazers-load-more">Load more...</a>
        </div>
      </div>
        `

        // content
        const container = this.node.querySelector(".early-stargazers")

        this.stargazers.slice(0, 14).forEach(async (stargazer) => {
            const avatar = new Avatar(stargazer)
            container.append(avatar)
        })

        // load more
        const loadMoreBtn = this.node.querySelector(".early-stargazers-load-more")
        let currentIndex = 1
        loadMoreBtn.addEventListener("mousedown", () => {
            this.stargazers.slice(14 * currentIndex, 14 * (currentIndex + 1)).forEach(async (stargazer) => {
                const avatar = new Avatar(stargazer)
                container.append(avatar)
            })
            currentIndex += 1
        })

    }

    async setStargazersToPopup() {
        const data = await chrome.storage.local.get(["early_stargazers_list"])
        const earlyStargazersList = data.early_stargazers_list ? JSON.parse(data.early_stargazers_list) : {}
        this.stargazers.forEach(stargazer => {
            if (earlyStargazersList[stargazer.login]) {
                earlyStargazersList[stargazer.login] += 1
            } else {
                earlyStargazersList[stargazer.login] = 1
            }
        })
        chrome.storage.local.set({ "early_stargazers_list": JSON.stringify(earlyStargazersList) })
    }

}

class EarlyWatchers extends Early {
    watchers = []

    constructor(haveViewedBefore) {
        super()
        this.getWatchers().then(() => {
            this.initDOM()
            if (!haveViewedBefore)
                this.setWatchersToPopup()
        })
        return this
    }

    getWatchersURL() {
        return `https://api.github.com/repos/${this.repo}/subscribers?per_page=98`
    }

    async getWatchers() {
        const res = await githubFetch(this.getWatchersURL())
        const watchers = await res.json()
        this.watchers = watchers
    }

    initDOM() {
        // structure
        this.node.className = "BorderGrid-row"
        this.node.innerHTML =
            `
      <div class="BorderGrid-cell">
        <h2 class="mb-3 h4">Early Watchers</h2>
        <ul class="early-watchers list-style-none d-flex flex-wrap mb-n2"></ul>
        <div class="mt-3">
            <a style="cursor:pointer;" class="early-watchers-load-more">Load more...</a>
        </div>
      </div>
        `

        // content
        const container = this.node.querySelector(".early-watchers")

        this.watchers.slice(0, 14).forEach((watcher) => {
            const avatar = new Avatar(watcher)
            container.append(avatar)
        })

        // load more
        const loadMoreBtn = this.node.querySelector(".early-watchers-load-more")
        let currentIndex = 1
        loadMoreBtn.addEventListener("click", () => {
            this.watchers.slice(14 * currentIndex, 14 * (currentIndex + 1)).forEach((watcher) => {
                const avatar = new Avatar(watcher)
                container.append(avatar)
            })
            currentIndex += 1
        })

    }

    async setWatchersToPopup() {
        const data = await chrome.storage.local.get(["early_watchers_list"])
        const earlyWatchersList = data.early_watchers_list ? JSON.parse(data.early_watchers_list) : {}
        this.watchers.forEach(stargazer => {
            if (earlyWatchersList[stargazer.login]) {
                earlyWatchersList[stargazer.login] += 1
            } else {
                earlyWatchersList[stargazer.login] = 1
            }
        })
        chrome.storage.local.set({ "early_watchers_list": JSON.stringify(earlyWatchersList) })
    }

}

class Avatar {

    avatar = null
    user = null

    constructor(user) {

        this.user = user
        this.avatar = document.createElement("div")

        this.getUser().then((userInfo) => {
            this.avatar.innerHTML = `
            <a href=${user.html_url} target="_blank">
            <img
            style="${userInfo.followers > 500 ? "border: 3px solid #2bce4f" : ""}"
              width=32
              height=32
              class="mb-2 mr-2 avatar circle"
              style="cursor: pointer;"
              title="${`${user.login} - ${userInfo.followers}`}"
              src=${user.avatar_url}
              />
            </a>
        `
        })

        return this.avatar
    }

    getUserURL() {
        return `https://api.github.com/users/${this.user.login}`
    }

    async getUser() {
        const res = await githubFetch(this.getUserURL())
        const json = await res.json()
        return json
    }

}

chrome.storage.local.get(["github_token"]).then(data => {
    const githubToken = data.github_token
    if (!githubToken) {
        rigisterGithubToken()
    }
})

const borderGrid = document.querySelector(".BorderGrid")
const borderGridChildren = borderGrid.children

chrome.storage.local.get(["is_show_watchers", "is_show_stargazers"]).then(data => {

    repoHaveViewedBefore().then(haveViewedBefore => {

        if (data.is_show_watchers) {
            const earlyWatchers = new EarlyWatchers(haveViewedBefore)
            borderGrid.insertBefore(earlyWatchers.node, borderGridChildren[1])

        }
        if (data.is_show_stargazers) {
            const earlyStargazers = new EarlyStargazers(haveViewedBefore)
            borderGrid.insertBefore(earlyStargazers.node, borderGridChildren[1])
        }
        if (!haveViewedBefore) {
            setHaveViewedRepo()
        }
    })
})



