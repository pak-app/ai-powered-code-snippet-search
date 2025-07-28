# grpc_client.py
import grpc
import gRPCMethods.embedding_pb2 as embed_pb2
import gRPCMethods.embedding_pb2_grpc as embed_pb2_grpc

def run():
    # Connect to the gRPC server
    channel = grpc.insecure_channel('localhost:50051')
    stub = embed_pb2_grpc.EmbedServiceStub(channel)

    # Create a request
    request = embed_pb2.EmbedRequest(
        code="example123",
        description="Generate a vector for this sample description"
    )

    # Make the request and get the response
    response = stub.GenerateEmbedding(request)

    # Print the embedding
    print("Received embedding vector (length {}):".format(len(response.embedding)))
    print(response.embedding[:5], "...")  # print first 5 values for brevity

if __name__ == '__main__':
    run()
