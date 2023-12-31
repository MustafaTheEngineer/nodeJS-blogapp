const express = require("express");
const path = require("path");

const app = express();
const dummyData = require("./data/dummy-data")

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));



const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const Category = require("./models/category");
const Blog = require("./models/blog");
const sequelize = require("./data/db");

app.use("/libs", express.static("node_modules"));
app.use("/static", express.static("public"));

app.use("/admin", adminRoutes);
app.use(userRoutes);

Blog.belongsToMany(Category, { through: "blogCategories"});
Category.belongsToMany(Blog, { through: "blogCategories"});

(async () => {
    await sequelize.sync({ force: true });
    await dummyData();
})();

app.listen(3000, function () {
});
