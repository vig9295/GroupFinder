import os
import json
import script

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
		script.check_member(username, password)
	)

@app.route('/find_classes', methods=['POST'])
def find_classes():
	memberID = request.form['memberID']
	return jsonify(
		script.find_classes(memberID)
	)

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=True)