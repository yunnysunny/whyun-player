module.exports = {
    "env": {
        "es6": false,
        "node": false,
        "browser": true,
        "jquery": true,
    },
    "globals": {
        "Hls": "readonly"
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        // "linebreak-style": [
        //     "error",
        //     "windows"
        // ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
		//"no-console": 0
    }
};