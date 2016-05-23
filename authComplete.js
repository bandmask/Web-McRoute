window.common = (function () {
    var common = {};

    common.getFragment = function getFragment() {
        if (window.location.hash.indexOf("#") === 0) {
            return parseQueryString(window.location.hash.substr(1));
        } else {
            return {};
        }
    };

    function parseQueryString(queryString) {
        var data = {},
            pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

        if (queryString === null) {
            return data;
        }

        pairs = queryString.split("&");

        for (var i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            separatorIndex = pair.indexOf("=");

            if (separatorIndex === -1) {
                escapedKey = pair;
                escapedValue = null;
            } else {
                escapedKey = pair.substr(0, separatorIndex);
                escapedValue = pair.substr(separatorIndex + 1);
            }

            key = decodeURIComponent(escapedKey);
            value = decodeURIComponent(escapedValue);

            data[key] = value;
        }

        return data;
    }

    return common;
})();

var fragment = common.getFragment();
window.location.hash = fragment.state || '';
if (typeof window.opener !== 'undefined' && window.opener !== null
    && typeof window.opener.$windowScope !== 'undefined' && window.opener.$windowScope !== null
    && typeof window.opener.$windowScope.authCompletedCB !== 'undefined' && window.opener.$windowScope.authCompletedCB !== null) {
    window.opener.$windowScope.authCompletedCB(fragment);
    window.close();
} else if (typeof Android !== 'undefined' && Android != null) {
    Android.authCompletedCB(JSON.stringify(fragment));
} else {
    document.write('<div style="color: red; margin-left: auto; margin-right: auto; width: 70%;">Something went wrong using callbacks, try again later</div>');
}