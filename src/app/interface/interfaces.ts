export interface ItemList{
    id:number,
    categoryId:number,
    name:string,
    qty:number,
    price:number,
    img:URL,
    discountAmount:number,
}

export interface MenuItem extends ItemList{
    subTotal:number,
    isDiscounted?:boolean,
    discountPercent:number

}

export interface MenuCategory{
    id:number,
    name:string
}