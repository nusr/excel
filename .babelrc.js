const plugins = [];
console.log("babel NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  plugins.push("istanbul");
}

module.exports = {
  plugins: ["istanbul"],
};
