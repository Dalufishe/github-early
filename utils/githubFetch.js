/*
 * Project Github Early was
 * Created & Develop by Dalufishe ,
 * Copyright © 2024 Dalufishe 版權所有
 */

const githubFetch = async (url) => {
    return chrome.storage.local.get(["github_token"]).then(data => {
        const githubToken = data.github_token

        console.log(githubToken)

        return fetch(url, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
            },
        })
    })

}
