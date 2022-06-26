/* 
  /categories

    [
      {
        categoryId: 1,
        categoryName: 'electronics',
        subCategories: [
          {
            subCategoryId: 1,
            subCategoryName: 'smart phones'
          },
          {
            subCategoryId: 2,
            subCategoryName: 'televisions'
          },
          {
            subCategoryId: 3,
            subCategoryName: 'laptops'
          }
        ]
      },
      {
        categoryId: 2,
        categoryName: 'clothes',
        subCategories: [
          {
            subCategoryId: 4,
            subCategoryName: 'boots'
          },
          {
            subCategoryId: 5,
            subCategoryName: 'shirts'
          }
        ]
      }
    ]

    /subcategories

    [
      {
        subCategoryId: 1,
        subCategoryName: 'smart phones',
        products: [
          {
            product_id: 1, 
            model: 'redmi',   
            productName: 'redmi note 6 pro', 
            color: 'black', 
            price: '140'
          },
          { 
            product_id: 2, 
            model: 'samsung', 
            product_name: 'galaxy 7', 
            color: 'red', 
            price: '190' 
          },
        ]
      }
    ]

    /products?categoryId=1
    /products?subCategoryId=1
    /products?subCategoryId=1&model=redmi
    /products?model=samsung&color=red
    /products/1

    POST
    /categories
      categoryName
    
    POST
    /subcategories
      categoryId, subCategoryName
    
    POST
    /products
      subCategoryId, productName, price, color, model
*/

// heroku --> link
// github --> link
// 09:00
