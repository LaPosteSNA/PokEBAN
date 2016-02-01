from flask import Flask
from flask import render_template
from flask import request

import os
import requests
import jinja2
import urllib
import pprint
import json
# import dump
app = Flask(__name__)

# Racine du site
@app.route('/')
def index():
    os.environ['NO_PROXY'] = 'localhost,127.0.0.1'
    # print("Chemin racine !")
    return render_template('index.html')

# Lance une recherche dans addok & retour un json
@app.route('/cherche', methods=['GET'])
def cherche():
    r = None
    # NO_PROXY = {
    # 'no': 'pass',
    # }
    # Recherche avec AddOk
    term = request.args.get('ed_recherche')

    if term is None:
        return render_template('index.html', None, ed_recherche=term);

    print("Term:"+term)

    #     "http://127.0.0.1:7878/search?q=orton"
    url = "http://127.0.0.1:7878/search?q=" + term
    # url = "http://api-adresse.data.gouv.fr/search?q=" + term
    os.environ['NO_PROXY'] = 'localhost,127.0.0.1'
    try:
        print("Requesting : "+url)
        r = requests.get(url)
    except requests.exceptions.ConnectionError as e:
        print("Exception...42")

    if r == None:
        return render_template('index.html', None, ed_recherche=term)
    else:
        return render_template('index.html', reponse=r.json(), ed_recherche=term)
    # else:
    #     return render_template('index.html')


# Récupére le détail d'un housenumber dans la BAN
@app.route('/detail', methods=['GET'])
def detail():   # Detail de la ligne en cours dans le tableau (dans un popup ??jQueryUI Dialog ou 'vrai' popup ??)
    term = request.args.get('cia')
    # print("BAN Term:"+term)
    if term is None:
        return("")
    # http://localhost:5959/housenumber/cia:33293_332930111__23_
    url = "http://localhost:5959/housenumber/cia:" + term
    os.environ['NO_PROXY'] = 'localhost,127.0.0.1'
    try:
        r = requests.get(url)
    except requests.exceptions.ConnectionError as e:
        print("ex:"+e.message)
    return r.text

def getIdStreet(fantoir):
    url = "http://localhost:5959/street/fantoir:"+fantoir
    os.environ['NO_PROXY'] = 'localhost,127.0.0.1'
    try:
        r = requests.get(url)
    except requests.exceptions.ConnectionError as e:
        print("ex:"+e.message)
    resp = r.json()
    return resp['id']

def getHNLatestVersion(cia):
    # http://localhost:5959/housenumber/cia:33293_332930111__67_/versions
    # Get all versions for a housenumber (parse to get the max of response[xx].version)
    idCia = request.args.get('cia')
    os.environ['NO_PROXY'] = 'localhost,127.0.0.1'
    try:
        r = requests.get(url)
    except requests.exceptions.ConnectionError as e:
        print("ex:"+e.message)
    resp = r.json()
    return resp[resp['total']]

# Envoi une demande de création/modification vers la BAN
# xdr("http://localhost:5959/housenumber/", "POST", "street=332930111&number=66&version=1", xdr_ok, xdr_ko);
@app.route('/updateban', methods=['POST'])
def updateban():
    idCia = request.form['cia']
    idStreet = getIdStreet(idCia)
    number = request.form['number']

    #     var data = "street="+ idstreet +"&number="+ new_hn +"&version=1";
    if (idStreet == None) or (idCia == None) or (number == None):
        return("")
    # POST...
    headers = {
        'authorization': "Bearer token",
        'content-type': "application/x-www-form-urlencoded"
    }
    # url = "http://localhost:5959/housenumber/street=xxx&number=xx&version=x"
    # url = "http://localhost:5959/street/"+idStreet+"/housenumbers/"
    url = "http://localhost:5959/housenumber/"
    datas = {"street":repr(idStreet), "number":number, "version":"2"}
    os.environ['NO_PROXY'] = 'localhost,127.0.0.1'
    try:
        r = requests.post(url, data=datas, headers=headers)
    except requests.exceptions.ConnectionError as e:
        print("ex:"+e.message)
        return "KO"
    return repr(r.status_code)

# Lancement du serveur local via python.
if __name__ == "__main__":
    app.run(debug=True)
