// Some functions calling addok
function searchAddOk(request, response, limit, output = "jqg")
{
    "use strict";
    $.ajax({
        // url: "http://api-adresse.data.gouv.fr/search"
        url: "http://localhost:7878/search",
        dataType: 'json',
        // contentType:"application/json; charset=utf-8",
        // processData: false,
        // async: false,
        data: {
            q: request.term,
            autocomplete:1,
            limit: 15
        },
        success: function(databan)
        {
            if(output == "jqg")
            {
              // Modify result to store datas from AddOk in each row returned.
              $.each(databan.features, function(idx,data)
              {
                  var tt1 = data.properties;
                  var tt2 = data.geometry;
                  // var stt = JSON.stringify(tt1.concat(tt2));           // <== JSON array (pour info)
                  var stt = JSON.stringify($.extend(true, {}, tt1, tt2), null, 4); // <== JSON object
                  data["datas"] = stt;
              });
              // Ok continue to jqGrid
              var sdata = JSON.stringify(databan);
              jQuery('#resultat').jqGrid('clearGridData');
              jQuery('#resultat').jqGrid('setGridParam', {datatype:'jsonstring', datastr: sdata});
              jQuery('#resultat').trigger('reloadGrid');
            }
            if(output == "dd")
            {
                var listresponse = [];
                var hnpresent = false;
                $.each(databan.features, function(idx,data)
                {
                    if(("housenumber" in data.properties) && (hnpresent == false))
                    {
                        hnpresent = true;
                    }
                    listresponse.push(
                    {
                        'label':data.properties.label + (hnpresent == true?"":" <span style='font-size:80%;color:red;'><i>(Numéro de voie non trouvé)</i></span>"),
                        'value':data.properties.label,
                        'housenumber': (hnpresent == true?"OK":"KO")
                    });
                });
                response(listresponse);
            }
        }
    });
}

/**
* Functions d'interrogations ADDOK suite appel ADDOK via Ajax
* ***********************************************************
**/
function isPostCode(data, retour) // return null or an array object
{
    // Fields : city, postcode
    var _fields = ["postcode"];
    if(_fields[_fields.indexOf(data.properties.type)] != -1)
    {
        if(findIndexByKeyValue(retour, "city", data.properties.city) == null)
        {
            retour.push(
            {
                'label':data.properties.postcode + "("+data.properties.city+")",
                'value':data.properties.postcode,
                'city':data.properties.city
            });
        }
    }
}
function isTown() // return null or an array object
{
    // Fields : city, town, village, hamlet
    var _fields = ["city","town","village","hamlet"];

}
function isAddress() // return null or an array object
{
    // Fields : street, place
    var _fields = ["street", "place"];

}
/**
* !! ABANDON THIS WAY...I NEED MORE CUT !!
* Params:
* req  : object request
* resp : object response
* limit: limit the number of response
* inTo : a way to filter return from AddOk ()
**/
function ExistAddOk(req, resp, limit, filter)
{
    "use strict";
    // Arrays to select which answer to return (using inTo)
    var code = ["postcode"];
    var commune = ["city","town","village","hamlet"];
    var street = ["street", "place"];
    var request = "";
    if(code.indexOf(filter) != -1)
    {
        var listtype = code;
        //request = "postcode:"+req.term+" type:city";
        request = req.term;
    }
    if(commune.indexOf(filter) != -1)
    {
        var listtype = commune;
        request = req.term;
    }
    if(street.indexOf(filter) != -1)
    {
        var listtype = street;
        request = req.term;
    }
    // alert(request);

    $.ajax({
        url: "http://localhost:7878/search",
        dataType: 'json',
        data: {
            q: request,
            autocomplete:1,
            limit: 1000
        },
        success: function(databan)
        {
            var listresponse = [];
            var test = [];
            var i=0;
            $.each(databan.features, function(idx,data)
            {

                switch (filter)
                {
                    case "postcode":
                        isPostCode(data, listresponse);
                        break;
                    case "town":

                        break;
                    case "address":

                        break;
                    default:

                }

                // Catégories ADDOK/BAN:
                // =====================
                // Commune => city/town/village/hamlet(hameau)
                // return when type == town or city
                //console.log(data.properties.type + " ==> " + data.properties.name);
                //console.log(commune.indexOf(data.properties.type) + " ** " + data.properties.type + "(" + commune[commune.indexOf(data.properties.type)] + ")");
                // if(listtype[listtype.indexOf(data.properties.type)] != -1)
                // {
                //     if(listresponse.indexOf(data.properties.name) == -1)
                //     {
                //         //listcity.push(data.properties.name);
                //         //test[] = array('label'=>data.properties.name, 'value'=>data.properties.id);
                //         //listcity[i]= {'label':data.properties.name,'value':data.properties.id};
                //         if(filter == "postcode")
                //         {
                //             //if(listresponse.indexOf(data.properties.postcode) == -1)
                //             if(findIndexByKeyValue(listresponse, "city", data.properties.city) == null)
                //             {
                //                 listresponse.push(
                //                     {
                //                         'label':data.properties.postcode + "("+data.properties.city+")",
                //                         'value':data.properties.postcode,
                //                         'city':data.properties.city
                //                     });
                //             }
                //         }
                //         else
                //         {
                //             listresponse.push(
                //                 {
                //                     'label':data.properties.name + "("+data.properties.id+")",
                //                     'value':data.properties.name
                //                 });
                //         }
                //         i++;
                //     }
                // }
            });
            resp(listresponse);
        }
    });
}

