import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewTestPage = () => {
    return (
        <WebView source={{ uri: "file:///android_asset/matt-try.html" }} />
    );
  };
  
export default WebViewTestPage;