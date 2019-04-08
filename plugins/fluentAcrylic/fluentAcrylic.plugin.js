//META{"name":"acrylic"}*//

let os = require("os");
let path = require("path");
let https = require("https");
let fs = require("fs");
let {app} = require("electron").remote;

class acrylic {
    getName(){ return "Fluent Design Acrylic" }
    getDescription(){ return "Actual acrylic in discord." }
    getAuthor(){ return "THEN00P" }
    getVersion(){ return "1.0.0" }

    async start() {

        const download = function (url, dest) {
            return new Promise(resolve => {
                let file = fs.createWriteStream(dest);
                https.get(url, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close(resolve); // close() is async, call cb after close completes.
                    });
                }).on('error', function (err) { // Handle errors
                    fs.unlink(dest); // Delete the file async. (But we don't check the result)
                    if (cb) resolve(err.message);
                });
            })
        };

        //check if platform supports acrylic
        if(os.platform() != "win32" || !os.release().startsWith("10")) return false;

        //download compiled module
        if(!fs.existsSync(path.resolve(bdConfig.dataPath, "acrylic.asar"))) {
            //doesn't work with ".asar" extentsion
            await download("https://cdn.jsdelivr.net/gh/THEN00P/discord-plugins-and-themes@00108c4550ccea4d8d5bc8c76570ab30146c1ceb/binaries/acrylic.asar", path.resolve(bdConfig.dataPath, "acrylic"));

            fs.renameSync(path.resolve(bdConfig.dataPath, "acrylic"), path.resolve(bdConfig.dataPath, "acrylic.asar"));
        }

        if(!window.BdApi.isSettingEnabled("fork-wp-1")) {
	    //enable transparent backgrounds
            window.settingsPanel.updateSettings("fork-wp-1", true);

            setTimeout(() => {
                app.relaunch()
                app.exit()
            }, 2500);
        }

        //enable acrylic
        require(require("path").resolve(bdConfig.dataPath, "acrylic.asar")).SetAcrylic(require("electron").remote.getCurrentWindow());
    }
    stop() {
        window.settingsPanel.updateSettings("fork-wp-1", false);

        app.relaunch()
        app.exit()
    }
}
