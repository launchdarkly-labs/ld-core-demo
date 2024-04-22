export const getVariantClassName = (variant) => {
    switch (variant) {
      case 'bank':
        return 'bg-gradient-releases';
      case 'airlines':
        return 'bg-gradient-targeting';
      case 'market':
        return "bg-gradient-experimentation";
      default:
        return '';
    }
  };