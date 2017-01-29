import os
import json
import script


from flask import Flask, jsonify, request

app = Flask(__name__)
'''
@app.route('/', methods=['GET'])
def index():
  return jsonify(
    {
      'hello': 'worlds'
    }
  )
'''

@app.route('/login', methods=['POST'])
def login():
	memberID = request.form['username']
	password = request.form['password']
	return jsonify(
		script.check_member(memberID, password)
	)

@app.route('/create_member', methods=['POST'])
def create_member():
	memberID = request.form['memberID']
    name = request.form['name']
    password = request.form['password']
	return jsonify(
		script.add_member(memberID, name, password)
	)

@app.route('/create_class', methods=['POST'])
def create_member():
	classID = request.form['classID']
    name = request.form['name']
    leader = request.form['leader']
	return jsonify(
		script.add_class(classID, name, leader, "GT")
	)

@app.route('/add_class_member', methods=['POST'])
def add_class_member():
	memberID = request.form['memberID']
    classID = request.form['classID']
	return jsonify(
		script.add_class_member(classID, memberID)
	)

@app.route('/add_class_member', methods=['POST'])
def find_classes():
	memberID = request.form['memberID']
	return jsonify(
		script.find_classes(memberID)
	)

@app.route('/get_class_details', methods=['POST'])
def add_class_member():
    classID = request.form['classID']
	return jsonify(
		script.get_class_details(classID)
	)


if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=True)
