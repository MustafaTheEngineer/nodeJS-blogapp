const express = require("express");
// const path = require("path");
const router = express.Router();
const db = require("../data/db");

const Blog = require("../models/blog");
const Category = require("../models/category");

router.use("/blogs/category/:categoryid", async function (req, res) {
  const id = req.params.categoryid;
  try {
    //const [categories] = await db.execute("SELECT * FROM category");
    //const [blogs] = await db.execute("SELECT * FROM blog WHERE categoryid=?", [id]);
    categories = await Category.findAll({
      raw: true,
    });

    blogs = await Blog.findAll({
      where: {
        categoryid: id,
        onay: true
      },
      raw: true,
    });

    title = categories.filter(item => {
      return item.categoryid == id
    })

    res.render("users/blogs", {
      title: title[0].isim,
      blogs: blogs,
      categories: categories,
    });
  } catch (error) {
    console.log(error);
  }
});

router.use("/blogs/:blogid", async function (req, res) {
  //console.log(__dirname);
  //console.log(__filename);
  const id = req.params.blogid;
  try {
    //const [blog] = await db.execute("SELECT * FROM blog WHERE blogid=?", [id]);
    blog = await Blog.findByPk(id, {
      raw: true,
    });
    if (blog) {
      return res.render("users/blog-details", {
        blog: blog,
      });
    }
    res.redirect("/");
  } catch (error) {}
});

router.use("/blogs", async function (req, res) {
  try {
    //const [blogs] = await db.execute("SELECT * FROM blog WHERE onay=1 AND anasayfa=1");
    //const [categories] = await db.execute("SELECT * FROM category");

    const blogs = await Blog.findAll({
      where: {
        onay: true,
      },
      raw: true,
    });

    const categories = await Category.findAll({
      raw: true,
    });

    res.render("users/index", {
      title: "Popüler Kurslar",
      blogs: blogs,
      categories: categories,
    });
  } catch (error) {
    console.log(error);
  }
});

router.use("/", async function (req, res) {
  try {
    //const [blogs] = await db.execute("SELECT * FROM blog");
    //const [categories] = await db.execute("SELECT * FROM category");

    const blogs = await Blog.findAll({
      where: {
        anasayfa: true,
        onay: true,
      },
      raw: true,
    });

    const categories = await Category.findAll({
      raw: true,
    });

    res.render("users/index", {
      title: "Popüler Kurslar",
      blogs: blogs,
      categories: categories,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
