
export const shouldClickStore= ({ label }: { label: string }): boolean => {
  const rando = Math.floor(Math.random() * 10);
  switch (label) {
    case "FINAL HOURS":
      return rando > 6;  // 40% chance
    case "NEW ITEMS":
      return rando > 3;  // 80% chance
    case "SALE":
      return rando > 4;  // 60% chance
    default:
      return rando > 7;  // 30% chance
  }
};

export const shouldClickAddToCart = ({ label }: { label: string }): boolean => {
  const rando = Math.floor(Math.random() * 10);
    return rando > 4;  // 60% chance
  };

  export const shouldClickCart = ({ label }: { label: string }): boolean => {
    const rando = Math.floor(Math.random() * 10);
      return rando > 7;  // 30% chance
    };
  

export const shouldClickCheckout = (): boolean => {
  const rando = Math.floor(Math.random() * 10);
  return rando > 3;  // 70% chance
};
