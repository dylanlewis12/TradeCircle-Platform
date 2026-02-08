export const logReq = (req, res, next) => {
  console.log(
    `${req.method} -- ${req.url} == ${new Date().toLocaleDateString()}`,
  );

  next();
}

export const globalErr = (err, req, res, next) => {
  res.status(err.status || 500).json({ error: `❌ Error: ${err.message}` });
}