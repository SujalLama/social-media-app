const Post = require('../models/post.model')
const {errorHandler} = require('../helpers/dbErrorHandler')
const fs = require('fs');
const path = require('path');


const create = async (req, res, next) =>  {
  let filename = '';
    if(req.file) {
        filename = req.file.filename
    }
  const post = new Post({...req.body, photo: 'post/' + filename, postedBy: req.profile});
  try {
    let result = await post.save();
    res.json(result);
  } catch(err) {
    return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
  }
}

const postByID = async (req, res, next, id) => {
  try{
    let post = await Post.findById(id).populate('postedBy', '_id name photo').exec()
    if (!post)
      return res.status('400').json({
        error: "Post not found"
      })
    req.post = post
    next()
  }catch(err){
    return res.status('400').json({
      error: "Could not retrieve use post"
    })
  }
}

const listByUser = async (req, res) => {
  try{
    let posts = await Post.find({postedBy: req.profile._id})
                          .populate('comments.postedBy', '_id name photo')
                          .populate('postedBy', '_id name photo')
                          .sort('-created')
                          .exec()
    res.json(posts)
  } catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listNewsFeed = async (req, res) => {
  let following = req.profile.following
  following.push(req.profile._id)
  try{
    let posts = await Post.find({postedBy: { $in : req.profile.following } })
                          .populate('comments.postedBy', '_id name photo')
                          .populate('postedBy', '_id name photo')
                          .sort('-created')
                          .exec()
    res.json(posts)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  let post = req.post
  try{
    let deletedPost = await post.remove()
    res.json(deletedPost)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType)
    return res.send(req.post.photo.data)
}

const like = async (req, res) => {
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
    res.json(result)
  }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
  }
}

const unlike = async (req, res) => {
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
    res.json(result)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const comment = async (req, res) => {
  let comment = req.body.comment
  comment.postedBy = req.body.userId
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
                            .populate('comments.postedBy', '_id name')
                            .populate('postedBy', '_id name')
                            .exec()
    res.json(result)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
const uncomment = async (req, res) => {
  let comment = req.body.comment
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id}}}, {new: true})
                          .populate('comments.postedBy', '_id name')
                          .populate('postedBy', '_id name')
                          .exec()
    res.json(result)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id.toString() === req.auth._id.toString()
  if(!isPoster){
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

module.exports = {
  listByUser,
  listNewsFeed,
  create,
  postByID,
  remove,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  isPoster
}
