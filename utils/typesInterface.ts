export interface NavBarProps {
    cart?: InventoryItem[];
    setCart?: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
    variant?: string;
  }
  
  export interface Persona {
    id: string | number;
    personaname: string;
    personatier: string;
    personaimage: string;
    personaemail: string;
  }

 export interface InventoryItem {
    id: string | number;
    item: string;
    cost: number | string;
    vendor?: string;
    image?: string;
    // image?: StaticImageData;
  }
