from flask import Blueprint, request, jsonify, render_template
from .pubmed import fetch_pubmed_articles

main = Blueprint('main', __name__)

# Ruta raíz
@main.route("/")
def home():
    return render_template("index.html")

# Ruta para buscar en PubMed
@main.route("/search", methods=["GET"])
def search_pubmed():
    disease = request.args.get("disease")
    if not disease:
        return jsonify({"error": "Please provide a disease name"}), 400

    articles = fetch_pubmed_articles(disease)
    return jsonify(articles)
