import sys
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
df = pd.read_csv('data/ev-winners.csv')

# Generate embeddings. Uses description col only.
names = df['name'].to_numpy()
descriptions = df['description'].to_numpy()
embeddings = model.encode(descriptions)


def get_ev_winners(query):
    # Embeds the query, forces into same dimensions as the description embeddings
    query_embed = np.tile(model.encode(query), (len(embeddings), 1))

    cos_sim = util.cos_sim(embeddings, query_embed)
    cos_sim

    all_sentence_combinations = []
    for i in range(len(cos_sim)-1):
        all_sentence_combinations.append([cos_sim[i], descriptions[i], names[i]])

    # Sort list by the highest cosine similarity score
    all_sentence_combinations = sorted(
        all_sentence_combinations, key=lambda x: x[0][0], reverse=True)

    return all_sentence_combinations


def search_ev_winners(query, number):
    print(f"Top {number} matches for query: {query}\n")
    for index, item in enumerate(get_ev_winners(query)[:number], start=1):
        print(f"{index}. {item[2]}: {item[1]}")


if __name__ == "__main__":
    if len(sys.argv) not in [2, 3]:
        print("Usage: python your_script.py [query] [optional: number of results]")
        sys.exit(1)

    query = sys.argv[1]
    number = int(sys.argv[2]) if len(sys.argv) == 3 else 10

    search_ev_winners(query, number)
