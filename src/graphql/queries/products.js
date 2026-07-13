export const PRODUCTS_QUERY = `
query GetProducts {
    products(first:12) {
        nodes {
            id
            title
            handle

            featuredImage {
                url
                altText
            }

            priceRange {
                minVariantPrice {
                    amount
                    currencyCode
                }
            }

            compareAtPriceRange{
                maxVariantPrice {
                    amount
                }
            }

            collections(first: 5) {
                nodes {
                    id
                    title
                }
            }

        }
    }
}
`;

export const PRODUCT_QUERY = `
    query GetProduct($handle: String!) {
        product(handle: $handle) {
            id
            title
            handle
            description

            images(first: 3) {
                nodes {
                    url
                    altText
                }
            }

            options {
                name
                values
            }

            variants(first: 25 {
                nodes {
                    id
                    title
                    availableForSale

                    price {
                        amount
                        currencyCode
                    }

                    selectedOptions {
                        name
                        value
                    }
                }
            }

            priceRange {
                minVariantPrice {
                    amount
                    currencyCode
                }
            }

            compareAtPriceRange {
                maxVariantPrice {
                    amount
                }
            }

            collections(first: 5) {
                nodes {
                    id
                    title
                }
            }
        }
    }
`;

// export const PRODUCT_QUERY = `
// query GetProduct($handle: String!) {
//     product(handle: $handle) {
//         id
//         title
//         handle
//         description

//         variants(first: 20) {
//             nodes {
//                 id
//             }
//         }
//     }
// }
// `;
