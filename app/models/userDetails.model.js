module.exports = (mongoose) => {
  const User = mongoose.model(
    "user",
    mongoose.Schema({
      handle: String,
      email: String,
      contestId: Number,
      contestName: String,
    })
  );
  return User;
};
