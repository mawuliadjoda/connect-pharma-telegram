# https://github.com/feathers-studio/telegraf-docs/tree/master/examples/webhook
# https://www.npmjs.com/package/telegraf

# https://github.com/telegraf/telegraf/discussions/1706
# https://github.com/feathers-studio/telegraf-docs/tree/master/examples/webhook


# https://github.com/telegraf/telegraf/blob/v4/src/telegraf.ts


# Markup.button.locationRequest
 https://github.com/telegraf/telegraf/discussions/1820

 # https://www.youtube.com/watch?v=pqiz0_DuCG4


 # https://dashboard.ngrok.com/get-started/your-authtoken

 # https://strapengine.com/telegram-bot-webhook-tutorial/



# heroku deploy with Git
https://devcenter.heroku.com/articles/git
https://devcenter.heroku.com/articles/deploying-nodejs#build-your-app-and-run-it-locally

1.  heroku login
2.  heroku create connect-pharma-telegram
3.  heroku git:remote -a connect-pharma-telegram

# commit file in git
4.  git add .
5.  git commit -m "deploy to prod"

6.  git push heroku master



 # error encountered
 https://stackoverflow.com/questions/41788740/enotfound-getaddrinfo-enotfound-api-heroku-com-api-heroku-com443-error-for-her

 https://stackoverflow.com/questions/34631300/why-do-i-obtain-this-error-when-deploying-app-to-heroku
 https://stackoverflow.com/questions/18406721/heroku-does-not-appear-to-be-a-git-repository



 # use session in telegram 
 https://github.com/feathers-studio/telegraf-docs/blob/master/examples/session-bot.ts



 # Use Typescript 
 https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript



# update session.d.ts in node_modules

export declare class MemorySessionStore<T> implements SessionStore<T> {
    private readonly ttl;
    private readonly store;
    constructor(ttl?: number);
    get(name: string): T | undefined;
    set: (name: string, value: T) => MaybePromise<Any>
    delete: (name: string) => MaybePromise<Any>
    // set(name: string, value: T): void;
    // delete(name: string): void;
}


# to build add this script to package.json scripts
"build": "tsc",

# before push to heroku:
dele "build": "tsc", from package.json