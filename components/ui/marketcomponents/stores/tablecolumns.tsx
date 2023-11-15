import { ColumnDef } from "@tanstack/react-table"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
interface InventoryItem {
    id: string | number;
    item: string;
    cost: number;
  }
 
export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item",
    header: "Item",
  },
  {
    accessorKey: "cost",
    header: "Cost",
  },
]
