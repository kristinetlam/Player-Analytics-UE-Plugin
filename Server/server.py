from flask import Flask, request, jsonify
import boto3
import uuid
import os

# Flask App
app = Flask(__name__)

AWS_REGION = os.getenv("AWS_REGION")
DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE")

# Initialize DynamoDB Client
dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
table = dynamodb.Table(DYNAMODB_TABLE)

@app.route("/upload", methods=["POST"])
def upload_json():
    try:
        data = request.json  # Get JSON data from request
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        # Convert JSON to NoSQL format (DynamoDB format)
        item = {"id": str(uuid.uuid4())}  # Generate unique ID
        item.update(data)  # Merge JSON data into item

        # Store in DynamoDB
        table.put_item(Item=item)

        return jsonify({"message": "Data stored successfully", "id": item["id"]}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
