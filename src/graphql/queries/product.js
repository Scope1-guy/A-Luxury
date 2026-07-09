export const PRODUCTS_QUERY = `
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
            
            collection(first: 5) {
                nodes {
                    id
                    title
                }
            }
        }
    }
`;
