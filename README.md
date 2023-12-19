# Emergent Ventures Winners 🌍

[Emergent Ventures Winners](https://evwinners.org) is a website collecting all the grantees of [Emergent Ventures](https://www.mercatus.org/emergent-ventures), initiated by economist and author [Tyler Cowen](https://en.wikipedia.org/wiki/Tyler_Cowen) at the Mercatus Center of George Mason University; it's a fellowship and grant program designed to support ambitious ideas and moonshots aimed at improving society. I collected all the winners and the links to their announcements posts in one place, and this is the repo for it.

![](https://github.com/nqureshi/ev-winners/blob/main/public/ev-winners-recording.gif)

The site uses semantic similarity (based on embeddings) to power the search function, enabling you to search for people working on broad project areas (e.g. all winners who are doing a startup; machine learning; education; and so on.). The benefit of this is that you don't need to get the exact keywords in order to return relevant results.

## How it works

The semantic search function is powered by transformers.js and sentence-transformers, using the model all-MiniLM-L6-v2. The front-end is in Next.js 14 and deployed on Vercel.

## Metadata

- **Last Updated**: December 2023, covering up to cohort #30.
- **Contribute**: Feel free to submit an issue to the repo if you see any missing data or want any features.
- **Raw data**: You can find the raw data in CSV format here: [https://github.com/nqureshi/ev-search-python/tree/main/data](https://github.com/nqureshi/ev-search-python/tree/main/data).

This site is an independent project and is not an official website of Emergent Ventures or Mercatus.

## Contact and More Information

For more details, inquiries, or suggestions, please visit the [GitHub repository](#) or contact [Nabeel](https://nabeelqu.co).