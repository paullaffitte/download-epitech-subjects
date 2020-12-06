# download-epitech-subjects

Download all of your Epitech's subjects

## Disclaimer

You SHOULD NOT distribute files downloaded from intra.epitech.eu since it's the property of Epitech. This script has been written only for demonstration purpose, you are the only responsible of what you do with it.

In order to respect the intranet and avoid destroying it, the script is always running sequentially and is not parallelized in any way. Each webpage is scrapped one after the other, each files are downloaded one after the other. Be patient, it can take some time to finish, especially if your internet connection is not that good.

## How to

In order to download all files related to Epitech projects you've been registered to, you should first install dependencies:

```sh
npm i
# OR
yarn
```

Then put your token in `INTRA_TOKEN` env variable, and run this command:

```sh
npm run start
# OR
yarn start
```

It will first retreive a list of urls to files to download, then save it in data.json, and finally download all of them in the current directory. Files organisation should look like the following: `./downloads/<YEAR>/<MODULE>/<PROJECT>/<FILES>`, with `<FILES>` beeing files and directories related to the project.
