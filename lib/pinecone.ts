import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";

/**
 * @description Initialize the Pinecone client with the API key from environment variables
 */
export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

/**
 * @description Get the Pinecone index object using the index name from environment variables
 * @returns {Pinecone.Index} The Pinecone index object
 */
export const getIndex = () => {
  return pinecone.Index(process.env.PINECONE_INDEX!);
};

/**
 * @description Initialize the OpenAI embeddings object with the API key and model name from
 environment variables
 * 
 */
export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: process.env.OPENAI_EMBEDDINGS_MODEL || "text-embedding-3-large",
});

/**
 * Query Pinecone for similar vectors based on the input query
 * @param query - The text query to search for
 * @param namespace - The Pinecone namespace to search in
 * @param topK - The number of results to return (default: 3)
 * @returns An array of matching documents or an empty array if an error occurs
 */
export async function queryPinecone(
  query: string,
  namespace: string,
  topK = 3
) {
  try {
    // Validate inputs to prevent errors
    if (!query || typeof query !== "string") {
      console.error("Invalid query:", query);
      return [];
    }

    if (!namespace || typeof namespace !== "string") {
      console.error("Invalid namespace:", namespace);
      return [];
    }

    // Get the Pinecone index
    const index = getIndex();

    // Generate embeddings for the query
    let queryEmbedding;
    try {
      queryEmbedding = await embeddings.embedQuery(query);
    } catch (embeddingError) {
      console.error("Error generating embeddings:", embeddingError);
      return [];
    }

    // Query Pinecone with fallback
    try {
      // Search for similar vectors in the specified namespace
      const queryResponse = await index.namespace(namespace).query({
        vector: queryEmbedding,
        topK: topK,
        includeMetadata: true,
        includeValues: false,
      });

      // Return the matches or an empty array if none found
      return queryResponse.matches || [];
    } catch (pineconeError: any) {
      console.error("Error querying Pinecone:", pineconeError);
      return [];
    }
  } catch (error) {
    console.error("Error in queryPinecone:", error);
    return [];
  }
}
