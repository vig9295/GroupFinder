import os
import json


from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
  return jsonify(
    {
      'hello': 'worlds'
    }
  )

@app.route('/login', methods=['POST'])
def login():
	data = request.form['username']
	return jsonify(
		{
		 	'hello': data
		}
	)

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=True)