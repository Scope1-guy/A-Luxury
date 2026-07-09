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
