import os
from flask import Flask

def create_app():
    app = Flask(__name__,
                template_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'templates'),
                static_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'static'))
    
    from .routes import main
    app.register_blueprint(main)
    
    return app