export const getVariantClassName = (variant) => {
  switch (variant) {
    case "bank":
      return "bg-gradient-bank text-white";
    case "airlines":
      return "bg-gradient-airline-buttons ";
    case "investment":
      return "bg-gradient-investment ";
    case "market":
      return "bg-gradient-experimentation  ";
    default:
      return "";
  }
};
