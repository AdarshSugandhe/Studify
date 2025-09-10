export default function role(allowed) {
  return (req, res, next) => {
    if (!allowed.includes(req.user.role.toLowerCase())) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
