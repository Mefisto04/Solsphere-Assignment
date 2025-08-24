from flask import Flask, request
import json
app = Flask(__name__)

@app.route('/report', methods=['POST'])
def report():
    print("Received:", request.json)
    with open("report.json", "w") as f:
        json.dump(request.json, f)
    return "", 200

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