function putToBAN(dataform, sendTo)
{
    "use strict";
    var url = "http://localhost:5959/"+sendTo;
    switch(sendTo)
    {
        case "municipality":

            break;
        case "housenumber":

            break;
        case "street":

            break;
        default:
            // Nothing to do bye bye !
            break;
    }
}
function postToBAN(dataForm, sendTo)
{
    // 'frm' contain the form value(s)
    // We need :
    // url : to access ban
    // ...
    // sendTo could be (but restrict to *):
    // - municipality*
    // - housenumber*
    // - user
    // - locality*
    // - postion*
    // - street*
    "use strict";
    var url = "http://localhost:5959/"+sendTo;
    switch(sendTo)
    {
        case "municipality":

            break;
        case "housenumber":

            break;
        case "municipality":

            break;
        case "street":

            break;
        default:
            // Nothing to do bye bye !
            break;
    }
    $.post(url,
    {
        name: 'corusant',
        insee: '85000',
        version: '1',
        siren: '10'
    },
    function(data, status)
    {
        alert("Data: " + data + "\nStatus: " + status);
    });
}

function findIndexByKeyValue(obj, key, value)
{
    for(var i = 0 ; i < obj.length ; i++)
    {
        if(obj[i][key] == value)
        {
            return i;
        }
    }
    return null;
}

function highlightmoica(control, hlColor, duree)
{
    var highlightBg = hlColor || "#FFFF9C";
    var animateMs = duree || 1500;
    var originalBg = control.css("backgroundColor");
    var notLocked = true;
    if (notLocked) {
        notLocked = false;
        control.stop().css("background-color", highlightBg)
            .animate({backgroundColor: originalBg}, animateMs);
        setTimeout( function() { notLocked = true; }, animateMs);
    }
}


/**
 * Make a X-Domain request to url and callback.
 *
 * @param url {String}
 * @param method {String} HTTP verb ('GET', 'POST', 'DELETE', etc.)
 * @param data {String} request body
 * @param callback {Function} to callback on completion
 * @param errback {Function} to callback on error
 */

function xdr(url, method, data, callback, errback) {
    var req;

    if(XMLHttpRequest) {
        req = new XMLHttpRequest();


        if('withCredentials' in req) {
            req.open(method, url, true);
            req.setRequestHeader("authorization", "Bearer token");
            req.onerror = errback;
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    if (req.status >= 200 && req.status < 400) {
                        callback(req.responseText);
                    } else {
                        errback(new Error('Response returned with non-OK status'));
                    }
                }
            };
            req.send(data);
        }
    } else if(XDomainRequest) {
        req = new XDomainRequest();
        req.open(method, url);
        req.setRequestHeader("authorization", "Bearer token");
        req.onerror = errback;
        req.onload = function() {
            callback(req.responseText);
        };
        req.send(data);
    } else {
        errback(new Error('CORS not supported'));
    }
}

function xdr_ok(reponse)
{
    alert("OK:"+reponse);
}

function xdr_ko(reponse)
{
    alert("KO:"+reponse);
}
