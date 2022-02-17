from flask import Flask, request, jsonify, abort

app = Flask(__name__)


@app.route('/login', methods=['GET','POST'])
def login():
    if(request.method == 'POST'):
        ...
    # GET
    
    return jsonify(None)

# @app.route('/login', methods=['POST'])
# def login(request):
#     return jsonify({request.methods:request})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8085)