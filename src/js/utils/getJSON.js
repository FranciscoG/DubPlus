/**
 * Pure JS implementation of $.getJSON but it returns an actual native
 * JS Promise
 * 
 * @param {String} url 
 * @param {Object} headers object of xhr headers to add to the request
 * @returns {Promise}
 */
function getJSON(url, headers={}) {
  return new Promise(function(resolve, reject){
    let xhr = new XMLHttpRequest();
  
    xhr.onload = function() {
      try {
        let resp = JSON.parse(xhr.responseText);
        resolve(resp);
      } catch(e) {
        reject(e);
      }
    };

    xhr.onerror = function() {
      reject();
    }
    
    xhr.open('GET', url);

    for (let property in headers) {
      if (headers.hasOwnProperty(property)) {
        xhr.setRequestHeader(property, headers[property]);
      }
    }
  
    xhr.send();
  });

}

export default getJSON;