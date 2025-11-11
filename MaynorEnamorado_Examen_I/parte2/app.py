import os
from flask import Flask, jsonify

app = Flask(__name__)

PORT = int(os.environ.get('PORT', 5000))

@app.route('/')
def inicio():
    return jsonify({
        "mensaje": "Examen Docker",
        "estudiante": "Maynor Enamorado" 
    })

@app.route('/salud')
def salud():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    print(f"Aplicación iniciada en puerto {PORT}")
    app.run(host='0.0.0.0', port=PORT)