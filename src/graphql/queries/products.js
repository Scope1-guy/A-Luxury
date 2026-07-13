export const PRODUCTS_QUERY = `
query GetProducts($cursor: String) {
    products(first: 50, after: $cursor) {
        nodes {
            id
            title
            handle
            tags

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

            compareAtPriceRange {
                maxVariantPrice {
                    amount
                }
            }

            collections(first: 5) {
                nodes {
                    id
                    title
                    handle
                }
            }
        }
        pageInfo {
            hasNextPage
            endCursor
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
            tags

            images(first: 5) {
                nodes {
                    url
                    altText
                }
            }

            options {
                name
                values
            }

            variants(first: 25) {
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
                    handle
                }
            }
        }
    }
`;
