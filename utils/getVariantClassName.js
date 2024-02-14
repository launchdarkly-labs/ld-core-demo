export const getVariantClassName = (variant) => {
    switch (variant) {
      case 'bank':
        return 'bg-gradient-to-tr from-banklightblue to-bankdarkblue text-white';
      case 'airlines':
        return 'bg-gradient-to-r from-airlinepurple to-airlinepink text-white';
      case 'market':
        return 'bg-gradient-to-r from-marketblue text-black to-marketgreen text-black';
      default:
        return '';
    }
  };