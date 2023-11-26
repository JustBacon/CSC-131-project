import { createVendiaClient } from "@vendia/client";

const client = createVendiaClient({
    apiUrl: `https://vdgxvtk6n6.execute-api.us-west-2.amazonaws.com/graphql/`,
    apiKey: 'BPdBuk1TJvAByiC7UYUX7iCDrcPoW4XUJBDvFS6QP8m9', // <---- API key
})

export const vendiaClient = () => {
    return {client};
}