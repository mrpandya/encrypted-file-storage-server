from flask import Flask, request, render_template, redirect, session
from hashlib import md5
from Crypto.Cipher import AES
import Crypto.Cipher.AES
from binascii import hexlify, unhexlify
import os
from base64 import b64encode,b64decode
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'any random string'

# static methods

def encrypt_md5(string1, string2):
    pt=string1+string2
    res=md5(pt.encode())
    return res.hexdigest()

def get_sk_and_iv(a):
    return a[0:16],a[16:32]

def encrypt_aes(sk,iv,data):
    cipher=AES.new(unhexlify(sk+iv),AES.MODE_CFB)
    return b64encode(cipher.encrypt(data)).decode('utf-8')

def decrypt_aes(sk,data):
    decipher=AES.new(unhexlify(sk),AES.MODE_CFB)
    return b64decode(decipher.decrypt(data))

def write_file(filename, data):
    with open(filename, 'w') as f:
        f.write(data)

def read_file(filename):
    with open(filename, 'r') as f:
        return '{}'.format(f.read)
    
def is_new_user(val):
    return not os.path.isdir('static/uploads/'+val)

def check_if_file_exists(user,filename):
    return os.path.isfile('/static/uploads/'+user+'/'+filename)

def create_dir_for_new_user(user):
    os.mkdir('static/uploads/'+user)
    return

def get_user_dir_path(user):
    if is_new_user(user):
        create_dir_for_new_user(user)
    return os.path.join('static/uploads/'+user)

def decrypt_all_files(user,key):
    print(key)
    for file in os.listdir(user):
        if not (os.path.isfile(os.path.join(user,file))):
            continue
        with open(user+'/'+file, 'rb') as f:
            with open(user+'/'+'temp/'+file+'.ignore','wb') as wf:
                wf.write(decrypt_aes(key,f.read()))


@app.route('/login', methods=['GET','POST'])
def login():
    if(request.method == 'POST'):
        form=request.form.to_dict()
        session['username'],session['password']=form['uname'],form['psw']
        return redirect('/home')
    return render_template('login.html')

@app.route('/home', methods=['GET'])
def home():
    user_hash_val=encrypt_md5(session['username'],session['password'])
    files=[]
    user_path=get_user_dir_path(user_hash_val)
    if not len(os.listdir(user_path))==0:
        id=1
        for file in os.listdir(user_path):
            if not os.path.isfile(os.path.join('static/uploads',user_hash_val,file)):
                continue
            files.append({'id':id,'filename':file,'filepath':os.path.join('uploads',user_hash_val,'temp',file)})
            id+=1
    decrypt_all_files(user_path,user_hash_val)
    return render_template('homepage.html',files=files,user=session['username'])
   
@app.route('/upload', methods = ['GET', 'POST'])
def upload_file():
    secret_key,iv=get_sk_and_iv(encrypt_md5(session['username'],session['password']))
    if request.method == 'POST':
        f = request.files['file']
        with open(get_user_dir_path(secret_key+iv)+'/'+f.filename, 'w') as file:
            file.write(encrypt_aes(secret_key,iv,hexlify(f.read())))
            with open (get_user_dir_path(secret_key+iv)+'/temp/'+f.filename, 'w') as lmao:
                lmao.write(b64encode(f.read()).decode('utf-8'))
        return redirect('home')
    return render_template('upload.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8085)