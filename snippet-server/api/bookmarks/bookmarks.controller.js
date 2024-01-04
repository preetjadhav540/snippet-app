const Bookmark = require('./bookmarks.model');

const addBookmark = async (req, res) => {
    const { body } = req;
    
    try {
        const bookmark = new Bookmark({body});
        await bookmark.save();
        res.json(bookmark);
    } catch (error) {
        res.status(500).json({error: error.toString()});
    }
};

const deleteBookmark = async (req, res) => {
    const { params } = req;
    const id = params.id;

    const bookmark = await Bookmark.findOneAndDelete({_id: id});
    try {
        if (bookmark) {
            res.json({ message: 'success', type: 'bookmark', removed: id});
        } else {
            res.status(404).json({ error: `No bookmark found by id: ${id}`});
        }
    } catch (error) {
        res.status(500).json({error: error.toString()});
    }
};

module.exports = {
    addBookmark,
    deleteBookmark
};