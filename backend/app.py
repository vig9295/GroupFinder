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
	memberID = request.form['username']
	password = request.form['password']
	return jsonify(
		script.check_member(memberID, password)
	)

@app.route('/register', methods=['POST'])
def register():
	memberID = request.form.get('username')
	name = request.form.get('name')
	password = request.form.get('password')
	print memberID, name, password
	return jsonify(
		script.add_member(memberID, name, password)
	)

@app.route('/create_class', methods=['POST'])
def create_class():
	classID = request.form['classID']
	name = request.form['name']
	leader = request.form['leader']
	return jsonify(
		script.add_class(classID, name, leader, "GT")
	)

@app.route('/create_classes', methods=['POST'])
def create_classes():
    memberID = request.form.get('memberID')
    data = request.form.get('data')
    data_json = json.loads(data)['site_collection']
    for items in data_json:
        classID = items['id']
        name = items['title']
        leader = "Uddhav Bhagat"
        term = items['props']['term']
        if term == "SPRING 2017":
            one = script.add_class(classID, name, leader, "GT")
            two = script.add_class_member(classID, memberID)
            if not two['success']:
                return jsonify(
                    {
                        'success': True,
                        'message': 'DB Error'
                    }
                )
    return jsonify(
        {
            'success': True,
            'message': 'Classes added successfully'
        }
    )



@app.route('/add_class_member', methods=['POST'])
def add_class_member():
	memberID = request.form['memberID']
	classID = request.form['classID']
	return jsonify(
		script.add_class_member(classID, memberID)
	)

@app.route('/find_classes', methods=['POST'])
def find_classes():
	memberID = request.form['memberID']
	return jsonify(
		script.find_classes(memberID)
	)

@app.route('/get_class_details', methods=['POST'])
def get_class_details():
	classID = request.form['classID']
	return jsonify(
		script.get_class_details(classID)
	)


if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=True)
