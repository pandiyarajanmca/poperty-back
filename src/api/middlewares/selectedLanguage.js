exports.selectedLanguage = async (req, res, next) => {
    if (req.headers.lang) {
    // override into response
        res.lang = req.headers.lang;
        next();
    } else {
        res.lang = 'en';
        next();
    }
};
