const posts = require('../data/posts');
const connection = require('../database/connection');

const index = (req, res) => {
    const sql = "SELECT * FROM posts";

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: true, message: 'Internal server error' });
        }
        console.log('Query results:', results);
        res.json(results);
    });
}

const show = (req, res) => {
    const postId = parseInt(req.params.id);
    const thisPost = posts.find(post => post.id === postId);

    // prepare the query
    const sql = "SELECT * FROM posts WHERE id = ?";

    // prepare the sql query to join post_tags
    const sqlJoin = `SELECT p.*, GROUP_CONCAT(t.label) AS tags
    FROM posts p
    LEFT JOIN post_tag pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.id = ?
    GROUP BY p.id`;

    //execute the query 
    connection.query(sql, [postId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: true, message: 'Internal server error' });
        }

        console.log('Query results:', results);

        if (results.length === 0) {
            return res.status(404).json({ error: true, message: 'Post not found' });
        }

        //execute the join query to get the tags for the post
        connection.query(sqlJoin, [postId], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: true, message: 'Internal server error' });
            }
            // add the tags to the post object
            if (results.length > 0) {
                results[0].tags = results[0].tags ? results[0].tags.split(',') : [];
            }

            console.log('Query results:', results);

            if (results.length === 0) {
                return res.status(404).json({ error: true, message: 'Post not found' });
            }
            res.json(results[0]);
        });
    });
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

    // prepare the query
    const sql = "DELETE FROM posts WHERE id = ?";

    //execute the query 
    connection.query(sql, [postId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: true, message: 'Internal server error' });
        }

        console.log('Query results:', results);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: true, message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    });
}

module.exports = {
    index,
    show,
    store,
    update,
    modify,
    destroy
};