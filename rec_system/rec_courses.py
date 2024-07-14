def recommend_course(input_skill, num_of_rec=1):
    import pandas as pd
    import neattext.functions as nfx
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    # Load your dataset
    df = pd.read_csv("sampled_data.csv")

    # Clean the course titles
    df['cleaned_title'] = df['title'].apply(nfx.remove_stopwords)
    df['cleaned_title'] = df['cleaned_title'].apply(nfx.remove_special_characters)

    # Vectorize the cleaned titles using TfidfVectorizer
    tfidf_vect = TfidfVectorizer()
    tfidf_mat = tfidf_vect.fit_transform(df['cleaned_title'])

    # Compute cosine similarity matrix
    cosine_sim_mat = cosine_similarity(tfidf_mat)

    # Clean the input skill
    cleaned_input_skill = nfx.remove_stopwords(input_skill)
    cleaned_input_skill = nfx.remove_special_characters(cleaned_input_skill)
    
    # Vectorize the input skill using the same vectorizer
    input_vec = tfidf_vect.transform([cleaned_input_skill])
    
    # Calculate cosine similarity of the input skill with all titles in the dataset
    cosine_sim_scores = cosine_similarity(input_vec, tfidf_mat).flatten()
    
    # Get indices of courses sorted by similarity
    sorted_indices = cosine_sim_scores.argsort()[::-1][:num_of_rec]
    
    # Retrieve recommended course titles and their similarity scores
    recommended_courses = df.iloc[sorted_indices]['title'].tolist()
    similarity_scores = cosine_sim_scores[sorted_indices]
    
    # Create a DataFrame with recommended course titles and their scores
    rec_df = pd.DataFrame({
        'Recommended Course': recommended_courses,
        'Course Link': "https://www.udemy.com" + df.iloc[sorted_indices]['course_url'],
        'Similarity Score': similarity_scores
    })
    
    # Sort by similarity score and get the top recommendation
    rec_df = rec_df.sort_values('Similarity Score', ascending=False).head(1)
    
    # Return the course link of the top recommendation
    return rec_df['Course Link'].iloc[0]