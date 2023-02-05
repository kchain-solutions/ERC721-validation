const fs = require('fs');

const PATH = "./artifacts/contracts";
const TARGET_PATH = "./abis"

async function main() {
    const dirList = fs.readdirSync(PATH);
    const targetFiles = await Promise.all(dirList.map(async (el) => {
        try {
            const tmp = el.split('.');
            const abiFile = tmp[0] + ".json";
            const file = fs.readFileSync(PATH + '/' + el + '/' + abiFile);
            const json = JSON.parse(file);
            const abiContent = JSON.stringify(json.abi);
            fs.writeFileSync(TARGET_PATH + "/" + abiFile, abiContent);
            return abiFile;
        } catch (error) {
            return error + " on element " + el;
        }
    }));
    console.log("Result: ", targetFiles);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});