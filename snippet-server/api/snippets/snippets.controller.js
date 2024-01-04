const Snippet = require('../snippets/snippets.model');
const Bookmark = require('../bookmarks/bookmarks.model');
const util = require('../util/index');

const getSnippets = async (req, res) => {
    const { query } = req;
    const language = query.language;

    let filter = {};
    if(language) {
        filter = {programming_language: { $regex: language, options: 'i'}};
    }
    try {
        const snippets = await Snippet.find(filter);
        res.json(snippets);
    } catch (error) {
        res.status(500).json({error: error.toString()});
    }
};

const getSnippetById = async (req, res) => {
    const { params, query } = req;
    const id = params.id;

    const showBookmarkCount = util.queryToBoolean(query.bookmark);
    let snippet = await Snippet.findById(id);
    try {
        if (snippet) {
            if (showBookmarkCount) {
                const snippetBookmark = await Bookmark.find({snippet_id: snippet._id});
                snippet = {...snippet._doc, bookmarkCount: snippetBookmark.length};
            }
            res.json(snippet);
        } else {
            res.status(404).json({error: `No snippet found by id: ${id}`});
        }
    } catch (error) {
        res.status(500).json({error: error.toString()});
    }
};

const addSnippet = async (req, res) => {
    const { body } = req;
    try {
        const snippet = new Snippet(body);
        const result = await snippet.save();
        res.json(result);
    } catch (error) {
        res.status(500).json({error: error.toString()});
    }
};

const deleteSnippet = async (req, res) => {
    const { params } = req;
    const id = params.id;
   
    try {
         const deleted = await Snippet.findOneAndDelete({ _id: id });

        if (deleted) {
            res.json({ message: 'success', snippet: deleted._id });
        } else {
            res.status(404).json({ error: `No snippet found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({error: error.toString()});
    }
};

module.exports = {
    getSnippets,
    getSnippetById,
    addSnippet,
    deleteSnippet
};