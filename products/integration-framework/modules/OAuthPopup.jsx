import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useToast, HBox, HButton, HLabel, HTextField, HDropdown, useDrsTheme, HTextarea, HDialog } from "@helix/component-library";
import { useIntl } from "react-intl";


const OAuthPopup = ({ open, onClose }) => {
  const [tokenName, setTokenName] = useState('');
  const [grantType, setGrantType] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [accessTokenUrl, setAccessTokenUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [scope, setScope] = useState('');
  const [state, setState] = useState('');
  const [clientAuth, setClientAuth] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const intl = useIntl();
  const { themeVars, surfaces, text, colors, } = useDrsTheme();

  const handleRequestToken = () => {
    console.log({
      tokenName,
      grantType,
      callbackUrl,
      authUrl,
      accessTokenUrl,
      clientId,
      clientSecret,
      scope,
      state,
      clientAuth,
      username,
      password
    });
  };

  const grantTypeOptions = [
    { label: "Authorization Code", value: "authorization_code" },
    { label: "Authorization Code (with PKCE)", value: "authorization_code_pkce" },
    { label: "Implicit", value: "implicit" },
    { label: "Password Credentials", value: "password_credentials" },
    { label: "Client Credentials", value: "client_credentials" },
  ];

  const clientAuthOptions = [
  {
    label: "Send as Basic Auth header",
    value: "basic",
  },
  {
    label: "Send client credentials in Body",
    value: "client-credentials",
  },
];
  return (
    <HDialog
      open={open}
      onClose={onClose}
      title={intl.formatMessage({ id: "label.get.new.token", defaultMessage: "Get New Access Token" })}
      titleSx={{ textAlign: 'center' }}
      actions={
        <HBox
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            backgroundColor: "transparent"
          }}
        >
          <HButton
            label={intl.formatMessage({ id: "Cancel", defaultMessage: "Cancel" })}
            variant="outlined"
            onClick={onClose}
          />
          <HButton
            label={intl.formatMessage({ id: "Request Token", defaultMessage: "Request Token" })}
            variant="outlined"
            onClick={handleRequestToken}
          />
        </HBox>
      }
    >
        <>
          <HTextField
            label={intl.formatMessage({id:"label.token.name", defaultMessage: "Token Name"})}
            editable
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            sx={{ mt: "1rem", width: "100%" }}
            InputLabelProps={{
              sx: {
                backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                transform: 'translate(14px, 2px) scale(1)',
                '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
              }
            }} />

          <HDropdown
            name="grantType"
            options={grantTypeOptions}
            value={grantType}
            onChange={(e) => setGrantType(e.target.value)}
            placeholder={intl.formatMessage({id:"label.grant.type", defaultMessage: "Grant Type"})}
            width="100%"
            sx={{ mt: "2rem" }}
          />
          {(grantType === 'authorization_code' || grantType === 'authorization_code_pkce') && (
          <>
            <HTextField
              label={intl.formatMessage({id:"label.callback.url", defaultMessage: "Callback URL"})}
              value={callbackUrl}
              editable
              onChange={(e) => setCallbackUrl(e.target.value)}
              sx={{ mt: "2rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HTextField
              label={intl.formatMessage({id:"label.auth.url", defaultMessage: "Auth URL"})}
              value={authUrl}
              editable
              onChange={(e) => setAuthUrl(e.target.value)}
              sx={{ mt: "2rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HTextField
              label={intl.formatMessage({id:"label.access.token.url", defaultMessage: "Access Token URL"})}
              value={accessTokenUrl}
              editable
              onChange={(e) => setAccessTokenUrl(e.target.value)}
              sx={{ mt: "2rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HTextField
              label={intl.formatMessage({id:"label.client.id", defaultMessage: "Client ID"})}
              value={clientId}
              editable
              onChange={(e) => setClientId(e.target.value)}
              sx={{ mt: "2rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HTextField
              label={intl.formatMessage({id:"label.client.secret", defaultMessage: "Client Secret"})}
              type="password"
              editable
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              sx={{ mt: "2rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HTextField
              label={intl.formatMessage({id:"label.scope", defaultMessage: "Scope"})}
              value={scope}
              editable
              onChange={(e) => setScope(e.target.value)}
              sx={{ mt: "2rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            {grantType === 'authorization_code' && (
            <HTextField
              label={intl.formatMessage({id:"label.state", defaultMessage: "State"})}
              value={state}
              editable
              onChange={(e) => setState(e.target.value)}
              sx={{ mt: "2rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
             )}
                       </>
          )}
           {(grantType === 'password_credentials' || grantType === 'client_credentials') && ( 
          <>
            <HTextField
              label={intl.formatMessage({id:"label.client.id", defaultMessage: "Client ID"})}
              value={clientId}
              editable
              onChange={(e) => setClientId(e.target.value)}
              sx={{ mt: "2rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HTextField
              label={intl.formatMessage({id:"label.client.secret", defaultMessage: "Client Secret"})}
              type="password"
              editable
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              sx={{ mt: "2rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HTextField
              label={intl.formatMessage({id:"label.scope", defaultMessage: "Scope"})}
              value={scope}
              editable
              onChange={(e) => setScope(e.target.value)}
              sx={{ mt: "2rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
             {grantType === 'password_credentials' && ( 
            <>
              <HTextField
                label={intl.formatMessage({id:"label.username", defaultMessage: "Username"})}
                value={username}
                editable
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mt: "2rem", width: "100%" }}
                InputLabelProps={{
                  sx: {
                    backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                    transform: 'translate(14px, 2px) scale(1)',
                    '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                  }
                }}
              />
              <HTextField
                label={intl.formatMessage({id:"label.password", defaultMessage: "Password"})}
                type="password"
                editable
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mt: "2rem", width: "100%" }}
                InputLabelProps={{
                  sx: {
                    backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                    transform: 'translate(14px, 2px) scale(1)',
                    '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                  }
                }}
              />
            </>
             )} 
          </>
           )} 
          <HDropdown
            name="clientAuth"
            options={clientAuthOptions}
            value={clientAuth}
            onChange={(e) => setClientAuth(e.target.value)}
            placeholder={intl.formatMessage({id:"label.client.auth", defaultMessage: "Client Authentication"})}
            width="100%"
            sx={{ marginTop: "2rem" }}
          />
        </>
    </HDialog>
  );
};

export default OAuthPopup;

OAuthPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
