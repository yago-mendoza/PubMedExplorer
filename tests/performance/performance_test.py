# tests/performance_test.py
import time
import sys
import os

# Añadir el directorio raíz del proyecto al path de Python
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.pubmed import fetch_pubmed_articles as optimized_fetch_pubmed_articles
from tests.performance.implementations.pubmed_v0 import fetch_pubmed_articles as original_fetch_pubmed_articles

def measure_performance(func, *args, **kwargs):
    start_time = time.time()
    result = func(*args, **kwargs)
    end_time = time.time()
    return end_time - start_time, result

def main():
    disease_name = "cancer"
    max_results = 5

    # Medir rendimiento del código original
    original_time, original_result = measure_performance(original_fetch_pubmed_articles, disease_name, max_results)
    print(f"Original function took {original_time:.4f} seconds")

    # Medir rendimiento del código optimizado
    optimized_time, optimized_result = measure_performance(optimized_fetch_pubmed_articles, disease_name, max_results)
    print(f"Optimized function took {optimized_time:.4f} seconds")

    # Comparar resultados
    if original_result == optimized_result:
        print("Both functions returned the same results.")
    else:
        print("Functions returned different results.")

    # Mostrar la mejora en porcentaje
    improvement = ((original_time - optimized_time) / original_time) * 100
    print(f"Performance improvement: {improvement:.2f}%")

if __name__ == "__main__":
    main()