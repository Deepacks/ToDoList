exports.getDate = () => {
  const dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return new Date().toLocaleDateString("en-US", dateOptions);
};
