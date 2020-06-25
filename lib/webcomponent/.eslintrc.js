module.exports = {
    "env": {
        "es6": true,
        "node": false,
        "browser": true,
        "jquery": false,
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