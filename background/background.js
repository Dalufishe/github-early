/*
 * Project Github Early was
 * Created & Develop by Dalufishe ,
 * Copyright © 2024 Dalufishe 版權所有
 */

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ "is_show_stargazers": true })
    chrome.storage.local.set({ "is_show_watchers": true })
    chrome.tabs.create({
        url: "https://github.com/Dalufishe/github-early"
    })
})

chrome.contextMenus.create({
    id: "is_show_stargazers",
    title: `Show Stargazers - On`,
    contexts: ["all"]
})

chrome.contextMenus.create({
    id: "is_show_watchers",
    title: "Show Watchers - On",
    contexts: ["all"]
})

let isShowStargazers = true
let isShowWatchers = true

chrome.contextMenus.onClicked.addListener((info) => {

    if (info.menuItemId === "is_show_stargazers") {
        isShowStargazers = !isShowStargazers
        chrome.contextMenus.update(info.menuItemId, {
            title: `Show Stargazers - ${isShowStargazers ? "On" : "Off"}`
        })
        chrome.storage.local.set({ "is_show_stargazers": isShowStargazers })
    } else if (info.menuItemId === "is_show_watchers") {
        isShowWatchers = !isShowWatchers
        chrome.contextMenus.update(info.menuItemId, {
            title: `Show Watchers - ${isShowWatchers ? "On" : "Off"}`
        })
        chrome.storage.local.set({ "is_show_watchers": isShowWatchers })
    }


})