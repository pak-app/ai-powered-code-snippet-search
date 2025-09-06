# python-app/grpc_server.py
import grpc
from concurrent import futures

import gRPCMethods.embedding_pb2_grpc as embed_pb2_grpc
import gRPCMethods.embedding_pb2 as embed_pb2

from sentence_transformers import SentenceTransformer

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

class EmbedService(embed_pb2_grpc.EmbedServiceServicer):
    def GenerateEmbedding(self, request, context):
        # You can do embedding logic here
        print("Received:", len(request.codes))
        codes = request.codes
        
        embedding_array = model.encode(codes)
               
        return embed_pb2.EmbedResponse(
            embedding=embedding_array  # dummy data
        )

def run_serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    embed_pb2_grpc.add_EmbedServiceServicer_to_server(EmbedService(), server)
    server.add_insecure_port('127.0.0.1:50051')
    server.start()
    print("gRPC server started on port 50051")
    server.wait_for_termination()

if __name__ == "__main__":
    run_serve()