module.exports = {
    extends: ["./base.js", "plugin:react/recommended", "plugin:react-hooks/recommended"],
    plugins: ["react", "react-hooks"],
    rules: {
        "react/react-in-jsx-scope": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
