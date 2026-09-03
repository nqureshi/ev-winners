import pandas as pd
import numpy as np
import json
from sentence_transformers import SentenceTransformer, util

def get_ev_winners(query, embeddings, descriptions, names):
    query_embed = np.tile(model.encode(query), (len(embeddings), 1))
    cos_sim = util.cos_sim(embeddings, query_embed)

    all_sentence_combinations = []
    for i in range(len(cos_sim) - 1):
        all_sentence_combinations.append([cos_sim[i], descriptions[i], names[i]])

    all_sentence_combinations = sorted(all_sentence_combinations, key=lambda x: x[0][0], reverse=True)
    return all_sentence_combinations

def search_ev_winners(query, number, embeddings, descriptions, names):
    print(f"Top {number} matches for query: {query}\n")
    for index, item in enumerate(get_ev_winners(query, embeddings, descriptions, names)[:number], start=1):
        print(f"{index}. {item[2]}: {item[1]}")

def main():
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

    csv_file_path = 'data/ev-winners.csv'
    df = pd.read_csv(csv_file_path)

    print(df.head())

    names = df['name'].to_numpy()
    descriptions = df['description'].to_numpy()

    embeddings = model.encode(descriptions)
    print(embeddings)

    df['embedding_description'] = embeddings.tolist()

    output_csv_path = 'data/ev-winners-with-embeddings.csv'
    df.to_csv(output_csv_path, index=False)
    print(f"DataFrame with embeddings has been saved to '{output_csv_path}'")

    df2 = pd.read_csv(output_csv_path)
    df2['embedding_description'] = df2['embedding_description'].apply(json.loads)
    json_blob = df2.to_json(orient='records', lines=False)

    output_json_path = 'data/ev-winners-with-embeddings.json'
    with open(output_json_path, 'w') as json_file:
        json_file.write(json_blob)
    print(f"JSON blob has been saved to '{output_json_path}'")

if __name__ == '__main__':
    main()