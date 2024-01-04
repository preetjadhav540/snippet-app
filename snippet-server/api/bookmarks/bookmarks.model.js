const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    snippet_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Snippets'},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}
});

const Bookmarks = mongoose.model('Bookmarks', BookmarkSchema);
module.exports = Bookmarks;