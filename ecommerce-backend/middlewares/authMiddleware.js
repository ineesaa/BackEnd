module.exports = (req, res, next) => {
    const userId = Number(req.headers["x-user-id"]);
  
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  
    req.userId = userId;
    next();
  };