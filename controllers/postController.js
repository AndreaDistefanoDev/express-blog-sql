const posts = require('../data/posts');

const index = (req, res) => {
    const tag = req.query.tag;

    if (tag) {

        const filteredPosts = posts.filter(post =>
            post.tags.map(tag => tag.toLowerCase()).includes(tag.toLowerCase())
        );
        return res.json(filteredPosts);
    }
    res.json(posts);
}

const show = (req, res) => {
    const postId = parseInt(req.params.id);
    const thisPost = posts.find(post => post.id === postId);

    if (!thisPost) {
        return res.status(404).json({ error: true, message: 'Post not found' });
    }

    res.json(thisPost);
}

const store = (req, res) => {
    //cretate a new id for the new post by incrementing the id of the last post in the array
    const newId = posts[posts.length - 1].id + 1;
    //create a new post object with the new id and the data from the request body
    const newPost = {
        id: newId,
        ...req.body
    };
    posts.push(newPost);

    console.log('New post created:', newPost);

    //status code 201 indicates that a resource has been successfully created
    res.status(201).json(newPost);


}

const update = (req, res) => {

    const postId = parseInt(req.params.id);
    const thisPost = posts.find(post => post.id === postId);

    if (!thisPost) {
        return res.status(404).json({ error: true, message: 'Post not found' });
    }

    thisPost.title = req.body.title || thisPost.title;
    thisPost.content = req.body.content || thisPost.content;
    thisPost.tags = req.body.tags || thisPost.tags;

    console.log('Post updated:', thisPost);

    res.json(thisPost);
}

const modify = (req, res) => {
    res.json({ message: 'Post modified successfully' });
}

const destroy = (req, res) => {

    const postId = parseInt(req.params.id);
    const thisPost = posts.find(post => post.id === postId);

    if (!thisPost) {
        return res.status(404).json({ error: true, message: 'Post not found' });
    }

    const postIndex = posts.indexOf(thisPost);
    posts.splice(postIndex, 1);
    res.json({ message: 'Post deleted successfully' });
}

module.exports = {
    index,
    show,
    store,
    update,
    modify,
    destroy
};