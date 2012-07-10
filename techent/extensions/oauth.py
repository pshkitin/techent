from flask import request, session
from flaskext.oauth import OAuthRemoteApp, parse_response, OAuthException, add_query, OAuth
from werkzeug.urls import url_encode

class FlaskOAuth(OAuth):
    """Registry for remote applications.  In the future this will also
    be the central class for OAuth provider functionality.
    """

    def remote_app(self, name, register=True, **kwargs):
        """Registers a new remote applicaton.  If `param` register is
        set to `False` the application is not registered in the
        :attr:`remote_apps` dictionary.  The keyword arguments are
        forwarded to the :class:`OAuthRemoteApp` consturctor.
        """
        app = FlaskOAuthRemoteApp(self, name, **kwargs)
        if register:
            assert name not in self.remote_apps,\
            'application already registered'
            self.remote_apps[name] = app
        return app

class FlaskOAuthRemoteApp(OAuthRemoteApp):
    """Represents a remote application.

    :param oauth: the associated :class:`OAuth` object.
    :param name: then name of the remote application
    :param request_token_url: the URL for requesting new tokens
    :param access_token_url: the URL for token exchange
    :param authorize_url: the URL for authorization
    :param consumer_key: the application specific consumer key
    :param consumer_secret: the application specific consumer secret
    :param request_token_params: an optional dictionary of parameters
                                 to forward to the request token URL
                                 or authorize URL depending on oauth
                                 version.
    :param access_token_method: the HTTP method that should be used
                                for the access_token_url.  Defaults
                                to ``'GET'``.
    """

    def __init__(self, oauth, name, base_url,
                 request_token_url,
                 access_token_url, authorize_url,
                 consumer_key, consumer_secret,
                 request_token_params=None,
                 access_token_method='GET',
                 access_token_params=None):
        super(FlaskOAuthRemoteApp, self).__init__(oauth, name, base_url,
            request_token_url,
            access_token_url, authorize_url,
            consumer_key, consumer_secret,
            request_token_params,
            access_token_method)
        self.access_token_params = access_token_params or {}


    def handle_oauth2_response(self):
        """Handles an oauth2 authorization response.  The return value of
        this method is forwarded as first argument to the handling view
        function.
        """
        remote_args = {
            'code':             request.args.get('code'),
            'client_id':        self.consumer_key,
            'client_secret':    self.consumer_secret,
            'redirect_uri':     session.get(self.name + '_oauthredir')
        }
        remote_args.update(self.access_token_params)
        if self.access_token_method == 'GET':
            url = add_query(self.expand_url(self.access_token_url), remote_args)
            body = ''
        else:
            url = self.expand_url(self.access_token_url)
            body = url_encode(remote_args)

        resp, content = self._client.request(url, self.access_token_method, body=body)
        data = parse_response(resp, content)
        if resp['status'] != '200':
            raise OAuthException('Invalid response from ' + self.name, data)
        return data
