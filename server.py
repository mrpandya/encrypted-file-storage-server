from flask import Flask, request, jsonify, abort, render_template, redirect

app = Flask(__name__)


@app.route('/login', methods=['GET','POST'])
def login(req=None):
    if(request.method == 'POST'):
        print(request.form)
        return redirect('/login')
    # GET
    return render_template('login.html')




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8085)