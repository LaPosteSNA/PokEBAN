var markers = [];
var marker;
var mapll;
var ignLayer;
var makeMap4 = ['osm', 'ign']; // array des couches a générer
/**
    ===============================================================================================
    WIP : Création de fonctions "générique" pour la gestion de la carto des différents fournisseurs
    ===============================================================================================
**/

// IGN =======================================
// Clef IGN (Web3D) : 5qp4eyd6i6wb3xk5m0uui1sm
// Clef IGN (std)   : nfzop22scm5qldxr6nhtbq8q
function getLayerURL(who, key, layer)
{
    switch (who) {
        case 'osm':
            return "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
            break;
        case 'ign':
            return "http://wxs.ign.fr/" + key
                + "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&"
                + "LAYER=" + layer + "&STYLE=normal&TILEMATRIXSET=PM&"
                + "TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg";
            break;
        case 'gmp':

            break;
        default:
    }
}

function getAttrib(who)
{
    switch (who) {
        case 'osm':
            return 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
            break;
        case 'ign':
            return '&copy; <a href="http://www.ign.fr/">IGN</a>';
            break;
        case 'gmp':

            break;
        default:
    }
}

function getLayer(who)
{
    switch (who) {
        case 'osm':
            return new L.TileLayer(getLayerURL(who), {minZoom: 8, maxZoom: 22, attribution: getAttrib(who)});
            break;
        case 'ign':
            return new L.TileLayer(getLayerURL(who), {attribution: getAttrib(who)});
            break;
        case 'gmp':

            break;
        default:
    }
}

function showMap(who, lat, lon)
{
    // Affiche une carte au choix
    // Si who = '' alors on utilise le array 'makeMap4' qui contient la liste des fournisseurs de carte par défaut.

}

function ShowIGNMap(lat, lon)
{
    ignLayer = L.TileLayer(
        ignLayerURL(
            "nfzop22scm5qldxr6nhtbq8q", "GEOGRAPHICALGRIDSYSTEMS.MAPS"
        ),
        {attribution: '&copy; <a href="http://www.ign.fr/">IGN</a>'}
    );
    mapll = L.map('carto2',
    {
        layers:[ignLayer],
        zoom:15,
        center:[lat, lon]
    });
    mapll.addLayer(ignLayer);
}


// OSM
function centerOnLL(lat, lon, label)
{
    mapll.panTo([lat, lon]);
}

function ShowLLMap(lat, lon)
{
    mapll = L.map('carto2').setView([lat, lon], 13);
    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 22, attribution: osmAttrib});
    mapll.addLayer(osm);
    centerOnLL(lat, lon);
}

function AddLLMapMarker(lat, lon, comment = '')
{
    // Don't open popup on creation (just on user action)
    if(comment == '')
    {
        if(marker == undefined)
        {
            marker = new L.marker([lat, lon]).addTo(mapll).bindPopup("<b>;-)</b>");//.openPopup(lopm);
        }
        else {
            // marker = new L.marker([lat, lon]).addTo(mapll).bindPopup("<b>;-)</b>");//.openPopup();
            // var newLatLng = new L.LatLng(lat, lon);
            // marker._popup.updateLayout();
            // marker._popup.updatePosition();
            marker.setLatLng([lat, lon]);//.update();
            // centerOnLL(lat, lon);
        }
        centerOnLL(lat, lon);
    }
    else
    {
        if(marker == undefined)
        {
            marker = new L.marker([lat, lon]).addTo(mapll).bindPopup("<b>"+comment+"</b>");//.openPopup();
        }
        else {
            // marker = new L.marker([lat, lon]).addTo(mapll).bindPopup("<b>"+comment+"</b>");//.openPopup();
            var newLatLng = new L.LatLng(lat, lon);
            marker._popup.setContent(comment)
            // marker._popup._updatePosition();
            // marker._popup._updateLayout();
            marker.setLatLng([lat, lon]);//.update();
            // centerOnLL(lat, lon);
        }
        centerOnLL(lat, lon);
    }
}

function DeleteAllMarkers()
{
    // Title said all.
}

function ShowHouseNumbers()
{
    // Get housenumbers for a street and display them in carto ! : (GEOJSON)

}
