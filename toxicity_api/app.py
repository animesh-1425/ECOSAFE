from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import re
import string
import wordninja
import os

# 🔧 Initialize Flask
app = Flask(__name__)
CORS(app)  # Optional: enables CORS
PORT = int(os.environ.get('PORT', 5000))

# 📦 Load model and vectorizer
try:
    model = joblib.load("svm_model.pkl")
    vectorizer = joblib.load("tfidf_vectorizer.pkl")
except Exception as e:
    raise RuntimeError(f"Error loading model or vectorizer: {e}")

# 🚫 Define stopwords manually (without NLTK)
stop_words = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
    'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him',
    'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its',
    'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what',
    'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
    'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the',
    'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while',
    'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
    'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there',
    'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'can', 'will', 'just', 'don', 'should', 'now'
}

# 🧹 Text cleaning function using regex + wordninja
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)  # remove URLs
    text = re.sub(r"[^a-zA-Z\s]", "", text)  # remove digits/symbols
    text = text.translate(str.maketrans('', '', string.punctuation))  # remove punctuation

    # Word splitting
    split_words = wordninja.split(text.replace(" ", ""))
    filtered = [word for word in split_words if word and word not in stop_words]

    return " ".join(filtered)

# 🔁 Inference endpoint
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    if not data or 'comment' not in data:
        return jsonify({'error': 'No comment provided'}), 400

    comment = data['comment']
    cleaned = clean_text(comment)

    try:
        vectorized = vectorizer.transform([cleaned])
        raw_score = model.decision_function(vectorized)[0]
        toxicity_score = 1 / (1 + np.exp(-raw_score))  # sigmoid
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

    return jsonify({
        'input_comment': comment,
        'cleaned_comment': cleaned,
        'toxicity_score': round(float(toxicity_score), 4)
    })

# ✅ Health check
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'API is running'}), 200

# ▶ Local run
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
