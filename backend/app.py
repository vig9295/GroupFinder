import os
import json
from script import check_member


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
	username = request.form['username']
	password = request.form['password']
	return jsonify(
		check_member(username, password)
	)

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=True)