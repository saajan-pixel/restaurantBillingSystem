export interface ItemList{
    id:number,
    categoryId:number,
    name:string,
    qty:number,
    price:number,
    img:URL
}

export interface MenuItem extends ItemList{
    subTotal:number,
    isDiscounted?:boolean,
    discountAmount:number

}

export interface MenuCategory{
    id:number,
    name:string
}