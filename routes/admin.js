const express = require("express");
const router = express.Router();
const fs = require("fs");
//const path = require("path");

const db = require("../data/db");
const imageUpload = require("../helpers/image-upload");

const multer = require("multer");
const upload = multer({ dest: "./public/images" });

const Blog = require("../models/blog");
const Category = require("../models/category");

// BLOG

router.get("/blog/delete/:blogid", async function (req, res) {
  const blogid = req.params.blogid;
  try {
    /* const [blogs] = await db.execute("SELECT * FROM blog WHERE blogid=?", [blogid,]);
    const blog = blogs[0]; */
    const blog = await Blog.findByPk(blogid, { raw: true });

    res.render("admin/blog-delete", {
      title: "Delete Blog",
      blog: blog,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/blog/delete/:blogid", async function (req, res) {
  const blogid = req.body.blogid;
  try {
    Blog.destroy({
      where: {
        blogid: blogid,
      },
    });
    res.redirect("/admin/blogs?action=delete");
  } catch (err) {
    console.log(err);
  }
});

router.get("/blogs/create", async function (req, res) {
  try {
    //const [categories] = await db.execute("SELECT * FROM category");
    const categories = await Category.findAll();

    res.render("admin/blog-create", {
      title: "Create Blog",
      categories: categories,
    });
  } catch (error) {
    console.log(err);
  }
});

router.post(
  "/blogs/create",
  imageUpload.upload.single("resim"),
  async function (req, res) {
    const baslik = req.body.baslik;
    const altbaslik = req.body.altbaslik;
    const aciklama = req.body.aciklama;
    const resim = req.file.filename;
    const kategori = req.body.kategori;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;

    try {
      /* await db.execute(
      `INSERT INTO 
    blog(baslik, altbaslik, aciklama, resim, anasayfa, onay, categoryid)
    VALUES (?,?,?,?,?,?,?)`,
      [baslik,altbaslik, aciklama, resim, anasayfa, onay, kategori]
    ); */
      await Blog.create({
        baslik: baslik,
        altbaslik: altbaslik,
        aciklama: aciklama,
        resim: resim,
        anasayfa: anasayfa,
        onay: onay,
        categoryid: kategori,
      });
      return res.redirect("/admin/blogs?action=create");
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/blogs/:blogid", async function (req, res) {
  const blogid = req.params.blogid;

  try {
    //const [categories] = await db.execute("SELECT * FROM category");
    const blog = await Blog.findByPk(blogid,{
      raw: true
    });
    const categories = await Category.findAll({
      raw: true
    });

    if (blog) {
      return res.render("admin/blog-edit", {
        title: blog.baslik,
        blog: blog,
        categories: categories,
      });
    }
    res.redirect("admin/blogs");
  } catch (err) {
    console.log(err);
  }

  res.render("admin/blog-edit", {
    title: "Edit Blog",
  });
});

router.post(
  "/blogs/:blogid",
  imageUpload.upload.single("resim"),
  async function (req, res) {
    const blogid = req.body.blogid;
    const baslik = req.body.baslik;
    const altbaslik = req.body.altbaslik;
    const aciklama = req.body.aciklama;
    let resim = req.body.resim;

    if (req.file) {
      resim = req.file.filename;

      fs.unlink("./public/images/" + req.body.resim, (err) => {
        console.log(err);
      });
    }
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on";
    const kategoriid = req.body.kategori;
    console.log(onay);
    try {
      /* await db.execute(
        "UPDATE blog SET baslik=?, altbaslik=?, aciklama=?, resim=?, anasayfa=?, onay=?, categoryid=? WHERE blogid=?",
        [baslik, altbaslik, aciklama, resim, anasayfa, onay, kategoriid, blogid]
      ); */
      Blog.update({
        baslik: baslik,
        altbaslik:altbaslik,
        aciklama: aciklama,
        resim: resim,
        anasayfa: anasayfa,
        onay: onay,
        categoryid: kategoriid
      },{
        where: {
          blogid: blogid
        }
      })
      res.redirect("/admin/blogs?action=edit&blogid=" + blogid);
    } catch (err) {
      console.log(err);
    }
  }
);

router.get("/blogs", async function (req, res) {
  try {
    // const [blogs] = await db.execute("SELECT blogid,baslik,resim FROM blog");
    const blogs = await Blog.findAll({
      attributes: ["blogid", "baslik", "altbaslik", "resim"],
    });
    res.render("admin/blog-list", {
      title: "Blog List",
      blogs: blogs,
      action: req.query.action,
      blogid: req.query.blogid,
    });
  } catch (err) {
    console.log(err);
  }
});

// CATEGORY

router.get("/category/create", async function (req, res) {
  try {
    res.render("admin/category-create", {
      title: "Create Category",
    });
  } catch (error) {
    console.log(err);
  }
});

router.post("/category/create", async function (req, res) {
  const name = req.body.name;

  try {
    // await db.execute(`INSERT INTO category(name) VALUES (?)`, [name]); 
    await Category.create({
      isim: name,
    });
    res.redirect("/admin/categories?action=create");
  } catch (error) {
    console.log(error);
  }
});

router.get("/category/delete/:categoryid", async function (req, res) {
  const categoryid = req.params.categoryid;

  try {
    const category = await Category.findByPk(categoryid);
    res.render("admin/category-delete", {
      title: "Edit " + category.dataValues.isim,
      category: category.dataValues,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/category/delete/:categoryid", async function (req, res) {
  const categoryid = req.body.categoryid;

  try {
    /* await db.execute("DELETE FROM category WHERE categoryid=?", [categoryid]); */
    Category.destroy({
      where: {
        categoryid: categoryid
      }
    })
    res.redirect("/admin/categories?action=delete");
  } catch (err) {
    console.log(err);
  }
});

// Category Edit Page
router.get("/category/:categoryid", async function (req, res) {
  const categoryid = req.params.categoryid;

  try {
    const category = await Category.findByPk(categoryid);
    res.render("admin/category-edit", {
      title: "Edit " + category.dataValues.isim,
      category: category.dataValues,
    });
  } catch (err) {
    console.log(err);
  }
});

// Redirect category list after editing
router.post("/category/:categoryid", async function (req, res) {
  const categoryid = req.body.categoryid;
  const isim = req.body.name;

  try {
    /* await db.execute("UPDATE category SET name=? WHERE categoryid=?", [
      name,
      categoryid,
    ]); */
    Category.update(
      {
        isim: isim,
      },
      {
        where: {
          categoryid: categoryid,
        },
      }
    );

    res.redirect("/admin/categories?action=edit&categoryid=" + categoryid);
  } catch (err) {
    console.log(err);
  }
});

// Category List
router.get("/categories", async function (req, res) {
  //const [categories] = await db.execute("SELECT * FROM category");
  const categories = await Category.findAll();

  res.render("admin/category-list", {
    title: "Categories",
    categories: categories,
    action: req.query.action,
    categoryid: req.query.categoryid,
  });
});

module.exports = router;
