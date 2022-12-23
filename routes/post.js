const express = require("express");
const verifyToken = require("../modal/middleware/auth");
const router = express.Router();
const Post = require("../modal/Post");

//getlist
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, posts });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

//put id
router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });

  try {
    let updatePost = {
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "",
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId }; // id cuatr post va id cuar user
    updatePost = await Post.findOneAndUpdate(postUpdateCondition, updatePost, 
      {new: true,}
      ); //thoa man dieu kien trong postconditon // neu dung thi cap nhat

    //user npot authorised to update post
    if (!updatePost)
      return res.status(401).json({ success: false, message: "Post no found" });

    res.json({ success: true, message: "successful", post: updatePost });
  } 
  catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

//post

router.post("/", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });

  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "TO LEARN",
      user: req.userId,
    });

    await newPost.save();

    res.json({ success: true, message: "Happy learning", post: newPost });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});


//DELETE
router.delete('/:id',verifyToken, async(req,res)=>{
  try{
      const postDeleteConditon ={ _id:req.params.id, user:req.userId}
      const deletePost =await Post.findOneAndDelete(postDeleteConditon)

      if (!deletePost)
      return res.status(401).json({ success: false, message: "Post no found" });

    res.json({ success: true, message: "successful", post: deletePost });
    }
  catch(err)
  {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
})


module.exports = router;
